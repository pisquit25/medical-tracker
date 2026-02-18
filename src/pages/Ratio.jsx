import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calculator, AlertCircle, Info } from 'lucide-react';
import { useRatio } from '../context/RatioContext';
import { useMedical } from '../context/MedicalContext';
import { usePatients } from '../context/PatientContext';
import RatioCard from '../components/RatioCard';
import RatioChart from '../components/RatioChart';
import RatioFormulaBuilder from '../components/RatioFormulaBuilder';
import InfoTooltip from '../components/InfoTooltip';

const Ratio = () => {
  const { ratios, recalculateRatios, getRatioCalculations } = useRatio();
  const { measurements } = useMedical();
  const { getActivePatient } = usePatients();
  const activePatient = getActivePatient();

  const [selectedRatio, setSelectedRatio] = useState(null);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);

  // Ricalcola ratios quando cambiano measurements o paziente
  useEffect(() => {
    if (activePatient && measurements.length > 0) {
      recalculateRatios(measurements, activePatient.id);
    }
  }, [measurements, activePatient, recalculateRatios]);

  // Seleziona primo ratio di default
  useEffect(() => {
    if (!selectedRatio && ratios.length > 0) {
      setSelectedRatio(ratios[0]);
    }
  }, [ratios, selectedRatio]);

  if (!activePatient) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nessun Paziente Selezionato</h2>
          <p className="text-gray-600">
            Seleziona un paziente dall'header per visualizzare i rapporti parametrici.
          </p>
        </div>
      </div>
    );
  }

  const selectedRatioCalculations = selectedRatio 
    ? getRatioCalculations(selectedRatio.id, activePatient.id)
    : [];

  // Determina stato del ratio (verde/giallo/rosso)
  const getRatioStatus = (value, range) => {
    if (!range) return null;
    if (value >= range.min && value <= range.max) {
      return { color: 'bg-green-500', label: 'Ottimale', textColor: 'text-green-700', bgLight: 'bg-green-50', border: 'border-green-200' };
    } else if (value >= range.min * 0.95 && value <= range.max * 1.05) {
      return { color: 'bg-yellow-500', label: 'Attenzione', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', border: 'border-yellow-200' };
    } else {
      return { color: 'bg-red-500', label: 'Critico', textColor: 'text-red-700', bgLight: 'bg-red-50', border: 'border-red-200' };
    }
  };

  const latestCalculation = selectedRatioCalculations.length > 0
    ? selectedRatioCalculations[selectedRatioCalculations.length - 1]
    : null;

  const status = latestCalculation && selectedRatio?.standardRange
    ? getRatioStatus(latestCalculation.value, selectedRatio.standardRange)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            Rapporti Parametrici
          </h1>
          <p className="text-gray-600 mt-2">
            Analizza relazioni complesse tra parametri medici
          </p>
        </div>
        <button
          onClick={() => setShowFormulaBuilder(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nuovo Rapporto
        </button>
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Come Funzionano i Rapporti</h3>
            <p className="text-sm text-blue-800">
              I rapporti vengono calcolati automaticamente solo quando tutti i parametri coinvolti 
              hanno misurazioni nella <strong>stessa data</strong>. Puoi creare rapporti personalizzati 
              combinando parametri con operatori matematici, o anche utilizzare altri rapporti già calcolati.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Ratios */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Rapporti Disponibili</h2>
            
            {ratios.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">
                  Nessun rapporto configurato.
                  <br />
                  Creane uno nuovo!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {ratios.map(ratio => {
                  const calculations = getRatioCalculations(ratio.id, activePatient.id);
                  const isSelected = selectedRatio?.id === ratio.id;
                  
                  return (
                    <div
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`
                        p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {ratio.name}
                            </h3>
                            {ratio.predefined && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                Predefinito
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {ratio.description || 'Nessuna descrizione'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              {calculations.length} calcoli
                            </span>
                            {ratio.unit && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded">
                                {ratio.unit}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dettaglio Ratio Selezionato */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRatio ? (
            <>
              {/* Ratio Card */}
              <RatioCard 
                ratio={selectedRatio}
                latestCalculation={latestCalculation}
                status={status}
                calculationsCount={selectedRatioCalculations.length}
              />

              {/* Grafico Andamento */}
              {selectedRatioCalculations.length > 0 ? (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp size={20} />
                      Andamento Temporale
                    </h2>
                    <InfoTooltip title="Andamento" position="left">
                      <p className="text-sm">
                        Grafico dell'evoluzione del rapporto nel tempo.
                        I punti verdi indicano valori ottimali, gialli attenzione, rossi critici.
                      </p>
                    </InfoTooltip>
                  </div>
                  <RatioChart 
                    calculations={selectedRatioCalculations}
                    ratio={selectedRatio}
                  />
                </div>
              ) : (
                <div className="card">
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nessun Calcolo Disponibile
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Non ci sono ancora calcoli per questo rapporto.
                      Assicurati di aver inserito misurazioni con la <strong>stessa data</strong> per 
                      tutti i parametri richiesti: <strong>{selectedRatio.parameters.join(', ')}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Storico Calcoli */}
              {selectedRatioCalculations.length > 0 && (
                <div className="card">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Storico Calcoli</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Valore</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Stato</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Parametri Usati</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRatioCalculations.slice().reverse().map((calc, idx) => {
                          const calcStatus = selectedRatio.standardRange
                            ? getRatioStatus(calc.value, selectedRatio.standardRange)
                            : null;
                          
                          return (
                            <tr key={calc.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-900">
                                {new Date(calc.date).toLocaleDateString('it-IT')}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-gray-900">
                                  {calc.value.toFixed(2)} {selectedRatio.unit || ''}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {calcStatus && (
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${calcStatus.color} text-white`}>
                                    {calcStatus.label}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(calc.parameters).map(([param, value]) => (
                                    <span key={param} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                      {param}: {value}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Seleziona un Rapporto
                </h3>
                <p className="text-gray-600">
                  Scegli un rapporto dalla lista per visualizzarne i dettagli e l'andamento.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formula Builder Modal */}
      {showFormulaBuilder && (
        <RatioFormulaBuilder
          onClose={() => setShowFormulaBuilder(false)}
          existingRatios={ratios}
        />
      )}
    </div>
  );
};

export default Ratio;
