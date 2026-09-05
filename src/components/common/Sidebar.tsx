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
      badge: 'GIS',
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
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
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
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
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
      className={`relative flex flex-col bg-[#072418] text-slate-100 transition-all duration-200 ease-in-out border-r border-emerald-950/70 select-none z-40 shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-emerald-900/60 bg-[#051c13]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm border border-emerald-400/40">
            <Layers className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-black text-sm tracking-wider text-emerald-50 leading-tight">
                VANVISION
              </span>
              <span className="text-[9px] text-emerald-300/80 font-semibold tracking-tight uppercase mt-0.5">
                Forest Rights Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-emerald-800/50 transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-3.5 space-y-1 overflow-y-auto">
        <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-400/50 px-2 pb-2">
          {!collapsed ? 'Core Intelligence' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-800/50 text-white font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
              }`}
            >
              {/* Left Accent indicator for active page */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r-full shadow-xs" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-300' : 'text-emerald-300/70'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor ||
                        'bg-emerald-950/90 text-emerald-300/90 border border-emerald-800/60'
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
      <div className="p-2.5 border-t border-emerald-900/60 bg-[#051c13]/90 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-900/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-100">
                  Evaluation Node: Active
                </span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400/80">v1.2</span>
            </div>
            <p className="text-[9px] text-emerald-300/70 mt-1 leading-snug">
              Cadastral engine & anomaly classifier synchronized.
            </p>
          </div>
        )}

        {/* Settings Link */}
        <NavLink
          to="/settings"
          title={collapsed ? 'System Settings' : undefined}
          className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white transition-colors ${
            location.pathname === '/settings'
              ? 'bg-emerald-800/50 text-white font-semibold'
              : ''
          }`}
        >
          {location.pathname === '/settings' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r-full shadow-xs" />
          )}
          <Settings className="w-4 h-4 text-emerald-300/70 shrink-0" />
          {!collapsed && <span>System Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};
