import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSetpoint as calculateSetpointHybrid } from '../utils/setpointCalculator';

const MedicalContext = createContext();

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within MedicalProvider');
  }
  return context;
};

const defaultParameters = [
  { 
    id: 'param_1',
    name: 'Glicemia', 
    unit: 'mg/dL',
    unitCategory: 'glucose',
    availableUnits: ['mg/dL', 'mmol/L'],
    standardRange: { min: 70, max: 100 },
    color: '#3b82f6'
  },
  { 
    id: 'param_2',
    name: 'VES', 
    unit: 'mm/h',
    unitCategory: 'generic',
    availableUnits: ['mm/h'],
    standardRange: { min: 0, max: 20 },
    color: '#8b5cf6'
  },
  { 
    id: 'param_3',
    name: 'TSH', 
    unit: 'mIU/L',
    unitCategory: 'thyroid',
    availableUnits: ['mIU/L', 'µIU/mL'],
    standardRange: { min: 0.4, max: 4.0 },
    color: '#ec4899'
  },
  { 
    id: 'param_4',
    name: 'Colesterolo Totale', 
    unit: 'mg/dL',
    unitCategory: 'cholesterol',
    availableUnits: ['mg/dL', 'mmol/L'],
    standardRange: { min: 0, max: 200 },
    color: '#f59e0b'
  },
  { 
    id: 'param_5',
    name: 'Emoglobina', 
    unit: 'g/dL',
    unitCategory: 'hemoglobin',
    availableUnits: ['g/dL', 'g/L', 'mmol/L'],
    standardRange: { min: 12, max: 16 },
    color: '#10b981'
  }
];

