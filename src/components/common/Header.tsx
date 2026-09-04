import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, ShieldCheck, Database, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockRecentActivity } from '../../data/mockStats';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derive breadcrumbs and title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[0] || 'overview';

  const pageTitleMap: Record<string, string> = {
    overview: 'National Executive Overview',
    map: 'Geographic Information System (GIS) Intelligence',
    claims: 'Forest Rights Claims Registry',
    anomalies: 'Anomaly Investigation Console',
    districts: 'District Performance & Risk Monitor',
    'ai-insights': 'Decision Intelligence & Copilot (Preview)',
    reports: 'Statutory Reports & Dossier Generation',
    settings: 'System Configuration & Policy Thresholds',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between px-6 py-2.5">
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>FRA Monitoring</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="capitalize text-forest-800 font-semibold">{currentPage.replace('-', ' ')}</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              {pageTitleMap[currentPage] || 'VANVISION System'}
            </h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center max-w-md w-72 lg:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim ID, district, claimant..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-forest-600 rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <Link
              to={`/claims?search=${encodeURIComponent(searchQuery)}`}
              className="absolute right-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-forest-700 text-white rounded hover:bg-forest-800 transition-colors"
            >
              Go
            </Link>
          )}
        </div>

        {/* Right Actions: System Status, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Simulated Data Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
            <Database className="w-3.5 h-3.5 text-forest-700" />
            <span className="font-medium">Demo Dataset (52 Dists)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">System Telemetry & Alerts</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">3 New</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {mockRecentActivity.slice(0, 4).map((act) => (
                    <div key={act.id} className="p-3 hover:bg-slate-50/80 transition-colors flex items-start gap-2.5">
                      {act.severity === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{act.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{act.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <Link
                    to="/anomalies"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-forest-800 hover:text-forest-900"
                  >
                    Open Anomaly Audit Console →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-forest-850 text-emerald-300 font-bold text-xs flex items-center justify-center ring-2 ring-forest-100">
              PS
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">P. K. Sharma</span>
              <span className="text-[10px] text-emerald-700 font-medium leading-tight">Demo Officer Persona</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
