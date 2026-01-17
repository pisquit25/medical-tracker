import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Plus, Trash2, Eye, EyeOff, Download, Upload } from 'lucide-react';

function App() {
  const [parameters] = useState([
    { 
      name: 'Glicemia', 
      unit: 'mg/dL',
      standardRange: { min: 70, max: 100 },
      customFormula: 'mean ± 1.5*sd'
    },
    { 
      name: 'VES', 
      unit: 'mm/h',
      standardRange: { min: 0, max: 20 },
      customFormula: 'mean ± 2*sd'
    },
    { 
      name: 'TSH', 
      unit: 'mIU/L',
      standardRange: { min: 0.4, max: 4.0 },
      customFormula: 'mean ± 1.5*sd'
    },
    { 
      name: 'Colesterolo Totale', 
      unit: 'mg/dL',
      standardRange: { min: 0, max: 200 },
      customFormula: 'mean ± 1.5*sd'
    },
    { 
      name: 'Emoglobina', 
      unit: 'g/dL',
      standardRange: { min: 12, max: 16 },
      customFormula: 'mean ± 1.5*sd'
    }
  ]);

  const [measurements, setMeasurements] = useState([]);
  const [newMeasurement, setNewMeasurement] = useState({
    parameter: 'Glicemia',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedParameter, setSelectedParameter] = useState('Glicemia');
  const [showStandardRange, setShowStandardRange] = useState(true);
  const [showCustomRange, setShowCustomRange] = useState(true);

  // Carica dati dal localStorage all'avvio
  useEffect(() => {
    const savedMeasurements = localStorage.getItem('medicalMeasurements');
    if (savedMeasurements) {
      setMeasurements(JSON.parse(savedMeasurements));
    }
  }, []);

  // Salva dati nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('medicalMeasurements', JSON.stringify(measurements));
  }, [measurements]);

  // Aggiungi misurazione
  const addMeasurement = () => {
    if (newMeasurement.value && newMeasurement.date) {
      setMeasurements([
        ...measurements,
        {
          ...newMeasurement,
          id: Date.now(),
          value: parseFloat(newMeasurement.value),
          includedInFormula: true
        }
      ]);
      setNewMeasurement({
        ...newMeasurement,
        value: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Rimuovi misurazione
  const removeMeasurement = (id) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  // Toggle inclusione nella formula
  const toggleIncludeInFormula = (id) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, includedInFormula: !m.includedInFormula } : m
    ));
  };

  // Calcola intervallo personalizzato
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
    
    // Parsing della formula
    let multiplier = 1.5;
    if (parameter.customFormula.includes('2*sd')) multiplier = 2;
    if (parameter.customFormula.includes('1*sd')) multiplier = 1;
    if (parameter.customFormula.includes('1.5*sd')) multiplier = 1.5;

    return {
      min: mean - (multiplier * sd),
      max: mean + (multiplier * sd),
      mean: mean,
      sd: sd
    };
  };

  // Prepara dati per il grafico
  const getChartData = () => {
    const paramMeasurements = measurements
      .filter(m => m.parameter === selectedParameter)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return paramMeasurements.map(m => ({
      date: m.date,
      value: m.value,
      id: m.id,
      includedInFormula: m.includedInFormula
    }));
  };

  const chartData = getChartData();
  const currentParameter = parameters.find(p => p.name === selectedParameter);
  const customRange = calculateCustomRange(selectedParameter);

  // Calcola range Y del grafico
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 100];
    
    const values = chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    let rangeMin = minValue;
    let rangeMax = maxValue;

    if (showStandardRange && currentParameter.standardRange) {
      rangeMin = Math.min(rangeMin, currentParameter.standardRange.min);
      rangeMax = Math.max(rangeMax, currentParameter.standardRange.max);
    }

    if (showCustomRange && customRange) {
      rangeMin = Math.min(rangeMin, customRange.min);
      rangeMax = Math.max(rangeMax, customRange.max);
    }

    const padding = (rangeMax - rangeMin) * 0.1;
    return [Math.max(0, rangeMin - padding), rangeMax + padding];
  };

  // Esporta dati
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

  // Importa dati
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setMeasurements(importedData);
          alert('Dati importati con successo!');
        } catch (error) {
          alert('Errore nell\'importazione dei dati. Assicurati che il file sia valido.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Gestisci pressione Enter nel form
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMeasurement();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
            📊 Tracker Parametri Medici
          </h1>
          <p className="text-gray-600">Monitora i tuoi valori di salute nel tempo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pannello inserimento dati */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Nuova Misurazione</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parametro
                </label>
                <select
                  value={newMeasurement.parameter}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, parameter: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {parameters.map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valore
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMeasurement.value}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Es: 95"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={newMeasurement.date}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={addMeasurement}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-semibold"
              >
                <Plus size={20} />
                Aggiungi Misurazione
              </button>
            </div>

            {/* Pulsanti import/export */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={exportData}
                disabled={measurements.length === 0}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Esporta
              </button>
              <label className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm cursor-pointer">
                <Upload size={16} />
                Importa
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>

            {/* Lista misurazioni */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Misurazioni Recenti ({measurements.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {measurements
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 15)
                  .map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border transition ${
                        m.includedInFormula 
                          ? 'bg-white border-gray-200 hover:border-indigo-300' 
                          : 'bg-gray-100 border-gray-300 opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{m.parameter}</div>
                          <div className="text-sm text-gray-600">
                            {m.value} {parameters.find(p => p.name === m.parameter)?.unit}
                          </div>
                          <div className="text-xs text-gray-500">{m.date}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleIncludeInFormula(m.id)}
                            className={`transition ${
                              m.includedInFormula 
                                ? 'text-indigo-600 hover:text-indigo-800' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={m.includedInFormula ? "Escludi dalla formula" : "Includi nella formula"}
                          >
                            {m.includedInFormula ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => removeMeasurement(m.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Elimina misurazione"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {measurements.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nessuna misurazione ancora.<br/>
                    Aggiungi la prima!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pannello grafico */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Andamento Temporale</h2>
              
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStandardRange}
                    onChange={(e) => setShowStandardRange(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Range Standard</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCustomRange}
                    onChange={(e) => setShowCustomRange(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Range Personalizzato</span>
                </label>
              </div>
            </div>

            {/* Selezione parametro */}
            <div className="mb-6">
              <select
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {parameters.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Grafico */}
            {chartData.length > 0 ? (
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      domain={getYAxisDomain()}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      label={{ 
                        value: currentParameter?.unit, 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: '14px', fill: '#6b7280' }
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    />
                    <Legend />

                    {/* Range Standard */}
                    {showStandardRange && currentParameter.standardRange && (
                      <ReferenceArea
                        y1={currentParameter.standardRange.min}
                        y2={currentParameter.standardRange.max}
                        fill="#86efac"
                        fillOpacity={0.3}
                        label="Range Standard"
                      />
                    )}

                    {/* Range Personalizzato */}
                    {showCustomRange && customRange && (
                      <ReferenceArea
                        y1={customRange.min}
                        y2={customRange.max}
                        fill="#fbbf24"
                        fillOpacity={0.2}
                        label="Range Personalizzato"
                      />
                    )}

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ fill: '#4f46e5', r: 5 }}
                      activeDot={{ r: 7 }}
                      name={currentParameter?.name}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500 mb-6">
                <div className="text-center">
                  <p className="text-lg mb-2">📈 Nessun dato disponibile</p>
                  <p className="text-sm">Aggiungi la prima misurazione per visualizzare il grafico</p>
                </div>
              </div>
            )}

            {/* Info range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showStandardRange && currentParameter.standardRange && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">📏 Range Standard</h4>
                  <p className="text-sm text-green-800">
                    <strong>{currentParameter.standardRange.min}</strong> - <strong>{currentParameter.standardRange.max}</strong> {currentParameter.unit}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Valori di riferimento popolazione generale
                  </p>
                </div>
              )}

              {showCustomRange && customRange && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">🎯 Range Personalizzato</h4>
                  <p className="text-sm text-yellow-800">
                    <strong>{customRange.min.toFixed(2)}</strong> - <strong>{customRange.max.toFixed(2)}</strong> {currentParameter.unit}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Media: {customRange.mean.toFixed(2)} | SD: {customRange.sd.toFixed(2)}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Formula: {currentParameter.customFormula}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Basato su {measurements.filter(m => m.parameter === selectedParameter && m.includedInFormula).length} misurazioni
                  </p>
                </div>
              )}

              {!showStandardRange && !showCustomRange && (
                <div className="col-span-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-600">Attiva almeno un range per visualizzare le informazioni</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>💡 I dati vengono salvati automaticamente nel tuo browser</p>
          <p className="mt-1">Usa Esporta/Importa per fare backup dei tuoi dati</p>
        </div>
      </div>
    </div>
  );
}

export default App;
