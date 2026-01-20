import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';

const StatusOverview = () => {
  const { measurements, parameters, calculateCustomRange } = useMedical();

  // Funzione per determinare lo stato di una misurazione
  const getMeasurementStatus = (measurement, parameter) => {
    const value = measurement.value;
    const standardRange = parameter.standardRange;
    const customRange = calculateCustomRange(parameter.name);

    let inStandardRange = false;
    let inCustomRange = false;

    // Check standard range
    if (standardRange) {
      inStandardRange = value >= standardRange.min && value <= standardRange.max;
    }

    // Check custom range
    if (customRange) {
      inCustomRange = value >= customRange.min && value <= customRange.max;
    }

    // Determina status
    if (inStandardRange && inCustomRange) {
      return { status: 'optimal', label: 'Ottimale', color: 'green' };
    } else if (inStandardRange || inCustomRange) {
      return { status: 'warning', label: 'Attenzione', color: 'yellow' };
    } else {
      return { status: 'critical', label: 'Fuori Range', color: 'red' };
    }
  };

  // Raggruppa le ultime misurazioni per parametro
  const getLatestMeasurements = () => {
    const latestByParam = {};
    
    parameters.forEach(param => {
      const paramMeasurements = measurements
        .filter(m => m.parameter === param.name)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (paramMeasurements.length > 0) {
        latestByParam[param.name] = {
          measurement: paramMeasurements[0],
          parameter: param,
          status: getMeasurementStatus(paramMeasurements[0], param)
        };
      }
    });

    return Object.values(latestByParam);
  };

  const latestMeasurements = getLatestMeasurements();

  // Conta per categoria
  const statusCounts = latestMeasurements.reduce((acc, item) => {
    acc[item.status.status] = (acc[item.status.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'critical':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-50 border-green-200 hover:border-green-300';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300';
      case 'critical':
        return 'bg-red-50 border-red-200 hover:border-red-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'critical':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Stato Parametri
      </h3>

      {/* Riepilogo stati */}
      {latestMeasurements.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200 text-center">
            <div className="text-2xl font-bold text-green-700">
              {statusCounts.optimal || 0}
            </div>
            <div className="text-xs text-green-600 font-medium">Ottimali</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {statusCounts.warning || 0}
            </div>
            <div className="text-xs text-yellow-600 font-medium">Attenzione</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200 text-center">
            <div className="text-2xl font-bold text-red-700">
              {statusCounts.critical || 0}
            </div>
            <div className="text-xs text-red-600 font-medium">Critici</div>
          </div>
        </div>
      )}

      {/* Lista parametri con stato */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {latestMeasurements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg font-medium">Nessuna misurazione</p>
            <p className="text-gray-400 text-sm mt-2">Aggiungi la prima per vedere lo stato!</p>
          </div>
        ) : (
          latestMeasurements.map((item, index) => {
            const { measurement, parameter, status } = item;
            const customRange = calculateCustomRange(parameter.name);

            return (
              <div
                key={parameter.name}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusBg(status.status)}`}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  borderLeftColor: parameter.color,
                  borderLeftWidth: '4px'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header con nome e stato */}
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(status.status)}
                      <h4 className="font-bold text-gray-900 text-base">
                        {parameter.name}
                      </h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getStatusText(status.status)}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Valore misurazione */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-2xl font-bold ${getStatusText(status.status)}`}>
                        {measurement.value.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {parameter.unit}
                      </span>
                      {measurement.originalUnit && measurement.originalUnit !== parameter.unit && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          ({measurement.originalValue} {measurement.originalUnit})
                        </span>
                      )}
                    </div>

                    {/* Data */}
                    <div className="text-xs text-gray-500 mb-3">
                      📅 {new Date(measurement.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Note */}
                    {measurement.notes && (
                      <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">📝 Note:</span> {measurement.notes}
                        </p>
                      </div>
                    )}

                    {/* Range info */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-700">
                          <span className="font-semibold">Range Standard:</span> {parameter.standardRange.min} - {parameter.standardRange.max}
                        </span>
                        {measurement.value >= parameter.standardRange.min && 
                         measurement.value <= parameter.standardRange.max ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <AlertCircle size={14} className="text-red-600" />
                        )}
                      </div>

                      {customRange && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-gray-700">
                            <span className="font-semibold">Range Personale:</span> {customRange.min.toFixed(2)} - {customRange.max.toFixed(2)}
                          </span>
                          {measurement.value >= customRange.min && 
                           measurement.value <= customRange.max ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <AlertCircle size={14} className="text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicatore visivo laterale */}
                  <div className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        status.status === 'optimal' ? 'bg-green-500' :
                        status.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                    >
                      <span className="text-white text-xl font-bold">
                        {status.status === 'optimal' ? '✓' :
                         status.status === 'warning' ? '!' :
                         '✗'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Legenda */}
      {latestMeasurements.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Legenda Stati:</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="font-semibold text-green-700">Verde (Ottimale):</span>
              <span className="text-gray-600">Valore dentro sia range standard che personalizzato</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="font-semibold text-yellow-700">Arancione (Attenzione):</span>
              <span className="text-gray-600">Valore dentro un solo range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="font-semibold text-red-700">Rosso (Critico):</span>
              <span className="text-gray-600">Valore fuori da entrambi i range</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusOverview;
