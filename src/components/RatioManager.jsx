import React, { useState } from 'react';
import { Calculator, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRatio } from '../context/RatioContext';
import RatioFormulaBuilder from './RatioFormulaBuilder';

const RatioManager = () => {
  const { ratios, deleteRatio } = useRatio();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRatio, setEditingRatio] = useState(null);
  const [expandedRatios, setExpandedRatios] = useState({});

  const handleEdit = (ratio) => {
    setEditingRatio(ratio);
    setShowBuilder(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Sei sicuro di voler eliminare il rapporto "${name}"?`)) {
      deleteRatio(id);
    }
  };

  const handleClose = () => {
    setShowBuilder(false);
    setEditingRatio(null);
  };

  const toggleExpand = (id) => {
    setExpandedRatios(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calculator className="text-purple-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestione Rapporti</h2>
            <p className="text-sm text-gray-600">Aggiungi, modifica o elimina rapporti parametrici</p>
          </div>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nuovo Rapporto</span>
        </button>
      </div>

      {ratios.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Nessun rapporto configurato</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="btn btn-primary"
          >
            <Plus size={20} className="inline mr-2" />
            Crea il primo rapporto
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ratios.map((ratio) => {
            const isExpanded = expandedRatios[ratio.id];
            
            return (
              <div
                key={ratio.id}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{ratio.name}</h3>
                      {ratio.unit && (
                        <span className="text-xs px-2 py-1 bg-white rounded border border-purple-200 text-purple-700">
                          {ratio.unit}
                        </span>
                      )}
                    </div>
                    
                    {ratio.description && (
                      <p className="text-sm text-gray-600 mb-2">{ratio.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600 mb-2">
                      <span className="px-2 py-1 bg-white rounded border border-gray-200">
                        {ratio.parameters.length} parametri
                      </span>
                      {ratio.standardRange && (
                        <span className="px-2 py-1 bg-white rounded border border-gray-200">
                          Range: {ratio.standardRange.min}-{ratio.standardRange.max}
                        </span>
                      )}
                    </div>

                    {/* Formula (collapsible) */}
                    <div className="mb-2">
                      <button
                        onClick={() => toggleExpand(ratio.id)}
                        className="flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900"
                      >
                        {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        {isExpanded ? 'Nascondi' : 'Mostra'} Formula
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-2 p-3 bg-white rounded border border-purple-200">
                          <div className="text-xs text-gray-600 mb-1 font-semibold">FORMULA:</div>
                          <div className="font-mono text-sm text-gray-900 break-all">
                            {ratio.formula}
                          </div>
                          <div className="text-xs text-gray-600 mt-2 font-semibold">PARAMETRI RICHIESTI:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ratio.parameters.map(param => (
                              <span key={param} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(ratio)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifica rapporto"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(ratio.id, ratio.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Elimina rapporto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formula Builder Modal */}
      {showBuilder && (
        <RatioFormulaBuilder
          onClose={handleClose}
          existingRatios={ratios}
          editingRatio={editingRatio}
        />
      )}
    </div>
  );
};

export default RatioManager;
