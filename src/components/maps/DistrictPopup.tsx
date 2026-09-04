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
    <div className="w-64 p-3.5 bg-white text-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div>
          <h4 className="font-bold text-slate-900 text-sm leading-tight">{district.name}</h4>
          <span className="text-[11px] text-slate-500">{district.state}</span>
        </div>
        <RiskBadge level={district.riskLevel} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
            <FileText className="w-3 h-3 text-forest-700" />
            <span>Total Claims</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">{formatNumber(district.totalClaims)}</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Approval Rate</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">{formatPercent(district.approvalRate)}</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Avg Lifecycle</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">{formatDays(district.avgProcessingDays)}</span>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Active Anomalies</span>
          </div>
          <span className="font-bold text-rose-700 text-sm">{district.activeAnomalies}</span>
        </div>
      </div>

      {/* Primary Issue & Risk Score */}
      <div className="mb-3 p-2 bg-amber-50/70 border border-amber-200/80 rounded text-[11px]">
        <div className="flex justify-between items-center text-amber-900 font-semibold mb-0.5">
          <span>Risk Score</span>
          <span className="font-mono text-xs">{district.riskScore} / 100</span>
        </div>
        <p className="text-amber-800/90 leading-snug">{district.primaryIssue}</p>
      </div>

      {/* Action Button */}
      {onInspect && (
        <button
          onClick={() => onInspect(district)}
          className="w-full py-1.5 px-3 bg-forest-800 hover:bg-forest-900 text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Inspect District Intelligence</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
