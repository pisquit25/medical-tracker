import React, { createContext, useContext, useState, useEffect } from 'react';

const RatioContext = createContext();

export const useRatio = () => {
  const context = useContext(RatioContext);
  if (!context) {
    throw new Error('useRatio must be used within RatioProvider');
  }
  return context;
};

// Rapporti predefiniti
const predefinedRatios = [
  {
    id: 'ratio_1',
    name: 'Osmolalità Plasmatica',
    formula: '(Glicemia / 18) + (Azotemia / 2.8) + (2 * Sodiemia)',
    formulaComponents: [
      { type: 'parenthesis', value: '(' },
      { type: 'parameter', value: 'Glicemia' },
      { type: 'operator', value: '/' },
      { type: 'number', value: 18 },
      { type: 'parenthesis', value: ')' },
      { type: 'operator', value: '+' },
      { type: 'parenthesis', value: '(' },
      { type: 'parameter', value: 'Azotemia' },
      { type: 'operator', value: '/' },
      { type: 'number', value: 2.8 },
      { type: 'parenthesis', value: ')' },
      { type: 'operator', value: '+' },
      { type: 'parenthesis', value: '(' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '*' },
      { type: 'parameter', value: 'Sodiemia' },
      { type: 'parenthesis', value: ')' },
    ],
    parameters: ['Glicemia', 'Azotemia', 'Sodiemia'],
    unit: 'mOsm/kg',
    standardRange: { min: 291, max: 299 },
    color: '#8b5cf6',
    description: 'Misura la concentrazione totale di soluti nel plasma'
  }
];