export const MedicalProvider = ({ children }) => {
  const [parameters, setParameters] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  // Load parameters from localStorage
  useEffect(() => {
    const savedParams = localStorage.getItem('medicalParameters');
    if (savedParams) {
      try {
        setParameters(JSON.parse(savedParams));
      } catch (error) {
        console.error('Error loading parameters:', error);
        setParameters(defaultParameters);
      }
    } else {
      setParameters(defaultParameters);
    }
  }, []);

  // Save parameters to localStorage
  useEffect(() => {
    if (parameters.length > 0) {
      localStorage.setItem('medicalParameters', JSON.stringify(parameters));
    }
  }, [parameters]);

  // Load measurements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medicalMeasurements');
    if (saved) {
      try {
        setMeasurements(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading measurements:', error);
      }
    }
  }, []);

  // Save measurements to localStorage
  useEffect(() => {
    localStorage.setItem('medicalMeasurements', JSON.stringify(measurements));
  }, [measurements]);

  // Parameter CRUD operations
  const addParameter = (parameter) => {
    const newParam = {
      ...parameter,
      id: `param_${Date.now()}`
    };
    setParameters(prev => [...prev, newParam]);
  };

  const updateParameter = (id, updatedData) => {
    setParameters(prev => prev.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    ));
  };

  const deleteParameter = (id) => {
    // Remove parameter
    setParameters(prev => prev.filter(p => p.id !== id));
    
    // Remove all measurements for this parameter
    const paramToDelete = parameters.find(p => p.id === id);
    if (paramToDelete) {
      setMeasurements(prev => prev.filter(m => m.parameter !== paramToDelete.name));
    }
  };

  // Measurement operations
  const addMeasurement = (measurement) => {
    setMeasurements(prev => [...prev, {
      ...measurement,
      id: Date.now(),
      value: parseFloat(measurement.value),
      patientId: measurement.patientId || null,
      includedInFormula: true  // Inizialmente inclusa, poi verrà aggiornata
    }]);
  };

  const removeMeasurement = (id) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const toggleIncludeInFormula = (id) => {
    setMeasurements(prev => prev.map(m => 
      m.id === id ? { ...m, includedInFormula: !m.includedInFormula } : m
    ));
  };

  // NUOVO: Aggiorna automaticamente gli outlier quando cambiano le misurazioni
  useEffect(() => {
    if (measurements.length === 0) return;

    // Raggruppa per parametro e paziente
    const groupedMeasurements = {};
    measurements.forEach(m => {
      const key = `${m.parameter}_${m.patientId || 'null'}`;
      if (!groupedMeasurements[key]) {
        groupedMeasurements[key] = [];
      }
      groupedMeasurements[key].push(m);
    });

    // Per ogni gruppo, calcola setpoint e identifica outlier
    let hasChanges = false;
    const updatedMeasurements = [...measurements];

    Object.entries(groupedMeasurements).forEach(([key, groupMeasurements]) => {
      if (groupMeasurements.length < 5) {
        // Con poche misurazioni, tutte incluse
        groupMeasurements.forEach(m => {
          const idx = updatedMeasurements.findIndex(um => um.id === m.id);
          if (idx !== -1 && !updatedMeasurements[idx].includedInFormula) {
            updatedMeasurements[idx].includedInFormula = true;
            hasChanges = true;
          }
        });
        return;
      }

      const setpointResult = calculateSetpointHybrid(groupMeasurements);
      
      if (setpointResult && !setpointResult.error) {
        // Se metodo robusto, usa gli outlier identificati
        if (setpointResult.methodUsed === 'robust' && setpointResult.outliers) {
          const outlierValues = setpointResult.outliers.values || [];
          
          groupMeasurements.forEach(m => {
            const idx = updatedMeasurements.findIndex(um => um.id === m.id);
            if (idx !== -1) {
              const isOutlier = outlierValues.some(ov => Math.abs(ov - m.value) < 0.01);
              const shouldBeIncluded = !isOutlier;
              
              if (updatedMeasurements[idx].includedInFormula !== shouldBeIncluded) {
                updatedMeasurements[idx].includedInFormula = shouldBeIncluded;
                hasChanges = true;
              }
            }
          });
        }
      }
    });

    if (hasChanges) {
      setMeasurements(updatedMeasurements);
    }
  }, [measurements.length]); // Solo quando cambia il numero di misurazioni

  const calculateCustomRange = (parameterName, patientId = null) => {
    const paramMeasurements = measurements.filter(
      m => m.parameter === parameterName && 
           (!patientId || m.patientId === patientId)
    );

    if (paramMeasurements.length < 5) return null;

    // USA SETPOINT (Robust o GMM) invece di media semplice
    const setpointResult = calculateSetpointHybrid(paramMeasurements);
    
    if (!setpointResult || setpointResult.error) return null;

    const { setpoint, std } = setpointResult;

    // Multiplier FISSO a 1.5 (range personalizzato automatico)
    const multiplier = 1.5;

    return {
      min: setpoint - (multiplier * std),
      max: setpoint + (multiplier * std),
      mean: setpoint,
      sd: std,
      method: setpointResult.methodUsed,
      confidence: setpointResult.confidence
    };
  };

  // NUOVO: Calcola setpoint con metodo ibrido (Robust < 20, GMM >= 20)
  const calculateSetpoint = (parameterName, patientId = null) => {
    const paramMeasurements = measurements.filter(
      m => m.parameter === parameterName &&
           (!patientId || m.patientId === patientId)
    );

    if (paramMeasurements.length === 0) return null;

    return calculateSetpointHybrid(paramMeasurements);
  };

  const exportData = () => {
    const dataToExport = {
      parameters,
      measurements,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Check if it's the new format with parameters
          if (importedData.parameters && importedData.measurements) {
            setParameters(importedData.parameters);
            setMeasurements(importedData.measurements);
          } else if (Array.isArray(importedData)) {
            // Old format - just measurements
            setMeasurements(importedData);
          } else {
            throw new Error('Invalid file format');
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  };

  const value = {
    parameters,
    measurements,
    addParameter,
    updateParameter,
    deleteParameter,
    addMeasurement,
    removeMeasurement,
    toggleIncludeInFormula,
    calculateCustomRange,
    calculateSetpoint,
    exportData,
    importData
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};
