import React from 'react';
import { District } from '../../types/districts';
import { RiskBadge } from '../common/Badge';
import { formatNumber, formatPercent, formatDays } from '../../utils/formatting';
import { ChevronRight, FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface DistrictPopupProps {
  district: District;
  onInspect?: (district: District) => void;
}

export const DistrictPopup: React.FC<DistrictPopupProps> = ({ district, onInspect }) => {
  return (
    <div className="w-72 p-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 pr-6">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{district.name}</h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{district.state}</span>
        </div>
        <RiskBadge level={district.riskLevel} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <FileText className="w-3 h-3 text-forest-700 dark:text-emerald-400" />
            <span>Total Claims</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
            {formatNumber(district.totalClaims)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Approval Rate</span>
          </div>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm font-mono mt-0.5 block">
            {formatPercent(district.approvalRate)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Avg Lifecycle</span>
          </div>
          <span className="font-bold text-amber-700 dark:text-amber-400 text-sm font-mono mt-0.5 block">
            {formatDays(district.avgProcessingDays)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            <span>Active Flags</span>
          </div>
          <span className="font-bold text-rose-700 dark:text-rose-400 text-sm font-mono mt-0.5 block">
            {district.activeAnomalies}
          </span>
        </div>
      </div>

      {/* Primary Issue & Risk Score */}
      <div className="mb-3 p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-lg text-[11px]">
        <div className="flex justify-between items-center text-amber-950 dark:text-amber-200 font-bold mb-1">
          <span>Cadastral Hotspot Issue</span>
          <span className="font-mono text-xs text-amber-900 dark:text-amber-300">{district.riskScore}/100</span>
        </div>
        <p className="text-amber-900/90 dark:text-amber-200/80 leading-relaxed text-[11px]">{district.primaryIssue}</p>
      </div>

      {/* Action Button */}
      {onInspect && (
        <button
          onClick={() => onInspect(district)}
          className="w-full py-2 px-3 bg-forest-850 hover:bg-forest-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <span>Open Full District Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
