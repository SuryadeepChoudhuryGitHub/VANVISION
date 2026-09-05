import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Database, ChevronRight, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { mockRecentActivity } from '../../data/mockStats';
import { useSettings } from '../../context/SettingsContext';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    settings: 'System Configuration & Policy Personalization',
  };

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/claims?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userInitials =
    settings.userInitials ||
    settings.userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'SA';

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="flex items-center justify-between px-5 py-2.5">
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>FRA Monitoring</span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="capitalize text-forest-800 dark:text-emerald-400 font-semibold truncate">
                {currentPage.replace('-', ' ')}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">
              {pageTitleMap[currentPage] || 'VANVISION System'}
            </h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center max-w-md w-64 lg:w-80 relative"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim ID, district, claimant..."
            className="w-full pl-8 pr-12 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/70 focus:bg-white dark:focus:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:border-forest-600 dark:focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-200 shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 rounded border border-slate-300 dark:border-slate-600 pointer-events-none">
              /
            </kbd>
          )}
        </form>

        {/* Right Actions: System Status, Notifications, Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Simulated Data Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
            <Database className="w-3 h-3 text-forest-700 dark:text-emerald-400" />
            <span className="font-medium">Evaluation Dataset (52 Dists)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">System Telemetry & Alerts</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                      3 New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                  {mockRecentActivity.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-2.5"
                    >
                      {act.severity === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{act.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-mono">
                          {act.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
                  <Link
                    to="/anomalies"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-forest-800 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300"
                  >
                    Open Anomaly Audit Console →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Neutral Application Profile Representation (Configurable in Settings) */}
          <Link
            to="/settings"
            title="System Settings & Profile Configuration"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-85 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-forest-850 dark:bg-slate-800 text-emerald-300 dark:text-emerald-400 font-bold text-xs flex items-center justify-center ring-2 ring-forest-100 dark:ring-slate-700 shrink-0">
              {userInitials}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {settings.userName}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-tight">
                {settings.userRole}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
