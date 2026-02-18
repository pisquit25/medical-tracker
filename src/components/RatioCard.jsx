import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { useRatio } from '../context/RatioContext';

const RatioCard = ({ ratio, latestCalculation, status, calculationsCount }) => {
  const { buildFormulaString } = useRatio();

  const formulaString = buildFormulaString(ratio.formulaComponents);

  // Calcola trend (rispetto calcolo precedente)
  const getTrend = () => {
    if (!latestCalculation || calculationsCount < 2) return null;
    
    // Questo è semplificato - in produzione cercheremmo il penultimo valore
    return { type: 'stable', value: 0 };
  };

  const trend = getTrend();

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{ratio.name}</h2>
          {ratio.description && (
            <p className="text-sm text-gray-600 mb-3">{ratio.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {ratio.parameters.length} parametri
            </span>
            {ratio.unit && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                Unità: {ratio.unit}
              </span>
            )}
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {calculationsCount} calcoli
            </span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-semibold text-gray-600 mb-2">FORMULA</div>
        <div className="font-mono text-sm text-gray-900 break-all">
          {formulaString}
        </div>
      </div>

      {/* Range Standard */}
      {ratio.standardRange && (
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-600 mb-2">RANGE OTTIMALE</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gray-900">
              {ratio.standardRange.min} - {ratio.standardRange.max} {ratio.unit || ''}
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      )}

      {/* Ultimo Valore Calcolato */}
      {latestCalculation ? (
        <div className={`p-6 rounded-xl border-2 ${status ? status.border : 'border-gray-200'} ${status ? status.bgLight : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">ULTIMO VALORE</span>
            {status && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color} text-white`}>
                {status.label}
              </span>
            )}
          </div>
          
          <div className="flex items-end gap-3 mb-3">
            <div className="text-4xl font-bold text-gray-900">
              {latestCalculation.value.toFixed(2)}
            </div>
            {ratio.unit && (
              <div className="text-xl font-medium text-gray-600 pb-1">
                {ratio.unit}
              </div>
            )}
            {trend && trend.type !== 'stable' && (
              <div className={`flex items-center gap-1 pb-1 ${
                trend.type === 'up' ? 'text-red-600' : 'text-green-600'
              }`}>
                {trend.type === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="text-sm font-semibold">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Data: <strong>{new Date(latestCalculation.date).toLocaleDateString('it-IT')}</strong>
            </span>
            {status && ratio.standardRange && (
              <span className={status.textColor}>
                {latestCalculation.value < ratio.standardRange.min && '↓ Sotto range'}
                {latestCalculation.value > ratio.standardRange.max && '↑ Sopra range'}
                {latestCalculation.value >= ratio.standardRange.min && 
                 latestCalculation.value <= ratio.standardRange.max && '✓ In range'}
              </span>
            )}
          </div>

          {/* Parametri Usati */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">PARAMETRI USATI</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(latestCalculation.parameters).map(([param, value]) => (
                <div key={param} className="text-xs p-2 bg-white rounded border border-gray-200">
                  <div className="text-gray-600 mb-1">{param}</div>
                  <div className="font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-gray-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Nessun valore calcolato</p>
              <p className="text-xs">
                Inserisci misurazioni con la stessa data per: {ratio.parameters.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatioCard;
