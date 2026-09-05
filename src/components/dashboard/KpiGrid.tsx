import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { OverviewStats } from '../../types/stats';
import { formatNumber, formatPercent } from '../../utils/formatting';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';

interface KpiGridProps {
  stats: OverviewStats;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ stats }) => {
  const { settings } = useSettings();

  const isVisible = (id: string) =>
    !settings.visibleKpis || settings.visibleKpis.includes(id);

  return (
    <div className="space-y-4">
      {/* 1. Primary Intelligence Row: 4 Heroic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Claims */}
        {isVisible('total') && (
          <div className="kpi-card bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Claims Registered
                </span>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                {formatNumber(stats.totalClaims)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Individual (IFR) & Community (CFR/CFRR) cadastral claims
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>+3.8% quarterly growth</span>
              </div>
              <Link
                to="/claims"
                className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Registry</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Card 2: Titles Conferred */}
        {isVisible('approved') && (
          <div className="kpi-card bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-l-4 border-l-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Titles Conferred
                </span>
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-teal-800 dark:text-teal-400 font-mono leading-none">
                {formatNumber(stats.approvedClaims)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Vested under Section 3(1) with land rights protection
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px]">
                {formatPercent(stats.approvalRate)} Titling Rate
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Sec. 3(1) Saturation</span>
            </div>
          </div>
        )}

        {/* Card 3: Active Pipeline */}
        {isVisible('pending') && (
          <div className="kpi-card bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Pipeline
                </span>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-800 dark:text-amber-400 font-mono leading-none">
                {formatNumber(stats.pendingClaims)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Under scrutiny across Gram Sabha, SDLC & DLC tiers
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>Avg. {stats.avgPendingDays}d duration</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                SLA: {settings.maxProcessingDays}d
              </span>
            </div>
          </div>
        )}

        {/* Card 4: Active Anomalies */}
        {isVisible('anomalies') && (
          <div className="kpi-card bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 border-l-4 border-l-rose-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Anomalies Flagged
                </span>
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-rose-700 dark:text-rose-400 font-mono leading-none">
                  {formatNumber(stats.activeAnomalies)}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {stats.criticalAnomalies} Critical
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Deterministic SLA delays, polygon mismatches & overlaps
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Requires SLMC action</span>
              <Link
                to="/anomalies?severity=Critical"
                className="text-[11px] font-semibold text-rose-800 dark:text-rose-400 hover:text-rose-950 dark:hover:text-rose-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Audit Console</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Secondary Context Strip: Adjudication Balance, SLA Latency & Monitored Footprint */}
      {settings.showSecondaryMetrics && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Adjudication Distribution Progress */}
          <div className="space-y-1.5 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-3 md:pb-0">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                <span>Adjudication Ratio</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {formatPercent(stats.approvalRate)} Appr. • {formatPercent(stats.rejectionRate)} Rej.
              </span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${stats.approvalRate}%` }}
                className="bg-emerald-600 h-full"
                title={`Approved: ${stats.approvalRate}%`}
              />
              <div
                style={{ width: `${stats.rejectionRate}%` }}
                className="bg-slate-400 h-full"
                title={`Rejected: ${stats.rejectionRate}%`}
              />
              <div
                style={{
                  width: `${Math.max(0, 100 - stats.approvalRate - stats.rejectionRate)}%`,
                }}
                className="bg-amber-400 h-full"
                title="In Active Pipeline"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>{formatNumber(stats.approvedClaims)} Conferred</span>
              <span>{formatNumber(stats.rejectedClaims)} Returned/Rejected</span>
            </div>
          </div>

          {/* Statutory Lifecycle SLA Benchmark */}
          <div className="space-y-1.5 px-0 md:px-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-3 md:pb-0">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Statutory SLA Compliance</span>
              </span>
              <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                {stats.avgPendingDays}d / {settings.maxProcessingDays}d SLA
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.min(100, (stats.avgPendingDays / settings.maxProcessingDays) * 75)}%`,
                }}
                className={`h-full ${
                  stats.avgPendingDays > settings.maxProcessingDays ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Statutory Benchmark: {settings.maxProcessingDays} Days</span>
              <span className="text-amber-700 dark:text-amber-400 font-medium">
                +{stats.avgPendingDays - settings.maxProcessingDays}d Over Target
              </span>
            </div>
          </div>

          {/* Monitored Footprint */}
          <div className="space-y-1.5 pl-0 md:pl-2 flex flex-col justify-between">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Jurisdictional Footprint</span>
              </span>
              <Link to="/districts" className="text-blue-700 dark:text-blue-400 hover:underline font-semibold text-[11px]">
                52 Districts →
              </Link>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Coverage across <b>{stats.statesCovered} priority states</b>: Madhya Pradesh, Odisha, Chhattisgarh, Maharashtra, and Jharkhand.
            </p>
            <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>ISFR 2021 & MoTA Schedule Framework</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
