import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';

const ParameterManager = () => {
  const { parameters, addParameter, updateParameter, deleteParameter } = useMedical();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    minRange: '',
    maxRange: '',
    formula: '1.5'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      unit: '',
      minRange: '',
      maxRange: '',
      formula: '1.5'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newParameter = {
      name: formData.name,
      unit: formData.unit,
      standardRange: {
        min: parseFloat(formData.minRange),
        max: parseFloat(formData.maxRange)
      },
      customFormula: `mean ± ${formData.formula}*sd`,
      color: getRandomColor()
    };

    if (editingId) {
      updateParameter(editingId, newParameter);
    } else {
      addParameter(newParameter);
    }

    resetForm();
  };

  const startEdit = (param) => {
    setFormData({
      name: param.name,
      unit: param.unit,
      minRange: param.standardRange.min.toString(),
      maxRange: param.standardRange.max.toString(),
      formula: param.customFormula.match(/[\d.]+/)?.[0] || '1.5'
    });
    setEditingId(param.id);
    setIsAdding(true);
  };

  const getRandomColor = () => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
      '#06b6d4', '#f97316', '#84cc16', '#6366f1', '#ef4444'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDelete = (paramId, paramName) => {
    if (window.confirm(`⚠️ Eliminare il parametro "${paramName}"?\n\nTutte le misurazioni associate verranno perse!`)) {
      deleteParameter(paramId);
    }
  };

  return (
    <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Parametri</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Aggiungi Parametro
          </button>
        )}
      </div>

      {/* Form Aggiunta/Modifica */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-4">
            {editingId ? 'Modifica Parametro' : 'Nuovo Parametro'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Parametro *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Es: Emoglobina Glicata"
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
                className="input"
                placeholder="Es: %"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Range Minimo *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minRange}
                onChange={(e) => setFormData({ ...formData, minRange: e.target.value })}
                className="input"
                placeholder="Es: 4.0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Range Massimo *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.maxRange}
                onChange={(e) => setFormData({ ...formData, maxRange: e.target.value })}
                className="input"
                placeholder="Es: 5.6"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Formula Personalizzata (moltiplicatore deviazione standard) *
              </label>
              <select
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                className="input"
              >
                <option value="1">mean ± 1*sd (68% dei dati)</option>
                <option value="1.5">mean ± 1.5*sd (87% dei dati)</option>
                <option value="2">mean ± 2*sd (95% dei dati)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {editingId ? 'Salva Modifiche' : 'Aggiungi Parametro'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary flex items-center gap-2"
            >
              <X size={18} />
              Annulla
            </button>
          </div>
        </form>
      )}

      {/* Lista Parametri */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 mb-3">
          Parametri Configurati ({parameters.length})
        </h3>

        {parameters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Nessun parametro configurato</p>
            <p className="text-sm mt-1">Aggiungi il primo parametro per iniziare</p>
          </div>
        ) : (
          parameters.map((param) => (
            <div
              key={param.id}
              className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all"
              style={{ borderLeftColor: param.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: param.color }}
                    />
                    <h4 className="font-bold text-gray-900 text-lg">
                      {param.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Unità:</span>
                      <span className="ml-2 font-semibold text-gray-900">{param.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Range Standard:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {param.standardRange.min} - {param.standardRange.max}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Formula:</span>
                      <span className="ml-2 font-semibold text-gray-900">{param.customFormula}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(param)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                    title="Modifica parametro"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(param.id, param.name)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    title="Elimina parametro"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">⚠️ Attenzione:</span> Eliminando un parametro, 
          tutte le misurazioni associate verranno perse in modo permanente.
        </p>
      </div>
    </div>
  );
};

export default ParameterManager;
