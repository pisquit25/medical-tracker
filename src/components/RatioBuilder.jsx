import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { useRatio } from '../context/RatioContext';
import { useMedical } from '../context/MedicalContext';

const RatioBuilder = ({ ratio, onClose }) => {
  const { addRatio, updateRatio, ratios } = useRatio();
  const { parameters } = useMedical();

  const [formData, setFormData] = useState({
    name: '',
    formula: [],
    unit: '',
    standardRange: { min: '', max: '' },
    color: '#8b5cf6',
    description: ''
  });

  const [formulaElements, setFormulaElements] = useState([]);

  useEffect(() => {
    if (ratio) {
      setFormData({
        name: ratio.name,
        formula: ratio.formula,
        unit: ratio.unit,
        standardRange: ratio.standardRange || { min: '', max: '' },
        color: ratio.color,
        description: ratio.description || ''
      });
      setFormulaElements(ratio.formula);
    }
  }, [ratio]);

  const operators = ['+', '-', '*', '/'];

  const addFormulaElement = (type) => {
    const newElement = {
      type,
      value: type === 'number' ? 0 : '',
      operator: formulaElements.length > 0 ? '+' : null
    };
    setFormulaElements([...formulaElements, newElement]);
  };

  const updateFormulaElement = (index, field, value) => {
    const updated = [...formulaElements];
    updated[index][field] = value;
    setFormulaElements(updated);
  };

  const removeFormulaElement = (index) => {
    const updated = formulaElements.filter((_, i) => i !== index);
    // Rimuovi operator dal primo elemento se diventa il primo
    if (updated.length > 0) {
      updated[0].operator = null;
    }
    setFormulaElements(updated);
  };

  const moveElement = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formulaElements.length) return;

    const updated = [...formulaElements];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Aggiusta operators
    if (newIndex === 0) {
      updated[0].operator = null;
      updated[1].operator = updated[1].operator || '+';
    } else if (index === 0) {
      updated[1].operator = null;
      updated[0].operator = updated[0].operator || '+';
    }
    
    setFormulaElements(updated);
  };

  const generateDescription = () => {
    if (formulaElements.length === 0) return '';
    
    let desc = '';
    formulaElements.forEach((el, i) => {
      if (i > 0 && el.operator) {
        desc += ` ${el.operator} `;
      }
      
      if (el.type === 'parameter') {
        desc += el.value || '[Parametro]';
      } else if (el.type === 'ratio') {
        const ratioObj = ratios.find(r => r.id === el.value);
        desc += `(${ratioObj?.name || '[Rapporto]'})`;
      } else if (el.type === 'number') {
        desc += el.value;
      }
    });
    
    return desc;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || formulaElements.length === 0) {
      alert('Nome e formula sono obbligatori');
      return;
    }

    const ratioData = {
      ...formData,
      formula: formulaElements,
      description: generateDescription(),
      standardRange: formData.standardRange.min && formData.standardRange.max
        ? { min: parseFloat(formData.standardRange.min), max: parseFloat(formData.standardRange.max) }
        : null
    };

    if (ratio) {
      updateRatio(ratio.id, ratioData);
    } else {
      addRatio(ratioData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {ratio ? 'Modifica Rapporto' : 'Nuovo Rapporto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Unità */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Rapporto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="es: Osmolalità Plasmatica"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unità di Misura *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="es: mOsm/kg"
                  required
                />
              </div>
            </div>

            {/* Range Standard */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Range Standard (Opzionale)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="any"
                  value={formData.standardRange.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    standardRange: { ...formData.standardRange, min: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Minimo"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.standardRange.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    standardRange: { ...formData.standardRange, max: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Massimo"
                />
              </div>
            </div>

            {/* Colore */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Colore Grafico
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-12 w-24 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>

            {/* Formula Builder */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Formula *
              </label>
              
              {/* Aggiungi Elemento */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => addFormulaElement('parameter')}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm"
                >
                  + Parametro
                </button>
                <button
                  type="button"
                  onClick={() => addFormulaElement('ratio')}
                  className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium text-sm"
                >
                  + Rapporto
                </button>
                <button
                  type="button"
                  onClick={() => addFormulaElement('number')}
                  className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm"
                >
                  + Numero
                </button>
              </div>

              {/* Elementi Formula */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg min-h-[200px]">
                {formulaElements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plus size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aggiungi elementi per costruire la formula</p>
                  </div>
                ) : (
                  formulaElements.map((element, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-gray-200">
                      {/* Grip */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveElement(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveElement(index, 'down')}
                          disabled={index === formulaElements.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>

                      {/* Operator */}
                      {index > 0 && (
                        <select
                          value={element.operator || '+'}
                          onChange={(e) => updateFormulaElement(index, 'operator', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-lg font-bold w-16"
                        >
                          {operators.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                      )}

                      {/* Value */}
                      <div className="flex-1">
                        {element.type === 'parameter' && (
                          <select
                            value={element.value}
                            onChange={(e) => updateFormulaElement(index, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">-- Seleziona Parametro --</option>
                            {parameters.map(param => (
                              <option key={param.id} value={param.name}>
                                {param.name} ({param.unit})
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {element.type === 'ratio' && (
                          <select
                            value={element.value}
                            onChange={(e) => updateFormulaElement(index, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">-- Seleziona Rapporto --</option>
                            {ratios.filter(r => !ratio || r.id !== ratio.id).map(r => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {element.type === 'number' && (
                          <input
                            type="number"
                            step="any"
                            value={element.value}
                            onChange={(e) => updateFormulaElement(index, 'value', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="0"
                          />
                        )}
                      </div>

                      {/* Tipo */}
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${element.type === 'parameter' ? 'bg-blue-100 text-blue-700' : ''}
                        ${element.type === 'ratio' ? 'bg-purple-100 text-purple-700' : ''}
                        ${element.type === 'number' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {element.type === 'parameter' && 'Parametro'}
                        {element.type === 'ratio' && 'Rapporto'}
                        {element.type === 'number' && 'Numero'}
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeFormulaElement(index)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Formula Preview */}
              {formulaElements.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <span className="text-sm font-semibold text-purple-900">Anteprima Formula:</span>
                  <p className="font-mono text-purple-900 mt-2">
                    {generateDescription()}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            {ratio ? 'Aggiorna' : 'Crea'} Rapporto
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatioBuilder;
