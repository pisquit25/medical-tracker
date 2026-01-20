import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useMedical } from '../context/MedicalContext';

const Chart = () => {
  const { parameters, measurements, calculateCustomRange } = useMedical();
  const [selectedParameter, setSelectedParameter] = useState('Glicemia');
  const [showStandardRange, setShowStandardRange] = useState(true);
  const [showCustomRange, setShowCustomRange] = useState(true);

  const currentParameter = parameters.find(p => p.name === selectedParameter);
  const customRange = calculateCustomRange(selectedParameter);

  const chartData = measurements
    .filter(m => m.parameter === selectedParameter)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      fullDate: m.date,
      value: m.value,
      id: m.id,
      includedInFormula: m.includedInFormula
    }));

  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 100];
    
    const values = chartData.map(d => d.value);
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);
    
    if (showStandardRange && currentParameter?.standardRange) {
      minValue = Math.min(minValue, currentParameter.standardRange.min);
      maxValue = Math.max(maxValue, currentParameter.standardRange.max);
    }

    if (showCustomRange && customRange) {
      minValue = Math.min(minValue, customRange.min);
      maxValue = Math.max(maxValue, customRange.max);
    }

    const padding = (maxValue - minValue) * 0.15;
    return [Math.max(0, minValue - padding), maxValue + padding];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
        <p className="font-bold text-gray-900 mb-1">{data.fullDate}</p>
        <p className="text-2xl font-bold" style={{ color: currentParameter?.color }}>
          {data.value} {currentParameter?.unit}
        </p>
      </div>
    );
  };

  return (
    <div className="card animate-slide-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Andamento Temporale
        </h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showStandardRange}
              onChange={(e) => setShowStandardRange(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Range Standard</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCustomRange}
              onChange={(e) => setShowCustomRange(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Range Personalizzato</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={selectedParameter}
          onChange={(e) => setSelectedParameter(e.target.value)}
          className="input max-w-xs"
        >
          {parameters.map(p => (
            <option key={p.name} value={p.name}>
              {p.name} ({p.unit})
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 ? (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={getYAxisDomain()}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ 
                  value: currentParameter?.unit, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '14px', fill: '#6b7280', fontWeight: '600' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {showStandardRange && currentParameter?.standardRange && (
                <ReferenceArea
                  y1={currentParameter.standardRange.min}
                  y2={currentParameter.standardRange.max}
                  fill="#10b981"
                  fillOpacity={0.15}
                  label={{
                    value: 'Range Standard',
                    position: 'insideTopRight',
                    style: { fontSize: '12px', fill: '#059669', fontWeight: '600' }
                  }}
                />
              )}

              {showCustomRange && customRange && (
                <ReferenceArea
                  y1={customRange.min}
                  y2={customRange.max}
                  fill="#f59e0b"
                  fillOpacity={0.15}
                  label={{
                    value: 'Range Personalizzato',
                    position: 'insideBottomRight',
                    style: { fontSize: '12px', fill: '#d97706', fontWeight: '600' }
                  }}
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke={currentParameter?.color || '#3b82f6'}
                strokeWidth={3}
                dot={{ 
                  fill: currentParameter?.color || '#3b82f6', 
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
                activeDot={{ r: 8 }}
                name={currentParameter?.name}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-lg font-semibold text-gray-700">Nessun dato disponibile</p>
            <p className="text-sm text-gray-500 mt-2">Aggiungi almeno una misurazione per visualizzare il grafico</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showStandardRange && currentParameter?.standardRange && (
          <div className="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-emerald-900">Range Standard</h4>
            </div>
            <p className="text-sm text-emerald-800 font-semibold">
              {currentParameter.standardRange.min} - {currentParameter.standardRange.max} {currentParameter.unit}
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Valori di riferimento popolazione generale
            </p>
          </div>
        )}

        {showCustomRange && customRange && (
          <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h4 className="font-bold text-amber-900">Range Personalizzato</h4>
            </div>
            <p className="text-sm text-amber-800 font-semibold">
              {customRange.min.toFixed(2)} - {customRange.max.toFixed(2)} {currentParameter?.unit}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Media: {customRange.mean.toFixed(2)} | SD: {customRange.sd.toFixed(2)}
            </p>
            <p className="text-xs text-amber-700">
              Formula: {currentParameter?.customFormula}
            </p>
            <p className="text-xs text-amber-700">
              Basato su {measurements.filter(m => m.parameter === selectedParameter && m.includedInFormula).length} misurazioni
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