export const RatioProvider = ({ children }) => {
  // Carica ratios da localStorage
  const [ratios, setRatios] = useState(() => {
    const saved = localStorage.getItem('medicalRatios');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Aggiungi predefined se non presenti
        const predefinedIds = predefinedRatios.map(r => r.id);
        const hasPredefined = parsed.some(r => predefinedIds.includes(r.id));
        if (!hasPredefined) {
          return [...predefinedRatios, ...parsed.filter(r => !predefinedIds.includes(r.id))];
        }
        return parsed;
      } catch (e) {
        return predefinedRatios;
      }
    }
    return predefinedRatios;
  });

  // Calcoli dei ratios (risultati storici)
  const [ratioCalculations, setRatioCalculations] = useState(() => {
    const saved = localStorage.getItem('ratioCalculations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Salva ratios in localStorage
  useEffect(() => {
    localStorage.setItem('medicalRatios', JSON.stringify(ratios));
  }, [ratios]);

  // Salva calculations in localStorage
  useEffect(() => {
    localStorage.setItem('ratioCalculations', JSON.stringify(ratioCalculations));
  }, [ratioCalculations]);

  // Ascolta eventi di aggiornamento measurements
  useEffect(() => {
    const handleMeasurementsUpdate = (event) => {
      const { measurements } = event.detail;
      const activePatientId = localStorage.getItem('activePatientId');
      
      if (activePatientId && measurements && measurements.length > 0) {
        console.log('🔄 Ricalcolo ratios triggered da evento measurements');
        // Ricalcola direttamente qui invece di chiamare recalculateRatios
        const newCalculations = [];

        ratios.forEach(ratio => {
          const measurementsByDate = {};
          
          measurements
            .filter(m => m.patientId === activePatientId && m.includedInFormula)
            .forEach(m => {
              const date = m.date;
              if (!measurementsByDate[date]) {
                measurementsByDate[date] = {};
              }
              measurementsByDate[date][m.parameter] = m.value;
            });

          Object.keys(measurementsByDate).forEach(date => {
            const dateValues = measurementsByDate[date];
            const hasAllParams = ratio.parameters.every(param => 
              dateValues.hasOwnProperty(param)
            );

            if (hasAllParams) {
              try {
                let expression = '';
                for (const comp of ratio.formulaComponents) {
                  if (comp.type === 'parameter') {
                    expression += dateValues[comp.value];
                  } else if (comp.type === 'number') {
                    expression += comp.value;
                  } else if (comp.type === 'operator') {
                    expression += ` ${comp.value} `;
                  } else if (comp.type === 'parenthesis') {
                    expression += comp.value;
                  }
                }
                
                const result = Function(`"use strict"; return (${expression})`)();
                
                if (!isNaN(result) && isFinite(result)) {
                  newCalculations.push({
                    id: `calc_${Date.now()}_${Math.random()}`,
                    ratioId: ratio.id,
                    ratioName: ratio.name,
                    patientId: activePatientId,
                    date,
                    value: result,
                    parameters: { ...dateValues },
                    timestamp: Date.now()
                  });
                }
              } catch (error) {
                console.error(`Errore calcolo ${ratio.name}:`, error);
              }
            }
          });
        });

        console.log(`✅ Calcolati ${newCalculations.length} ratios`);
        setRatioCalculations(newCalculations);
      }
    };
    
    window.addEventListener('measurementsUpdated', handleMeasurementsUpdate);
    
    return () => {
      window.removeEventListener('measurementsUpdated', handleMeasurementsUpdate);
    };
  }, [ratios]); // Dipende da ratios

  // Aggiungi nuovo ratio
  const addRatio = (ratio) => {
    const newRatio = {
      ...ratio,
      id: `ratio_${Date.now()}`,
      predefined: false
    };
    setRatios([...ratios, newRatio]);
    return newRatio;
  };

  // Aggiorna ratio
  const updateRatio = (id, updates) => {
    setRatios(ratios.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Elimina ratio
  const deleteRatio = (id) => {
    setRatios(ratios.filter(r => r.id !== id));
    // Elimina anche i calcoli associati
    setRatioCalculations(ratioCalculations.filter(c => c.ratioId !== id));
  };

  // Valuta formula con componenti
  const evaluateFormula = (components, parameterValues, existingCalculations = []) => {
    let expression = '';
    
    for (const comp of components) {
      if (comp.type === 'parameter') {
        // Se è un parametro, usa il valore
        const value = parameterValues[comp.value];
        if (value === undefined || value === null) {
          throw new Error(`Parametro mancante: ${comp.value}`);
        }
        expression += value;
      } else if (comp.type === 'ratio') {
        // Se è un ratio, cerca il calcolo più recente per quella data
        const ratioCalc = existingCalculations
          .filter(c => c.ratioName === comp.value)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        if (!ratioCalc) {
          throw new Error(`Calcolo ratio mancante: ${comp.value}`);
        }
        expression += ratioCalc.value;
      } else if (comp.type === 'number') {
        expression += comp.value;
      } else if (comp.type === 'operator') {
        expression += ` ${comp.value} `;
      } else if (comp.type === 'parenthesis') {
        expression += comp.value;
      }
    }

    // Valuta espressione matematica in modo sicuro
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expression})`)();
      return result;
    } catch (error) {
      throw new Error(`Errore valutazione formula: ${error.message}`);
    }
  };

  // Calcola ratio da measurements
  const calculateRatio = (ratio, measurements, patientId) => {
    // Raggruppa misurazioni per data
    const measurementsByDate = {};
    
    measurements
      .filter(m => m.patientId === patientId && m.includedInFormula)
      .forEach(m => {
        const date = m.date;
        if (!measurementsByDate[date]) {
          measurementsByDate[date] = {};
        }
        measurementsByDate[date][m.parameter] = m.value;
      });

    const results = [];

    // Per ogni data, verifica se ci sono tutti i parametri necessari
    Object.keys(measurementsByDate).forEach(date => {
      const dateValues = measurementsByDate[date];
      
      // Controlla se tutti i parametri necessari sono presenti
      const hasAllParams = ratio.parameters.every(param => 
        dateValues.hasOwnProperty(param)
      );

      if (hasAllParams) {
        try {
          // Valuta la formula
          const result = evaluateFormula(ratio.formulaComponents, dateValues, ratioCalculations);
          
          if (!isNaN(result) && isFinite(result)) {
            results.push({
              date,
              value: result,
              parameters: { ...dateValues }
            });
          }
        } catch (error) {
          console.error(`Errore calcolo ratio ${ratio.name} per data ${date}:`, error);
        }
      }
    });

    return results.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Ricalcola tutti i ratios per un paziente
  const recalculateRatios = (measurements, patientId) => {
    const newCalculations = [];

    // Ordina ratios: prima quelli senza dipendenze da altri ratios
    const sortedRatios = [...ratios].sort((a, b) => {
      const aUsesRatios = a.formulaComponents.some(c => c.type === 'ratio');
      const bUsesRatios = b.formulaComponents.some(c => c.type === 'ratio');
      if (aUsesRatios && !bUsesRatios) return 1;
      if (!aUsesRatios && bUsesRatios) return -1;
      return 0;
    });

    sortedRatios.forEach(ratio => {
      const results = calculateRatio(ratio, measurements, patientId);
      
      results.forEach(result => {
        const calculation = {
          id: `calc_${Date.now()}_${Math.random()}`,
          ratioId: ratio.id,
          ratioName: ratio.name,
          patientId,
          date: result.date,
          value: result.value,
          parameters: result.parameters,
          timestamp: Date.now()
        };
        newCalculations.push(calculation);
      });
    });

    setRatioCalculations(newCalculations);
    return newCalculations;
  };

  // Ottieni calcoli per un ratio specifico
  const getRatioCalculations = (ratioId, patientId) => {
    return ratioCalculations
      .filter(c => c.ratioId === ratioId && c.patientId === patientId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Ottieni ultimi N calcoli per un ratio
  const getLatestCalculations = (ratioId, patientId, limit = 10) => {
    return ratioCalculations
      .filter(c => c.ratioId === ratioId && c.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Costruisci formula leggibile
  const buildFormulaString = (components) => {
    return components.map(comp => {
      if (comp.type === 'parameter' || comp.type === 'ratio') {
        return comp.value;
      } else if (comp.type === 'number') {
        return comp.value.toString();
      } else if (comp.type === 'operator') {
        return ` ${comp.value} `;
      } else if (comp.type === 'parenthesis') {
        return comp.value;
      }
      return '';
    }).join('');
  };

  // Valida formula
  const validateFormula = (components) => {
    if (!components || components.length === 0) {
      return { valid: false, error: 'Formula vuota' };
    }

    // Verifica bilanciamento parentesi
    let openParens = 0;
    for (const comp of components) {
      if (comp.type === 'parenthesis') {
        if (comp.value === '(') openParens++;
        else if (comp.value === ')') openParens--;
        if (openParens < 0) return { valid: false, error: 'Parentesi non bilanciate' };
      }
    }
    if (openParens !== 0) {
      return { valid: false, error: 'Parentesi non bilanciate' };
    }

    // Verifica sequenza logica
    for (let i = 0; i < components.length - 1; i++) {
      const current = components[i];
      const next = components[i + 1];

      // Non possono esserci due operatori consecutivi
      if (current.type === 'operator' && next.type === 'operator') {
        return { valid: false, error: 'Operatori consecutivi non permessi' };
      }
    }

    return { valid: true };
  };

  const value = {
    ratios,
    ratioCalculations,
    addRatio,
    updateRatio,
    deleteRatio,
    calculateRatio,
    recalculateRatios,
    getRatioCalculations,
    getLatestCalculations,
    buildFormulaString,
    validateFormula,
    predefinedRatios
  };

  return (
    <RatioContext.Provider value={value}>
      {children}
    </RatioContext.Provider>
  );
};
