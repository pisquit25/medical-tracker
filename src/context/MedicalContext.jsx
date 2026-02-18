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
  },
  { 
    id: 'param_6',
    name: 'Sodiemia', 
    unit: 'mmol/L',
    unitCategory: 'electrolytes',
    availableUnits: ['mmol/L', 'mEq/L'],
    standardRange: { min: 135, max: 145 },
    color: '#06b6d4'
  },
  { 
    id: 'param_7',
    name: 'Azotemia', 
    unit: 'mg/dL',
    unitCategory: 'renal',
    availableUnits: ['mg/dL', 'mmol/L'],
    standardRange: { min: 15, max: 50 },
    color: '#f43f5e'
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
        const parsed = JSON.parse(savedParams);
        // Auto-merge: aggiungi parametri mancanti da defaultParameters
        const savedIds = parsed.map(p => p.id);
        const missingParams = defaultParameters.filter(p => !savedIds.includes(p.id));
        
        if (missingParams.length > 0) {
          console.log('✅ Aggiunti parametri mancanti:', missingParams.map(p => p.name));
          const merged = [...parsed, ...missingParams];
          setParameters(merged);
          localStorage.setItem('medicalParameters', JSON.stringify(merged));
        } else {
          setParameters(parsed);
        }
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
    setMeasurements(prev => {
      const newMeasurements = [...prev, {
        ...measurement,
        id: Date.now(),
        value: parseFloat(measurement.value),
        patientId: measurement.patientId || null,
        includedInFormula: true
      }];
      
      // Trigger ricalcolo ratios
      window.dispatchEvent(new CustomEvent('measurementsUpdated', { 
        detail: { measurements: newMeasurements } 
      }));
      
      return newMeasurements;
    });
  };

  const removeMeasurement = (id) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const toggleIncludeInFormula = (id) => {
    setMeasurements(prev => {
      const updated = prev.map(m => 
        m.id === id ? { ...m, includedInFormula: !m.includedInFormula } : m
      );
      
      // Trigger ricalcolo ratios
      window.dispatchEvent(new CustomEvent('measurementsUpdated', { 
        detail: { measurements: updated } 
      }));
      
      return updated;
    });
  };

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

  // NUOVO: Helper per verificare se una misurazione è outlier
  const isOutlier = (measurementId) => {
    const measurement = measurements.find(m => m.id === measurementId);
    if (!measurement) return false;

    // Ottieni tutte le misurazioni dello stesso parametro e paziente
    const paramMeasurements = measurements.filter(
      m => m.parameter === measurement.parameter && 
           m.patientId === measurement.patientId
    );

    if (paramMeasurements.length < 5) return false;

    const setpointResult = calculateSetpointHybrid(paramMeasurements);
    
    if (!setpointResult || setpointResult.error) return false;
    if (setpointResult.methodUsed !== 'robust') return false;
    if (!setpointResult.outliers) return false;

    const outlierValues = setpointResult.outliers.values || [];
    return outlierValues.some(ov => Math.abs(ov - measurement.value) < 0.01);
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
    isOutlier,
    exportData,
    importData
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};
