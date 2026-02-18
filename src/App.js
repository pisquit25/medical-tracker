import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MedicalProvider } from './context/MedicalContext';
import { PatientProvider } from './context/PatientContext';
import { RatioProvider } from './context/RatioContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Ratio from './pages/Ratio';
import Patients from './pages/Patients';
import Settings from './pages/Settings';

function App() {
  return (
    <PatientProvider>
      <MedicalProvider>
        <RatioProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ratio" element={<Ratio />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </Router>
        </RatioProvider>
      </MedicalProvider>
    </PatientProvider>
  );
}

export default App;
