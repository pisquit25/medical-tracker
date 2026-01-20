import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';

const MeasurementForm = () => {
  const { parameters, addMeasurement } = useMedical();
  const [formData, setFormData] = useState({
    parameter: 'Glicemia',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.value && formData.date) {
      addMeasurement(formData);
      setFormData({
        ...formData,
        value: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="card animate-slide-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Nuova Misurazione
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Parametro
          </label>
          <select
            value={formData.parameter}
            onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
            className="input"
          >
            {parameters.map(p => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Valore
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input"
            placeholder="Es: 95.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 text-base font-semibold shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Aggiungi Misurazione
        </button>
      </form>
    </div>
  );
};

export default MeasurementForm;
