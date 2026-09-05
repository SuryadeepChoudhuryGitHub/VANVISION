import React from 'react';
import { Anomaly } from '../../types/anomalies';
import { Modal } from '../common/Modal';
import { SeverityBadge, RiskBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatting';
import {
  AlertOctagon,
  FileSearch,
  Scale,
  ShieldCheck,
  UserCheck,
  Calendar,
  ExternalLink,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnomalyDetailModalProps {
  anomaly: Anomaly | null;
  onClose: () => void;
  onViewClaim?: (claimId: string) => void;
}

export const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({
  anomaly,
  onClose,
  onViewClaim,
}) => {
  if (!anomaly) return null;

  return (
    <Modal
      isOpen={!!anomaly}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-rose-800 font-black">{anomaly.id}</span>
          <SeverityBadge severity={anomaly.severity} />
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {anomaly.anomalyType}
          </span>
        </div>
      }
      subtitle={`Algorithmic Anomaly Dossier • District: ${anomaly.districtName}, ${anomaly.state} • Detected: ${formatDate(anomaly.detectedDate)}`}
    >
      <div className="space-y-5 text-slate-800 dark:text-slate-200 text-xs">
        {/* Risk Score Meter & Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                Composite Severity Assessment
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {anomaly.riskScore}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">/ 100</span>
                <RiskBadge level={anomaly.riskLevel} />
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              <span>Risk Severity Index</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">{anomaly.riskScore}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                style={{ width: `${anomaly.riskScore}%` }}
                className={`h-full ${
                  anomaly.riskScore >= 80
                    ? 'bg-red-600'
                    : anomaly.riskScore >= 60
                    ? 'bg-orange-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 1: Algorithmic Finding (What happened & Why was it flagged?) */}
        <div className="p-4 border border-rose-200/90 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-rose-700 dark:text-rose-400" />
              <span>Why Was This Flagged?</span>
            </h4>
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 font-mono">
              Rule: {anomaly.ruleTriggered}
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-medium">
            {anomaly.explanation}
          </p>
        </div>

        {/* Section 2: Mathematical Evidence Comparison Tiles */}
        {anomaly.mathematicalEvidence && (
          <div className="p-4 border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-blue-200/80 dark:border-blue-900/60 pb-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide text-[11px]">
                  MATHEMATICAL EVIDENCE COMPARISON
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 self-start sm:self-auto">
                {anomaly.mathematicalEvidence.statusText}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {/* Tile 1: Claimed / Observed */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  {anomaly.anomalyType === 'Processing Delay' ? 'Observed Duration' : 'Claimed Extent'}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                  {anomaly.mathematicalEvidence.claimedValue}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Present on record</span>
              </div>

              {/* Tile 2: Statutory / Recorded Baseline */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  {anomaly.anomalyType === 'Processing Delay' ? 'Statutory SLA' : 'Official Baseline'}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                  {anomaly.mathematicalEvidence.expectedValue}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Statutory limit</span>
              </div>

              {/* Tile 3: Computed Delta */}
              <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl shadow-2xs">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
                  Variance (Delta)
                </span>
                <span className="text-base font-black text-rose-700 dark:text-rose-300 font-mono mt-1 block">
                  {anomaly.mathematicalEvidence.difference}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">Excess breached</span>
              </div>

              {/* Tile 4: Active Policy Threshold */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  Configured Threshold
                </span>
                <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                  {anomaly.mathematicalEvidence.threshold}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Policy limit</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Telemetry Breakdown */}
        <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Scale className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
            <span>Cadastral Evidence & Parameter Telemetry</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {anomaly.evidence.map((ev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {ev.metric}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 font-mono">
                    {ev.claimedValue} {ev.unit || ''}
                  </span>
                  {ev.delta && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/60 px-1.5 py-0.5 rounded font-mono">
                      {ev.delta}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Expected / Baseline: <b>{ev.expectedValue} {ev.unit || ''}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Procedural Action */}
        <div className="p-4 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-forest-950 dark:text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Recommended Administrative Action</span>
            </h4>
            <span className="text-[10px] font-semibold text-forest-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
              Statutory FRA Guidelines
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-medium">
            {anomaly.recommendedAction}
          </p>
          {anomaly.assignedOfficer && (
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <UserCheck className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
              <span>
                Designated Jurisdictional Desk: <b>{anomaly.assignedOfficer}</b>
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Associated Claim: <b className="font-mono text-slate-800 dark:text-slate-200">{anomaly.claimId}</b>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/claims?search=${encodeURIComponent(anomaly.claimId)}`}
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect Claim Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-forest-850 hover:bg-forest-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
