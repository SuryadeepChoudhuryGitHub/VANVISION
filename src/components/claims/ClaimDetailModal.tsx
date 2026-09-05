import React from 'react';
import { Claim } from '../../types/claims';
import { Modal } from '../common/Modal';
import { StatusBadge, ClaimTypeBadge, RiskBadge } from '../common/Badge';
import { formatDate, formatDays, formatHectares } from '../../utils/formatting';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  Compass,
  FileCheck,
  CheckCircle2,
  Download,
  Trees,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClaimDetailModalProps {
  claim: Claim | null;
  onClose: () => void;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose }) => {
  if (!claim) return null;

  const hasAreaMismatch = Math.abs(claim.landDetails.discrepancyHa) > 0.1;

  const workflowStages = [
    'Gram Sabha Verification',
    'SDLC Scrutiny',
    'DLC Final Approval',
    'Title Conferred',
  ];

  const currentStageIdx = workflowStages.indexOf(claim.workflowStage);

  return (
    <Modal
      isOpen={!!claim}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-forest-850 font-black">{claim.id}</span>
          <ClaimTypeBadge type={claim.claimType} />
          <StatusBadge status={claim.status} />
        </div>
      }
      subtitle={`Forest Rights Dossier • State of ${claim.state} • Recorded in Evaluation Registry`}
    >
      <div className="space-y-6 text-slate-800 dark:text-slate-200 text-xs">
        {/* Workflow Progression Stepper */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Administrative Workflow Lifecycle
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            {workflowStages.map((stage, idx) => {
              const isCompleted = currentStageIdx >= idx;
              const isCurrent = currentStageIdx === idx;
              return (
                <div key={stage} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                      isCompleted
                        ? 'bg-forest-700 dark:bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    } ${isCurrent ? 'ring-2 ring-forest-600 dark:ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-tight ${
                      isCurrent
                        ? 'text-forest-900 dark:text-emerald-400 font-bold'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 1: Claimant & Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <FileCheck className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Claimant Profile</span>
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Primary Claimant</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{claim.claimantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Spouse / Joint Holder</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{claim.spouseName || 'N/A (Individual)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Community / Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{claim.claimantCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Statutory Provision</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {claim.claimType === 'IFR' ? 'Sec 3(1)(a)' : claim.claimType === 'CFR' ? 'Sec 3(1)(b-e)' : 'Sec 3(1)(i)'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <MapPin className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Spatial Jurisdiction</span>
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">State & District</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {claim.districtName}, {claim.state}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Tehsil / Sub-Division</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{claim.block}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Gram Panchayat & Village</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{claim.village} ({claim.gramPanchayat})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">GPS Geo Coordinates</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {claim.gpsCoordinates ? `${claim.gpsCoordinates.lat.toFixed(4)}° N, ${claim.gpsCoordinates.lng.toFixed(4)}° E` : 'Pending DGPS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Land & Cadastral Comparison */}
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Cadastral Boundary & Land Extent Analysis</span>
            </h4>
            {hasAreaMismatch ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                Discrepancy: {formatHectares(claim.landDetails.discrepancyHa)}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Exact Cadastral Match
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-100 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                Claimed Extent (FRC)
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                {formatHectares(claim.landDetails.claimedAreaHa)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Traditional occupation polygon</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-100 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                Revenue / Forest Record
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
                {formatHectares(claim.landDetails.recordedAreaHa)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Working Plan / Khasra Record</span>
            </div>

            <div
              className={`p-3 rounded-lg border text-center ${
                hasAreaMismatch
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block ${
                  hasAreaMismatch ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                Computed Variance
              </span>
              <span
                className={`text-lg font-black font-mono mt-1 block ${
                  hasAreaMismatch ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {claim.landDetails.discrepancyHa > 0 ? '+' : ''}
                {formatHectares(claim.landDetails.discrepancyHa)}
              </span>
              <span className={`text-[10px] ${hasAreaMismatch ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {hasAreaMismatch ? 'Requires joint field inspection' : 'Within legal threshold'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Survey / Khasra Reference: </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {claim.landDetails.surveyNumber || 'Not Allotted'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Forest Compartment: </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {claim.landDetails.compartmentNumber || 'Unclassified State Forest'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Canopy & Biome Description: </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{claim.landDetails.forestType}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Risk & Connected Anomalies */}
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Risk Assessment & Flagged Anomalies</span>
            </h4>
            <div className="flex items-center gap-2">
              <RiskBadge level={claim.riskLevel} />
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                Score: {claim.riskScore}/100
              </span>
            </div>
          </div>

          {claim.flaggedAnomalyIds.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                This claim has active anomaly flags requiring administrative clearance:
              </p>
              {claim.flaggedAnomalyIds.map((anomId) => (
                <div
                  key={anomId}
                  className="p-2.5 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-800 dark:text-rose-300 text-xs">{anomId}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Critical Land Discrepancy</span>
                  </div>
                  <Link
                    to={`/anomalies?search=${anomId}`}
                    onClick={onClose}
                    className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline"
                  >
                    Open Anomaly Case →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>No algorithmic anomalies or SLA breaches identified for this claim record.</span>
            </div>
          )}

          {claim.notes && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <b className="text-slate-800 dark:text-slate-200">Field Notes:</b> {claim.notes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            Recorded Date: {formatDate(claim.submissionDate)} ({formatDays(claim.processingDays)} in system)
          </div>
          <button
            onClick={() => alert(`Simulated: Downloading prototype FRA dossier summary for ${claim.id}`)}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier (PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
