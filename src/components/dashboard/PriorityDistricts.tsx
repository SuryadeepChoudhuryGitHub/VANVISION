import React from 'react';
import { District } from '../../types/districts';
import { RiskBadge } from '../common/Badge';
import { AlertTriangle, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PriorityDistrictsProps {
  districts: District[];
  onSelectDistrict: (district: District) => void;
  selectedDistrictId?: string;
}

export const PriorityDistricts: React.FC<PriorityDistrictsProps> = ({
  districts,
  onSelectDistrict,
  selectedDistrictId,
}) => {
  // Sort by riskScore descending and take top 5
  const priorityList = [...districts]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Priority Attention Districts</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Highest composite risk & administrative SLA backlog</p>
          </div>
        </div>
        <Link
          to="/districts"
          className="text-xs font-semibold text-brand-primary hover:text-brand-dark dark:text-emerald-400 flex items-center gap-0.5"
        >
          <span>View All (52)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-3 space-y-2.5 flex-1">
        {priorityList.map((district) => {
          const isSelected = selectedDistrictId === district.id;
          return (
            <div
              key={district.id}
              onClick={() => onSelectDistrict(district)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-forest-700 dark:border-emerald-500 bg-forest-50/50 dark:bg-emerald-950/40 shadow-xs ring-1 ring-forest-700/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate">{district.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">({district.state})</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 font-medium">
                  {district.primaryIssue}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Claims: <b>{district.totalClaims.toLocaleString()}</b></span>
                  <span>•</span>
                  <span>Anomalies: <b className="text-rose-600 dark:text-rose-400">{district.activeAnomalies}</b></span>
                  <span>•</span>
                  <span>Avg: <b>{district.avgProcessingDays}d</b></span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {district.riskScore}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">/100</span>
                </div>
                <RiskBadge level={district.riskLevel} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Click district row to center on map</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
};
