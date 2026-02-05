import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';
import { usePatients } from '../context/PatientContext';

const ParameterCalendarView = ({ parameter, onClose }) => {
  const { measurements, calculateCustomRange, toggleIncludeInFormula, isOutlier } = useMedical();
  const { getActivePatient } = usePatients();
  const activePatient = getActivePatient();

  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filtra misurazioni per parametro e paziente
  const parameterMeasurements = measurements
    .filter(m => 
      m.parameter === parameter.name &&
      m.patientId === activePatient?.id
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calcola range personalizzato
  const customRange = calculateCustomRange(parameter.name, activePatient?.id);

  // Funzione per determinare lo stato (verde/giallo/rosso)
  const getMeasurementStatus = (measurement) => {
    const value = measurement.value;
    const standardRange = parameter.standardRange;
    
    let inStandardRange = false;
    let inCustomRange = false;
    
    if (standardRange) {
      inStandardRange = value >= standardRange.min && value <= standardRange.max;
    }
    
    if (customRange) {
      inCustomRange = value >= customRange.min && value <= customRange.max;
    }
    
    // Logica semaforo
    if (inStandardRange && inCustomRange) {
      return { color: 'bg-green-500', label: 'Ottimale', border: 'border-green-600' };
    } else if (inStandardRange || inCustomRange) {
      return { color: 'bg-yellow-500', label: 'Attenzione', border: 'border-yellow-600' };
    } else {
      return { color: 'bg-red-500', label: 'Critico', border: 'border-red-600' };
    }
  };

  // Organizza misurazioni per mese
  const getMeasurementsByMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return parameterMeasurements.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  // Ottieni giorni del mese corrente
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Aggiungi celle vuote per allineare il primo giorno
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Aggiungi tutti i giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Ottieni misurazione per un giorno specifico
  const getMeasurementForDay = (day) => {
    if (!day) return null;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    
    return parameterMeasurements.find(m => m.date === dateStr);
  };

  // Naviga mesi
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth();
  const monthMeasurements = getMeasurementsByMonth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: parameter.color }}
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {parameter.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Visualizzazione calendario - {monthMeasurements.length} misurazioni questo mese
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
              type="button"
            >
              <X size={24} />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {monthYear}
              </h3>
            </div>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Legend */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium">Ottimale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="font-medium">Attenzione</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="font-medium">Critico</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="font-medium">Nessun dato</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 text-xs sm:text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const measurement = getMeasurementForDay(day);
                const status = measurement ? getMeasurementStatus(measurement) : null;

                return (
                  <div
                    key={index}
                    onClick={() => measurement && setSelectedMeasurement(measurement)}
                    className={`
                      aspect-square rounded-lg border-2 p-1 sm:p-2 flex flex-col items-center justify-center
                      transition-all cursor-pointer relative
                      ${!day ? 'bg-gray-50 border-gray-100' : ''}
                      ${day && !measurement ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : ''}
                      ${measurement ? `${status.color} ${status.border} hover:scale-105 shadow-sm` : ''}
                      ${measurement && !measurement.includedInFormula ? 'opacity-50 border-dashed' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-xs sm:text-sm font-bold ${measurement ? 'text-white' : 'text-gray-600'}`}>
                          {day}
                        </span>
                        {measurement && (
                          <>
                            <span className="text-xs sm:text-sm font-bold text-white mt-1">
                              {measurement.value}
                            </span>
                            {measurement.notes && (
                              <span className="text-xs text-white opacity-80 mt-0.5">
                                📝
                              </span>
                            )}
                            {!measurement.includedInFormula && (
                              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full" title="Esclusa dal calcolo"></div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Range Info */}
          {(parameter.standardRange || customRange) && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {/* Legenda Colori */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">Legenda</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-600"></div>
                    <span className="text-gray-600">Ottimale</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-yellow-500 border-2 border-yellow-600"></div>
                    <span className="text-gray-600">Attenzione</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-red-500 border-2 border-red-600"></div>
                    <span className="text-gray-600">Critico</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-blue-500 border-2 border-dashed border-blue-600 opacity-50 relative">
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-600">Esclusa</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {parameter.standardRange && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-700 mb-1">Range Standard</div>
                    <div className="text-lg font-bold text-gray-900">
                      {parameter.standardRange.min} - {parameter.standardRange.max} {parameter.unit}
                    </div>
                  </div>
                )}
                {customRange && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-700 mb-1">Range Personalizzato</div>
                    <div className="text-lg font-bold text-gray-900">
                      {customRange.min.toFixed(1)} - {customRange.max.toFixed(1)} {parameter.unit}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Detail Modal */}
      {selectedMeasurement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMeasurement(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Dettaglio Misurazione</h3>
              <button
                onClick={() => setSelectedMeasurement(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Data */}
              <div>
                <div className="text-sm font-semibold text-gray-600">Data</div>
                <div className="text-lg font-bold text-gray-900">
                  {new Date(selectedMeasurement.date).toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Valore */}
              <div>
                <div className="text-sm font-semibold text-gray-600">Valore</div>
                <div className="text-3xl font-bold text-gray-900">
                  {selectedMeasurement.value} {parameter.unit}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Stato</div>
                {(() => {
                  const status = getMeasurementStatus(selectedMeasurement);
                  return (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold ${status.color}`}>
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                      {status.label}
                    </div>
                  );
                })()}
              </div>

              {/* Note */}
              {selectedMeasurement.notes && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-2">Note</div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700">
                    {selectedMeasurement.notes}
                  </div>
                </div>
              )}

              {/* Range Check */}
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Verifica Range</div>
                <div className="space-y-2">
                  {parameter.standardRange && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">Range Standard:</span>
                      <span className={`text-sm font-bold ${
                        selectedMeasurement.value >= parameter.standardRange.min && 
                        selectedMeasurement.value <= parameter.standardRange.max
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {selectedMeasurement.value >= parameter.standardRange.min && 
                         selectedMeasurement.value <= parameter.standardRange.max ? '✓ SÌ' : '✗ NO'}
                      </span>
                    </div>
                  )}
                  {customRange && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">Range Personalizzato:</span>
                      <span className={`text-sm font-bold ${
                        selectedMeasurement.value >= customRange.min && 
                        selectedMeasurement.value <= customRange.max
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {selectedMeasurement.value >= customRange.min && 
                         selectedMeasurement.value <= customRange.max ? '✓ SÌ' : '✗ NO'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Include/Exclude from Formula */}
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Calcolo Range Personalizzato</div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMeasurement.includedInFormula}
                      onChange={() => {
                        toggleIncludeInFormula(selectedMeasurement.id);
                        // Aggiorna lo stato locale per mostrare il cambio immediatamente
                        setSelectedMeasurement({
                          ...selectedMeasurement,
                          includedInFormula: !selectedMeasurement.includedInFormula
                        });
                      }}
                      className="mt-0.5 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900">
                        {selectedMeasurement.includedInFormula 
                          ? '✓ Inclusa nel calcolo' 
                          : '✗ Esclusa dal calcolo'}
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        {selectedMeasurement.includedInFormula
                          ? 'Questa misurazione viene usata per calcolare il setpoint e il range personalizzato. Deseleziona per escluderla (es: valore anomalo, errore di misurazione).'
                          : 'Questa misurazione è esclusa dal calcolo. Il range personalizzato sarà calcolato senza questo valore. Seleziona per includerla nuovamente.'}
                      </div>
                      {isOutlier(selectedMeasurement.id) && selectedMeasurement.includedInFormula && (
                        <div className="mt-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded border border-orange-300">
                          ⚠️ <strong>Nota:</strong> Questo valore è stato identificato come outlier statistico dal sistema. Considera di escluderlo se sembra essere un errore di misurazione.
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMeasurement(null)}
              className="mt-6 w-full btn btn-primary"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterCalendarView;
