import React from 'react';
import MeasurementForm from '../components/MeasurementForm';
import MeasurementList from '../components/MeasurementList';
import DataManager from '../components/DataManager';
import Chart from '../components/Chart';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Visualizza e gestisci i tuoi parametri medici
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sidebar sinistra */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <MeasurementForm />
          <DataManager />
          <MeasurementList />
        </div>

        {/* Area principale */}
        <div className="lg:col-span-2">
          <Chart />
        </div>
      </div>

      {/* Footer informativo */}
      <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">I tuoi dati sono al sicuro</h3>
            <p className="text-sm text-gray-600">
              Tutte le informazioni vengono salvate localmente nel tuo browser. 
              Nessun dato viene inviato a server esterni. 
              Ricordati di esportare regolarmente per creare backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
