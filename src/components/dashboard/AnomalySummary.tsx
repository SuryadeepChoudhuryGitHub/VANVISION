import React from 'react';
import { AnomalySeverityBreakdown } from '../../types/stats';
import { AlertOctagon, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnomalySummaryProps {
  breakdown: AnomalySeverityBreakdown;
}

export const AnomalySummary: React.FC<AnomalySummaryProps> = ({ breakdown }) => {
  const total = breakdown.critical + breakdown.high + breakdown.medium + breakdown.low;

  const items = [
    { label: 'Critical', count: breakdown.critical, color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50' },
    { label: 'High', count: breakdown.high, color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'Medium', count: breakdown.medium, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Low', count: breakdown.low, color: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Anomaly Severity Breakdown</h3>
            <p className="text-[11px] text-slate-500">Active flags requiring administrative intervention</p>
          </div>
        </div>
        <Link
          to="/anomalies"
          className="text-xs font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-0.5"
        >
          <span>Investigate All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Segmented Bar */}
      <div className="mt-4">
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${(breakdown.critical / total) * 100}%` }}
            className="bg-red-600 h-full transition-all"
            title={`Critical: ${breakdown.critical}`}
          />
          <div
            style={{ width: `${(breakdown.high / total) * 100}%` }}
            className="bg-orange-500 h-full transition-all"
            title={`High: ${breakdown.high}`}
          />
          <div
            style={{ width: `${(breakdown.medium / total) * 100}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`Medium: ${breakdown.medium}`}
          />
          <div
            style={{ width: `${(breakdown.low / total) * 100}%` }}
            className="bg-slate-300 h-full transition-all"
            title={`Low: ${breakdown.low}`}
          />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-4 flex-1">
        {items.map((item) => (
          <div key={item.label} className={`p-3 rounded-lg border border-slate-200/80 ${item.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-xl font-black ${item.text}`}>{item.count}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {Math.round((item.count / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Total Flagged Queue: <b className="text-slate-800 font-mono">{total}</b></span>
        <span className="text-rose-600 font-medium">18 Require MoTA Escalation</span>
      </div>
    </div>
  );
};
