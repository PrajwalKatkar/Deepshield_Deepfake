import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Result from './pages/Result';
import Compare from './pages/Compare';
import History from './pages/History';
import EvidenceVault from './pages/EvidenceVault';
import ThreatIntel from './pages/ThreatIntel';
import Models from './pages/Models';
import AuditSettings from './pages/AuditSettings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [analystMode, setAnalystMode] = useState(true);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);

  if (currentPage === 'landing') {
    return <Landing setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden">
      {/* Cyber Forensic Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        analystMode={analystMode}
        setAnalystMode={setAnalystMode}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header setCurrentPage={setCurrentPage} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <Dashboard
                setCurrentPage={setCurrentPage}
                setSelectedAnalysisId={setSelectedAnalysisId}
              />
            )}
            {currentPage === 'analyze' && (
              <Analyze
                setCurrentPage={setCurrentPage}
                setSelectedAnalysisId={setSelectedAnalysisId}
              />
            )}
            {currentPage === 'result' && (
              <Result
                selectedAnalysisId={selectedAnalysisId}
                setCurrentPage={setCurrentPage}
                analystMode={analystMode}
              />
            )}
            {currentPage === 'compare' && <Compare />}
            {currentPage === 'history' && (
              <History
                setCurrentPage={setCurrentPage}
                setSelectedAnalysisId={setSelectedAnalysisId}
              />
            )}
            {currentPage === 'vault' && (
              <EvidenceVault
                setCurrentPage={setCurrentPage}
                setSelectedAnalysisId={setSelectedAnalysisId}
              />
            )}
            {currentPage === 'threat' && <ThreatIntel />}
            {currentPage === 'models' && <Models />}
            {currentPage === 'settings' && (
              <AuditSettings
                analystMode={analystMode}
                setAnalystMode={setAnalystMode}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
