import React, { useState } from 'react';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { useRatio } from '../context/RatioContext';
import { useMedical } from '../context/MedicalContext';

const RatioFormulaBuilder = ({ onClose, existingRatios }) => {
  const { parameters } = useMedical();
  const { addRatio, validateFormula, buildFormulaString } = useRatio();

  const [ratioName, setRatioName] = useState('');
  const [ratioDescription, setRatioDescription] = useState('');
  const [ratioUnit, setRatioUnit] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [formulaComponents, setFormulaComponents] = useState([]);
  const [error, setError] = useState('');
  const [showPalette, setShowPalette] = useState(true);

  // Operatori disponibili
  const operators = ['+', '-', '*', '/'];
  const parentheses = ['(', ')'];

  // Aggiungi componente alla formula
  const addComponent = (type, value) => {
    setFormulaComponents([...formulaComponents, { type, value }]);
    setError('');
  };

  // Rimuovi componente
  const removeComponent = (index) => {
    setFormulaComponents(formulaComponents.filter((_, i) => i !== index));
  };

  // Sposta componente
  const moveComponent = (index, direction) => {
    const newComponents = [...formulaComponents];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newComponents.length) {
      [newComponents[index], newComponents[targetIndex]] = 
      [newComponents[targetIndex], newComponents[index]];
      setFormulaComponents(newComponents);
    }
  };

  // Salva ratio
  const handleSave = () => {
    // Validazioni
    if (!ratioName.trim()) {
      setError('Inserisci un nome per il rapporto');
      return;
    }

    if (formulaComponents.length === 0) {
      setError('Costruisci una formula');
      return;
    }

    // Valida formula
    const validation = validateFormula(formulaComponents);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Estrai parametri usati
    const usedParameters = formulaComponents
      .filter(c => c.type === 'parameter')
      .map(c => c.value)
      .filter((v, i, arr) => arr.indexOf(v) === i); // Unique

    if (usedParameters.length === 0) {
      setError('La formula deve contenere almeno un parametro');
      return;
    }

    // Crea ratio
    const newRatio = {
      name: ratioName.trim(),
      description: ratioDescription.trim() || undefined,
      unit: ratioUnit.trim() || undefined,
      standardRange: (rangeMin !== '' && rangeMax !== '') ? {
        min: parseFloat(rangeMin),
        max: parseFloat(rangeMax)
      } : undefined,
      formula: buildFormulaString(formulaComponents),
      formulaComponents,
      parameters: usedParameters,
      color: '#8b5cf6'
    };

    addRatio(newRatio);
    onClose();
  };

  const formulaString = buildFormulaString(formulaComponents);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nuovo Rapporto Parametrico</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Base */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Rapporto *
              </label>
              <input
                type="text"
                value={ratioName}
                onChange={(e) => setRatioName(e.target.value)}
                placeholder="es. Osmolalità Plasmatica"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                value={ratioDescription}
                onChange={(e) => setRatioDescription(e.target.value)}
                placeholder="Breve descrizione del rapporto e sua utilità clinica"
                className="input"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unità di Misura
                </label>
                <input
                  type="text"
                  value={ratioUnit}
                  onChange={(e) => setRatioUnit(e.target.value)}
                  placeholder="es. mOsm/kg"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Range Min (opzionale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  placeholder="291"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Range Max (opzionale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  placeholder="299"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Formula Builder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Costruttore Formula *
              </label>
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {showPalette ? 'Nascondi' : 'Mostra'} Palette
              </button>
            </div>

            {/* Palette Componenti */}
            {showPalette && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                {/* Parametri */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">PARAMETRI</div>
                  <div className="flex flex-wrap gap-2">
                    {parameters.map(param => (
                      <button
                        key={param.id}
                        onClick={() => addComponent('parameter', param.name)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        + {param.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operatori */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">OPERATORI</div>
                  <div className="flex flex-wrap gap-2">
                    {operators.map(op => (
                      <button
                        key={op}
                        onClick={() => addComponent('operator', op)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors min-w-[40px]"
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parentesi */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">PARENTESI</div>
                  <div className="flex flex-wrap gap-2">
                    {parentheses.map(p => (
                      <button
                        key={p}
                        onClick={() => addComponent('parenthesis', p)}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numeri */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">NUMERO</div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Inserisci numero"
                      className="input flex-1 max-w-xs"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          addComponent('number', parseFloat(e.target.value));
                          e.target.value = '';
                        }
                      }}
                      id="number-input"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('number-input');
                        if (input.value) {
                          addComponent('number', parseFloat(input.value));
                          input.value = '';
                        }
                      }}
                      className="btn btn-secondary"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Altri Rapporti */}
                {existingRatios && existingRatios.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-2">RAPPORTI ESISTENTI</div>
                    <div className="flex flex-wrap gap-2">
                      {existingRatios.map(ratio => (
                        <button
                          key={ratio.id}
                          onClick={() => addComponent('ratio', ratio.name)}
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                        >
                          + {ratio.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Formula Components Display */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-300 min-h-[100px]">
              {formulaComponents.length === 0 ? (
                <div className="text-center text-gray-400 py-6">
                  <p className="text-sm">Costruisci la tua formula selezionando elementi dalla palette sopra</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {formulaComponents.map((comp, index) => {
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-700';
                    
                    if (comp.type === 'parameter') {
                      bgColor = 'bg-blue-100';
                      textColor = 'text-blue-700';
                    } else if (comp.type === 'operator') {
                      bgColor = 'bg-green-100';
                      textColor = 'text-green-700';
                    } else if (comp.type === 'parenthesis') {
                      bgColor = 'bg-purple-100';
                      textColor = 'text-purple-700';
                    } else if (comp.type === 'number') {
                      bgColor = 'bg-yellow-100';
                      textColor = 'text-yellow-700';
                    } else if (comp.type === 'ratio') {
                      bgColor = 'bg-orange-100';
                      textColor = 'text-orange-700';
                    }

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg font-medium group`}
                      >
                        <button
                          onClick={() => moveComponent(index, 'left')}
                          disabled={index === 0}
                          className="opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity p-0.5 hover:bg-white/50 rounded"
                        >
                          ←
                        </button>
                        
                        <span className="text-sm">{comp.value}</span>
                        
                        <button
                          onClick={() => moveComponent(index, 'right')}
                          disabled={index === formulaComponents.length - 1}
                          className="opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity p-0.5 hover:bg-white/50 rounded"
                        >
                          →
                        </button>
                        
                        <button
                          onClick={() => removeComponent(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-100 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Formula Preview */}
            {formulaComponents.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-600 mb-1">ANTEPRIMA FORMULA</div>
                <div className="font-mono text-sm text-gray-900">{formulaString}</div>
              </div>
            )}

            {/* Clear Button */}
            {formulaComponents.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setFormulaComponents([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Cancella Formula
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={20} />
            Salva Rapporto
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatioFormulaBuilder;
