import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const RatioChart = ({ calculations, ratio }) => {
  // Prepara dati per grafico
  const chartData = calculations.map(calc => {
    let status = 'neutral';
    if (ratio.standardRange) {
      const { min, max } = ratio.standardRange;
      if (calc.value >= min && calc.value <= max) {
        status = 'optimal';
      } else if (calc.value >= min * 0.95 && calc.value <= max * 1.05) {
        status = 'warning';
      } else {
        status = 'critical';
      }
    }

    return {
      date: new Date(calc.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      fullDate: calc.date,
      value: parseFloat(calc.value.toFixed(2)),
      status,
      parameters: calc.parameters
    };
  });

  // Determina colore punto in base allo stato
  const getDotColor = (status) => {
    switch (status) {
      case 'optimal': return '#10b981'; // Verde
      case 'warning': return '#f59e0b'; // Giallo
      case 'critical': return '#ef4444'; // Rosso
      default: return '#6b7280'; // Grigio
    }
  };

  // Custom Dot Component
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const color = getDotColor(payload.status);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    const statusLabels = {
      optimal: 'Ottimale',
      warning: 'Attenzione',
      critical: 'Critico',
      neutral: 'Normale'
    };

    const statusColors = {
      optimal: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
        <div className="font-semibold text-gray-900 mb-2">
          {new Date(data.fullDate).toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-gray-900">
            {data.value} {ratio.unit || ''}
          </div>
          {data.status !== 'neutral' && (
            <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold border ${statusColors[data.status]}`}>
              {statusLabels[data.status]}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="text-xs font-semibold text-gray-600 mb-1">Parametri:</div>
          <div className="space-y-1">
            {Object.entries(data.parameters).map(([param, value]) => (
              <div key={param} className="text-xs text-gray-700">
                <span className="font-medium">{param}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Calcola range asse Y (con margine)
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const margin = (maxValue - minValue) * 0.1 || 5;
  const yMin = Math.floor(minValue - margin);
  const yMax = Math.ceil(maxValue + margin);

  return (
    <div className="w-full" style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
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
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[yMin, yMax]}
            label={{ 
              value: ratio.unit || 'Valore', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '12px', fill: '#6b7280' }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linee range ottimale */}
          {ratio.standardRange && (
            <>
              <ReferenceLine
                y={ratio.standardRange.min}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: 'Min',
                  position: 'right',
                  fill: '#10b981',
                  fontSize: 12
                }}
              />
              <ReferenceLine
                y={ratio.standardRange.max}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: 'Max',
                  position: 'right',
                  fill: '#10b981',
                  fontSize: 12
                }}
              />
            </>
          )}
          
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Ottimale</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Attenzione</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Critico</span>
        </div>
        {ratio.standardRange && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-green-500"></div>
            <span className="text-gray-600">Range Ottimale</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatioChart;
