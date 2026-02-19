import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const RangeRuleManager = ({ parameter, onAddRule, onUpdateRule, onDeleteRule, onClose }) => {
  const [rules, setRules] = useState(parameter.rangeRules || []);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Form state
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [filterType, setFilterType] = useState('none'); // none, sesso, age, both
  const [sesso, setSesso] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setMinValue('');
    setMaxValue('');
    setFilterType('none');
    setSesso('');
    setMinAge('');
    setMaxAge('');
    setDescription('');
    setEditingRule(null);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setMinValue(rule.range.min);
    setMaxValue(rule.range.max);
    
    const hasSesso = rule.conditions.sesso !== undefined;
    const hasAge = rule.conditions.minAge !== undefined || rule.conditions.maxAge !== undefined;
    
    if (hasSesso && hasAge) {
      setFilterType('both');
    } else if (hasSesso) {
      setFilterType('sesso');
    } else if (hasAge) {
      setFilterType('age');
    } else {
      setFilterType('none');
    }
    
    setSesso(rule.conditions.sesso || '');
    setMinAge(rule.conditions.minAge !== undefined ? rule.conditions.minAge : '');
    setMaxAge(rule.conditions.maxAge !== undefined ? rule.conditions.maxAge : '');
    setDescription(rule.description || '');
    setShowForm(true);
  };

  const handleDelete = (ruleId) => {
    if (window.confirm('Eliminare questo range?')) {
      onDeleteRule(parameter.id, ruleId);
      setRules(rules.filter(r => r.id !== ruleId));
    }
  };

  const handleSubmit = () => {
    if (!minValue || !maxValue) {
      alert('Inserisci valori min e max');
      return;
    }

    const conditions = {};
    
    if (filterType === 'sesso' || filterType === 'both') {
      if (!sesso) {
        alert('Seleziona il sesso');
        return;
      }
      conditions.sesso = sesso;
    }
    
    if (filterType === 'age' || filterType === 'both') {
      if (minAge !== '') conditions.minAge = parseInt(minAge);
      if (maxAge !== '') conditions.maxAge = parseInt(maxAge);
      
      if (conditions.minAge === undefined && conditions.maxAge === undefined) {
        alert('Inserisci almeno un limite di età');
        return;
      }
    }

    const ruleData = {
      range: {
        min: parseFloat(minValue),
        max: parseFloat(maxValue)
      },
      conditions,
      description: description || undefined
    };

    if (editingRule) {
      // Update existing
      onUpdateRule(parameter.id, editingRule.id, ruleData);
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...ruleData } : r));
    } else {
      // Add new
      const newRule = {
        id: `rule_${Date.now()}`,
        ...ruleData
      };
      onAddRule(parameter.id, ruleData);
      setRules([...rules, newRule]);
    }

    setShowForm(false);
    resetForm();
  };

  const getConditionLabel = (rule) => {
    const parts = [];
    
    if (rule.conditions.sesso) {
      parts.push(rule.conditions.sesso === 'M' ? 'Maschio' : 'Femmina');
    }
    
    if (rule.conditions.minAge !== undefined && rule.conditions.maxAge !== undefined) {
      parts.push(`${rule.conditions.minAge}-${rule.conditions.maxAge} anni`);
    } else if (rule.conditions.minAge !== undefined) {
      parts.push(`≥${rule.conditions.minAge} anni`);
    } else if (rule.conditions.maxAge !== undefined) {
      parts.push(`≤${rule.conditions.maxAge} anni`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Tutti (default)';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Range Multipli</h2>
            <p className="text-sm text-gray-600 mt-1">
              {parameter.name} - Range in base a sesso ed età
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Range Default */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-blue-900">Range Standard (Default)</h3>
              <span className="text-xs text-blue-700 px-2 py-1 bg-blue-100 rounded">
                Usato quando nessuna regola matcha
              </span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {parameter.standardRange.min} - {parameter.standardRange.max} {parameter.unit}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Valido per: Tutti (default)
            </div>
          </div>

          {/* Lista Range Personalizzati */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Range Personalizzati</h3>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Aggiungi Range
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">Nessun range personalizzato</p>
                <p className="text-sm text-gray-500 mt-1">
                  Aggiungi range specifici per sesso ed età
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-purple-700 px-2 py-1 bg-purple-100 rounded">
                            Range #{index + 1}
                          </span>
                          <span className="text-sm text-purple-900 font-medium">
                            {getConditionLabel(rule)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 mb-1">
                          {rule.range.min} - {rule.range.max} {parameter.unit}
                        </div>
                        {rule.description && (
                          <div className="text-sm text-purple-700">
                            {rule.description}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifica"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Elimina"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Aggiungi/Modifica */}
          {showForm && (
            <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-300">
              <h3 className="font-bold text-gray-900 mb-4">
                {editingRule ? 'Modifica Range' : 'Nuovo Range'}
              </h3>

              {/* Valori Range */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valore Minimo *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="input"
                    placeholder="es. 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valore Massimo *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="input"
                    placeholder="es. 100"
                  />
                </div>
              </div>

              {/* Tipo Filtro */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Applicabile a:
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input"
                >
                  <option value="none">Tutti (default)</option>
                  <option value="sesso">Solo Sesso</option>
                  <option value="age">Solo Età</option>
                  <option value="both">Sesso E Età</option>
                </select>
              </div>

              {/* Sesso (se applicabile) */}
              {(filterType === 'sesso' || filterType === 'both') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sesso *
                  </label>
                  <select
                    value={sesso}
                    onChange={(e) => setSesso(e.target.value)}
                    className="input"
                  >
                    <option value="">Seleziona...</option>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              )}

              {/* Età (se applicabile) */}
              {(filterType === 'age' || filterType === 'both') && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Età Minima
                    </label>
                    <input
                      type="number"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                      className="input"
                      placeholder="es. 18"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Età Massima
                    </label>
                    <input
                      type="number"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                      className="input"
                      placeholder="es. 65"
                    />
                  </div>
                </div>
              )}

              {/* Descrizione */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrizione (opzionale)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  placeholder="es. Adulti in menopausa"
                />
              </div>

              {/* Azioni */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingRule ? 'Aggiorna' : 'Aggiungi'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-600">
            <strong>Come funziona:</strong> Quando visualizzi i dati di un paziente, 
            viene automaticamente selezionato il range più specifico che corrisponde al suo 
            sesso ed età. Se nessun range personalizzato corrisponde, viene usato il range standard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RangeRuleManager;
