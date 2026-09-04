import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Overview } from './pages/Overview';
import { GisMapPage } from './pages/GisMapPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { DistrictsPage } from './pages/DistrictsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShieldCheck, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
        {/* Collapsible Left Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Right Shell: Header + Main View + Footer */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header */}
          <Header />

          {/* Unobtrusive Demo Dataset Notice */}
          <div className="bg-emerald-950 text-emerald-200 text-[11px] px-6 py-1 flex items-center justify-between border-b border-emerald-900/60 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <b>Simulated Evaluation Environment:</b> Active dataset contains 52 modeled districts and cadastral claim profiles for FRA decision-support demonstration.
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300/70 hidden md:inline">
              VANVISION v1.0.0-rc1 • National Informatics Framework
            </span>
          </div>

          {/* Scrollable Main Workspace */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/80">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/map" element={<GisMapPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="/anomalies" element={<AnomaliesPage />} />
                <Route path="/districts" element={<DistrictsPage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
