import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Anomaly } from '../types/anomalies';
import { AnomaliesFilterState } from '../types/filters';
import { AnomalySeverityBreakdown } from '../types/stats';
import { AnomalyFilterBar } from '../components/anomalies/AnomalyFilterBar';
import { AnomaliesTable } from '../components/anomalies/AnomaliesTable';
import { AnomalyDetailModal } from '../components/anomalies/AnomalyDetailModal';
import { LoadingSpinner } from '../components/common/LoadingState';
import { AlertOctagon, Sliders } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AnomaliesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [breakdown, setBreakdown] = useState<AnomalySeverityBreakdown | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  const initialFilter: AnomaliesFilterState = {
    search: searchParams.get('search') || '',
    severity: (searchParams.get('severity') as any) || 'All',
    anomalyType: (searchParams.get('anomalyType') as any) || 'All',
    districtId: searchParams.get('districtId') || 'All',
    status: 'All',
  };

  const [filter, setFilter] = useState<AnomaliesFilterState>(initialFilter);

  useEffect(() => {
    async function loadAnomalies() {
      setLoading(true);
      try {
        const engineConfig = {
          maxProcessingDays: settings.maxProcessingDays,
          landVarianceTolerancePct: settings.landVarianceTolerance,
          autoFlagSpikes: settings.autoFlagSpikes,
        };
        const [anomList, bd] = await Promise.all([
          api.getAnomalies(filter, engineConfig),
          api.getAnomalyBreakdown(engineConfig),
        ]);
        setAnomalies(anomList);
        setBreakdown(bd);

        // Auto-open modal if exact search parameter matches
        if (filter.search && anomList.length === 1 && anomList[0].id.toLowerCase() === filter.search.toLowerCase()) {
          setSelectedAnomaly(anomList[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadAnomalies();
  }, [filter, settings]);

  const handleReset = () => {
    setFilter({
      search: '',
      severity: 'All',
      anomalyType: 'All',
      districtId: 'All',
      status: 'All',
    });
    setSearchParams({});
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Anomaly Investigation Dashboard</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                Deterministic Engine Queue
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Sliders className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span>Active Rules: {settings.maxProcessingDays}d SLA • ±{settings.landVarianceTolerance}% Area Margin</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Algorithmic detection of statutory processing delays, spatial polygon mismatches, and boundary overlaps.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Severity Summary Cards */}
      {breakdown && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setFilter({ ...filter, severity: 'Critical' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filter.severity === 'Critical'
                ? 'bg-red-50/80 dark:bg-red-950/50 border-red-500 ring-2 ring-red-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
              <span className="font-semibold text-red-700 dark:text-red-400">Critical Severity</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            </div>
            <div className="text-2xl font-black text-red-700 dark:text-red-400 font-mono">{breakdown.critical}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Immediate field inspection</span>
          </div>

          <div
            onClick={() => setFilter({ ...filter, severity: 'High' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filter.severity === 'High'
                ? 'bg-orange-50/80 dark:bg-orange-950/50 border-orange-500 ring-2 ring-orange-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
              <span className="font-semibold text-orange-700 dark:text-orange-400">High Risk</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            </div>
            <div className="text-2xl font-black text-orange-700 dark:text-orange-400 font-mono">{breakdown.high}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">SDLC committee inquiry</span>
          </div>

          <div
            onClick={() => setFilter({ ...filter, severity: 'Medium' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filter.severity === 'Medium'
                ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
              <span className="font-semibold text-amber-700 dark:text-amber-400">Medium Attention</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            </div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">{breakdown.medium}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Revenue Khasra check</span>
          </div>

          <div
            onClick={() => setFilter({ ...filter, severity: 'Low' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filter.severity === 'Low'
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 ring-2 ring-slate-400/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Low Variance</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            </div>
            <div className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono">{breakdown.low}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Within tolerance margin</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <AnomalyFilterBar filter={filter} onChange={setFilter} onReset={handleReset} />

      {/* Anomalies Table */}
      {loading ? (
        <LoadingSpinner label="Scanning Cadastral Telemetry..." className="h-64" />
      ) : (
        <AnomaliesTable
          anomalies={anomalies}
          onSelectAnomaly={(anom) => setSelectedAnomaly(anom)}
        />
      )}

      {/* Anomaly Detail Modal */}
      <AnomalyDetailModal
        anomaly={selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        onViewClaim={(claimId) => navigate(`/claims?search=${claimId}`)}
      />
    </div>
  );
};
