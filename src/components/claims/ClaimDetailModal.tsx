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
      <div className="space-y-6 text-slate-800 text-xs">
        {/* Workflow Progression Stepper */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
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
                        ? 'bg-forest-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-500'
                    } ${isCurrent ? 'ring-2 ring-forest-600 ring-offset-2' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-tight ${
                      isCurrent ? 'text-forest-900 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
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
          <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <FileCheck className="w-4 h-4 text-forest-700" />
              <span>Claimant Profile</span>
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Primary Claimant</span>
                <span className="font-bold text-slate-900">{claim.claimantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Spouse / Joint Holder</span>
                <span className="font-medium text-slate-700">{claim.spouseName || 'N/A (Individual)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Community / Category</span>
                <span className="font-semibold text-slate-800">{claim.claimantCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Statutory Provision</span>
                <span className="font-medium text-slate-700 font-mono">
                  {claim.claimType === 'IFR' ? 'Sec 3(1)(a)' : claim.claimType === 'CFR' ? 'Sec 3(1)(b-e)' : 'Sec 3(1)(i)'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <MapPin className="w-4 h-4 text-forest-700" />
              <span>Spatial Jurisdiction</span>
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">State & District</span>
                <span className="font-semibold text-slate-800">
                  {claim.districtName}, {claim.state}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Tehsil / Sub-Division</span>
                <span className="font-medium text-slate-700">{claim.block}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Gram Panchayat & Village</span>
                <span className="font-medium text-slate-700">{claim.village} ({claim.gramPanchayat})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">GPS Geo Coordinates</span>
                <span className="font-mono text-[11px] text-slate-600">
                  {claim.gpsCoordinates ? `${claim.gpsCoordinates.lat.toFixed(4)}° N, ${claim.gpsCoordinates.lng.toFixed(4)}° E` : 'Pending DGPS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Land & Cadastral Comparison */}
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-forest-700" />
              <span>Cadastral Boundary & Land Extent Analysis</span>
            </h4>
            {hasAreaMismatch ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Discrepancy: {formatHectares(claim.landDetails.discrepancyHa)}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Exact Cadastral Match
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Claimed Extent (FRC)
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
                {formatHectares(claim.landDetails.claimedAreaHa)}
              </span>
              <span className="text-[10px] text-slate-500">Traditional occupation polygon</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Revenue / Forest Record
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
                {formatHectares(claim.landDetails.recordedAreaHa)}
              </span>
              <span className="text-[10px] text-slate-500">Working Plan / Khasra Record</span>
            </div>

            <div
              className={`p-3 rounded-lg border text-center ${
                hasAreaMismatch ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block ${
                  hasAreaMismatch ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                Computed Variance
              </span>
              <span
                className={`text-lg font-black font-mono mt-1 block ${
                  hasAreaMismatch ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {claim.landDetails.discrepancyHa > 0 ? '+' : ''}
                {formatHectares(claim.landDetails.discrepancyHa)}
              </span>
              <span className={`text-[10px] ${hasAreaMismatch ? 'text-rose-600' : 'text-emerald-600'}`}>
                {hasAreaMismatch ? 'Requires joint field inspection' : 'Within legal threshold'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-500 font-medium">Survey / Khasra Reference: </span>
              <span className="font-mono font-bold text-slate-800">
                {claim.landDetails.surveyNumber || 'Not Allotted'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Forest Compartment: </span>
              <span className="font-mono font-bold text-slate-800">
                {claim.landDetails.compartmentNumber || 'Unclassified State Forest'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-medium">Canopy & Biome Description: </span>
              <span className="font-medium text-slate-700">{claim.landDetails.forestType}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Risk & Connected Anomalies */}
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-forest-700" />
              <span>Risk Assessment & Flagged Anomalies</span>
            </h4>
            <div className="flex items-center gap-2">
              <RiskBadge level={claim.riskLevel} />
              <span className="font-mono text-xs font-bold text-slate-800">
                Score: {claim.riskScore}/100
              </span>
            </div>
          </div>

          {claim.flaggedAnomalyIds.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-rose-700 font-medium">
                This claim has active anomaly flags requiring administrative clearance:
              </p>
              {claim.flaggedAnomalyIds.map((anomId) => (
                <div
                  key={anomId}
                  className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-800 text-xs">{anomId}</span>
                    <span className="text-xs text-slate-600 font-medium">Critical Land Discrepancy</span>
                  </div>
                  <Link
                    to={`/anomalies?search=${anomId}`}
                    onClick={onClose}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
                  >
                    Open Anomaly Case →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No algorithmic anomalies or SLA breaches identified for this claim record.</span>
            </div>
          )}

          {claim.notes && (
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              <b className="text-slate-800">Field Notes:</b> {claim.notes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="text-[11px] text-slate-400 font-mono">
            Recorded Date: {formatDate(claim.submissionDate)} ({formatDays(claim.processingDays)} in system)
          </div>
          <button
            onClick={() => alert(`Simulated: Downloading prototype FRA dossier summary for ${claim.id}`)}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier (PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
