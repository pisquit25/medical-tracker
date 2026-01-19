import React, { createContext, useContext, useState, useEffect } from 'react';

const MedicalContext = createContext();

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within MedicalProvider');
  }
  return context;
};

export const MedicalProvider = ({ children }) => {
  const [parameters] = useState([
    { 
      name: 'Glicemia', 
      unit: 'mg/dL',
      standardRange: { min: 70, max: 100 },
      customFormula: 'mean ± 1.5*sd',
      color: '#3b82f6'
    },
    { 
      name: 'VES', 
      unit: 'mm/h',
      standardRange: { min: 0, max: 20 },
      customFormula: 'mean ± 2*sd',
      color: '#8b5cf6'
    },
    { 
      name: 'TSH', 
      unit: 'mIU/L',
      standardRange: { min: 0.4, max: 4.0 },
      customFormula: 'mean ± 1.5*sd',
      color: '#ec4899'
    },
    { 
      name: 'Colesterolo Totale', 
      unit: 'mg/dL',
      standardRange: { min: 0, max: 200 },
      customFormula: 'mean ± 1.5*sd',
      color: '#f59e0b'
    },
    { 
      name: 'Emoglobina', 
      unit: 'g/dL',
      standardRange: { min: 12, max: 16 },
      customFormula: 'mean ± 1.5*sd',
      color: '#10b981'
    }
  ]);

  const [measurements, setMeasurements] = useState([]);

  // Load from localStorage
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medicalMeasurements', JSON.stringify(measurements));
  }, [measurements]);

  const addMeasurement = (measurement) => {
    setMeasurements(prev => [...prev, {
      ...measurement,
      id: Date.now(),
      value: parseFloat(measurement.value),
      includedInFormula: true
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

  const calculateCustomRange = (parameterName) => {
    const paramMeasurements = measurements.filter(
      m => m.parameter === parameterName && m.includedInFormula
    );

    if (paramMeasurements.length < 2) return null;

    const values = paramMeasurements.map(m => m.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const sd = Math.sqrt(variance);

    const parameter = parameters.find(p => p.name === parameterName);
    
    let multiplier = 1.5;
    if (parameter.customFormula.includes('2*sd')) multiplier = 2;
    if (parameter.customFormula.includes('1*sd')) multiplier = 1;

    return {
      min: mean - (multiplier * sd),
      max: mean + (multiplier * sd),
      mean,
      sd
    };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(measurements, null, 2);
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
          setMeasurements(importedData);
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
    addMeasurement,
    removeMeasurement,
    toggleIncludeInFormula,
    calculateCustomRange,
    exportData,
    importData
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};
