import React from 'react';
import { Anomaly } from '../../types/anomalies';
import { Modal } from '../common/Modal';
import { SeverityBadge, RiskBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatting';
import {
  AlertOctagon,
  FileSearch,
  Scale,
  Activity,
  ShieldCheck,
  UserCheck,
  Calendar,
  ExternalLink,
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
      subtitle={`Algorithmic Anomaly Report • District: ${anomaly.districtName}, ${anomaly.state} • Detected: ${formatDate(anomaly.detectedDate)}`}
    >
      <div className="space-y-6 text-slate-800 text-xs">
        {/* Risk Score Meter */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Composite Risk Assessment
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {anomaly.riskScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
                <RiskBadge level={anomaly.riskLevel} />
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Risk Severity Index</span>
              <span className="text-rose-600">{anomaly.riskScore}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${anomaly.riskScore}%` }}
                className={`h-full ${
                  anomaly.riskScore >= 80 ? 'bg-red-600' : anomaly.riskScore >= 60 ? 'bg-orange-500' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 1: Why Was This Flagged? */}
        <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-rose-950 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-rose-700" />
            <span>Why was this flagged?</span>
          </h4>
          <p className="text-slate-800 text-xs leading-relaxed">
            {anomaly.explanation}
          </p>
        </div>

        {/* Section 2: Underlying Numerical Evidence */}
        <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Scale className="w-4 h-4 text-forest-700" />
            <span>Cadastral Evidence & Parameter Telemetry</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {anomaly.evidence.map((ev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {ev.metric}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-slate-900 font-mono">
                    {ev.claimedValue} {ev.unit || ''}
                  </span>
                  {ev.delta && (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-100/70 px-1.5 py-0.5 rounded font-mono">
                      {ev.delta}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Expected / Baseline: <b>{ev.expectedValue} {ev.unit || ''}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Recommended Procedural Action (Future AI Layer preview) */}
        <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-forest-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              <span>Recommended Administrative Action</span>
            </h4>
            <span className="text-[10px] font-semibold text-forest-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
              Statutory FRA Guidelines
            </span>
          </div>
          <p className="text-slate-800 text-xs leading-relaxed font-medium">
            {anomaly.recommendedAction}
          </p>
          {anomaly.assignedOfficer && (
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-600 border-t border-emerald-200/60">
              <UserCheck className="w-3.5 h-3.5 text-forest-700" />
              <span>Assigned Officer: <b>{anomaly.assignedOfficer}</b></span>
            </div>
          )}
        </div>

        {/* Section 4: Target Claim Link */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Associated FRA Claim
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs">{anomaly.claimId}</span>
          </div>
          <Link
            to={`/claims?search=${anomaly.claimId}`}
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Open Claim Record</span>
            <ExternalLink className="w-3.5 h-3.5 text-forest-700" />
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-mono">Status: {anomaly.status}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Simulated: Escalating ${anomaly.id} to Sub-Divisional Magistrate.`)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Escalate to SDLC
            </button>
            <button
              onClick={() => alert(`Simulated: Marking ${anomaly.id} as Under Investigation.`)}
              className="px-4 py-1.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Mark Under Review
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
