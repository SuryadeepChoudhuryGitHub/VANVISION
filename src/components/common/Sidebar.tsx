import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  AlertOctagon,
  Building2,
  Sparkles,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Radio,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/map',
      label: 'GIS Map',
      icon: MapIcon,
      badge: 'Live',
    },
    {
      to: '/claims',
      label: 'Claims',
      icon: FileText,
      badge: '45.5k',
    },
    {
      to: '/anomalies',
      label: 'Anomalies',
      icon: AlertOctagon,
      badge: '18 Crit',
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      to: '/districts',
      label: 'Districts',
      icon: Building2,
      badge: '52',
    },
    {
      to: '/ai-insights',
      label: 'AI Insights',
      icon: Sparkles,
      badge: 'Preview',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: FileBarChart2,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#0b291d] text-slate-100 transition-all duration-200 ease-in-out border-r border-emerald-950/60 select-none z-40 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-900/60 bg-[#082218]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Emblem Icon */}
          <div className="w-9 h-9 rounded-lg bg-emerald-600/90 flex items-center justify-center text-white shrink-0 shadow-sm border border-emerald-400/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-wider text-emerald-50 leading-none">
                VANVISION
              </span>
              <span className="text-[10px] text-emerald-300/80 font-medium tracking-wide mt-1 uppercase">
                Forest Rights Intelligence
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-20 bg-[#0f3b2a] hover:bg-emerald-700 text-white border border-emerald-600/40 rounded-full p-1 shadow-md transition-colors z-50 hidden md:flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-2.5 pb-2">
          {!collapsed ? 'Core Intelligence' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-700/80 text-white shadow-xs font-semibold'
                  : 'text-emerald-100/75 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-300/80'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / System Status & Settings */}
      <div className="p-3 border-t border-emerald-900/60 bg-[#082218]/90 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-900/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-100">National Node Live</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400/80">v1.2</span>
            </div>
            <p className="text-[10px] text-emerald-300/70 mt-1 leading-snug">
              FRA Cadastral Engine & Anomaly Classifier synchronized.
            </p>
          </div>
        )}

        {/* Settings Link */}
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-emerald-100/75 hover:bg-emerald-900/50 hover:text-white transition-colors ${
            location.pathname === '/settings' ? 'bg-emerald-700/80 text-white font-semibold' : ''
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-300/80 shrink-0" />
          {!collapsed && <span>System Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};
