import React from 'react';
import { RecentActivityItem } from '../../types/stats';
import { AlertTriangle, Clock, CheckCircle2, FileText, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: RecentActivityItem['type'], severity?: string) => {
    if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'sla':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Cadastral Activity Feed</h3>
            <p className="text-[11px] text-slate-500">Real-time system events, flags & titling updates</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Auto-refresh: 30s</span>
      </div>

      <div className="mt-3 divide-y divide-slate-100 flex-1">
        {activities.map((item) => (
          <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3 group">
            <div className="mt-0.5 p-1.5 rounded-md bg-slate-50 border border-slate-200 shrink-0">
              {getIcon(item.type, item.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-forest-800 transition-colors">
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              {item.targetRoute && (
                <Link
                  to={item.targetRoute}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-700 hover:text-forest-900 mt-1"
                >
                  <span>Inspect target</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
