import React from 'react';
import { District } from '../../types/districts';
import { RiskBadge, ClaimTypeBadge } from '../common/Badge';
import { formatNumber, formatPercent, formatDays } from '../../utils/formatting';
import {
  Building2,
  Trees,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DistrictDetailViewProps {
  district: District;
  onBack: () => void;
}

export const DistrictDetailView: React.FC<DistrictDetailViewProps> = ({ district, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Top Header & Back Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Back to All Districts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{district.name}</h2>
              <RiskBadge level={district.riskLevel} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{district.state} • Central Tribal Forest Region</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to={`/claims?districtId=${district.id}`}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
            <span>View Claims ({formatNumber(district.totalClaims)})</span>
          </Link>
          <Link
            to={`/anomalies?districtId=${district.id}`}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Anomalies ({district.activeAnomalies})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Claims</span>
            <FileText className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatNumber(district.totalClaims)}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Registered under FRA 2006</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span>Approved (Titles)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            {formatNumber(district.approvedClaims)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            {formatPercent(district.approvalRate)} Title Vested
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span>Pending Lifecycle</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">
            {formatNumber(district.pendingClaims)}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
            Avg Duration: <b>{formatDays(district.avgProcessingDays)}</b>
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span>Active Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
            {district.activeAnomalies}
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1 block">
            Composite Risk: {district.riskScore}/100
          </span>
        </div>
      </div>

      {/* Demographic & Forest Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-forest-800 dark:text-emerald-300">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Forest Canopy Area
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {formatNumber(district.forestCoverSqKm)} km²
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Model Benchmark (Estimated Proxy)</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Scheduled Tribe Share
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {district.tribalPopulationPct}%
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Demographic Model Estimate</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Dominant Rights Type
            </span>
            <div className="flex items-center gap-2 mt-1">
              <ClaimTypeBadge type={district.dominantClaimType} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {district.dominantClaimType === 'IFR' ? 'Individual Forest Rights' : 'Community Forest Rights'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated AI-Generated Governance Summary */}
      <div className="p-5 bg-gradient-to-br from-forest-950 via-[#0a3122] to-forest-900 text-white rounded-xl shadow-md border border-emerald-800/80 space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-100">
              AI Decision Support Synthesis: District Governance Summary
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-800/60 text-emerald-300 border border-emerald-700/60">
            VANVISION Copilot Model v1.0
          </span>
        </div>

        <div className="space-y-2 text-xs text-emerald-100/90 leading-relaxed">
          <p>
            <b>Administrative Bottleneck Assessment:</b> District <b>{district.name}</b> has an average claim processing duration of{' '}
            <b>{district.avgProcessingDays} days</b>, which exceeds the state SLA benchmark by{' '}
            <b>{Math.max(0, district.avgProcessingDays - 90)} days</b>. The primary operational constraint identified is{' '}
            <span className="text-amber-300 font-semibold">{district.primaryIssue}</span>.
          </p>
          <p>
            <b>Geographic & Cadastral Risk Factors:</b> With {formatNumber(district.forestCoverSqKm)} km² of forest cover and {district.tribalPopulationPct}% scheduled tribe population, 
            the district requires accelerated SDLC quorum frequency and high-resolution satellite overlay verification to resolve pending title boundaries.
          </p>
        </div>

        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded bg-emerald-900/80 border border-emerald-700/60 text-emerald-200">
            Action 1: Prioritize 183 delayed claims at SDLC level
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-900/80 border border-emerald-700/60 text-emerald-200">
            Action 2: Execute joint DGPS demarcation in buffer tracts
          </span>
        </div>
      </div>
    </div>
  );
};
