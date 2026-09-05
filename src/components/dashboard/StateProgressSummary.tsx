import React from 'react';
import { District } from '../../types/districts';
import { Anomaly } from '../../types/anomalies';
import { RiskBadge } from '../common/Badge';
import { formatNumber, formatPercent } from '../../utils/formatting';
import { Building, AlertOctagon, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StateAggregate {
  state: string;
  districtsCount: number;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  approvalRate: number;
  avgProcessingDays: number;
  anomalyCount: number;
  criticalAnomalyCount: number;
  riskLevel: 'critical' | 'high' | 'attention' | 'normal';
}

interface StateProgressSummaryProps {
  districts: District[];
  anomalies: Anomaly[];
}

export const StateProgressSummary: React.FC<StateProgressSummaryProps> = ({
  districts,
  anomalies,
}) => {
  // Deterministically compute state-level rollups directly from district & anomaly data
  const stateAggregates: StateAggregate[] = React.useMemo(() => {
    const map = new Map<string, {
      districtsCount: number;
      totalClaims: number;
      approvedClaims: number;
      pendingClaims: number;
      rejectedClaims: number;
      weightedDaysSum: number;
      criticalDistricts: number;
      highDistricts: number;
    }>();

    for (const d of districts) {
      const cur = map.get(d.state) || {
        districtsCount: 0,
        totalClaims: 0,
        approvedClaims: 0,
        pendingClaims: 0,
        rejectedClaims: 0,
        weightedDaysSum: 0,
        criticalDistricts: 0,
        highDistricts: 0,
      };

      cur.districtsCount += 1;
      cur.totalClaims += d.totalClaims;
      cur.approvedClaims += d.approvedClaims;
      cur.pendingClaims += d.pendingClaims;
      cur.rejectedClaims += d.rejectedClaims;
      cur.weightedDaysSum += d.avgProcessingDays * d.totalClaims;

      if (d.riskLevel === 'critical') cur.criticalDistricts += 1;
      else if (d.riskLevel === 'high') cur.highDistricts += 1;

      map.set(d.state, cur);
    }

    const results: StateAggregate[] = [];

    map.forEach((cur, state) => {
      const stateAnomalies = anomalies.filter((a) => a.state.toLowerCase() === state.toLowerCase());
      const criticalAnomalyCount = stateAnomalies.filter((a) => a.severity === 'Critical').length;
      const approvalRate = cur.totalClaims > 0 ? (cur.approvedClaims / cur.totalClaims) * 100 : 0;
      const avgProcessingDays =
        cur.totalClaims > 0 ? Math.round(cur.weightedDaysSum / cur.totalClaims) : 0;

      let riskLevel: 'critical' | 'high' | 'attention' | 'normal' = 'normal';
      if (cur.criticalDistricts >= 2 || criticalAnomalyCount >= 4 || avgProcessingDays >= 120) {
        riskLevel = 'critical';
      } else if (cur.criticalDistricts >= 1 || cur.highDistricts >= 2 || avgProcessingDays >= 100) {
        riskLevel = 'high';
      } else if (cur.highDistricts >= 1 || avgProcessingDays >= 85) {
        riskLevel = 'attention';
      }

      results.push({
        state,
        districtsCount: cur.districtsCount,
        totalClaims: cur.totalClaims,
        approvedClaims: cur.approvedClaims,
        pendingClaims: cur.pendingClaims,
        rejectedClaims: cur.rejectedClaims,
        approvalRate,
        avgProcessingDays,
        anomalyCount: stateAnomalies.length,
        criticalAnomalyCount,
        riskLevel,
      });
    });

    // Sort states by risk priority: critical first, then high, etc.
    const riskWeight = { critical: 4, high: 3, attention: 2, normal: 1 };
    return results.sort((a, b) => riskWeight[b.riskLevel] - riskWeight[a.riskLevel] || b.totalClaims - a.totalClaims);
  }, [districts, anomalies]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-forest-800 dark:text-emerald-300">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">State-Wise Decision Support & Progress Matrix</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Aggregated from underlying district telemetry and calculated anomaly queues
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {stateAggregates.length} Monitored States
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/70 dark:bg-slate-800/70">
              <th className="py-2.5 px-3">State / Jurisdiction</th>
              <th className="py-2.5 px-3">Districts</th>
              <th className="py-2.5 px-3">Claims (Total)</th>
              <th className="py-2.5 px-3">Titling Progress</th>
              <th className="py-2.5 px-3">Approval Rate</th>
              <th className="py-2.5 px-3">Avg Latency</th>
              <th className="py-2.5 px-3">Detected Anomalies</th>
              <th className="py-2.5 px-3">State Risk</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {stateAggregates.map((item) => (
              <tr key={item.state} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                  {item.state}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono">
                  {item.districtsCount}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatNumber(item.totalClaims)}
                </td>
                <td className="py-3 px-3 min-w-[140px]">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{formatNumber(item.approvedClaims)} patta</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">{formatNumber(item.pendingClaims)} pend</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.approvedClaims / item.totalClaims) * 100}%` }}
                      className="bg-emerald-600 h-full"
                    />
                    <div
                      style={{ width: `${(item.pendingClaims / item.totalClaims) * 100}%` }}
                      className="bg-amber-500 h-full"
                    />
                    <div
                      style={{ width: `${(item.rejectedClaims / item.totalClaims) * 100}%` }}
                      className="bg-rose-500 h-full"
                    />
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{formatPercent(item.approvalRate)}</span>
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{item.avgProcessingDays}d</span>
                  </span>
                </td>
                <td className="py-3 px-3 font-mono">
                  {item.anomalyCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                      <AlertOctagon className="w-3 h-3" />
                      <span>{item.anomalyCount}</span>
                      {item.criticalAnomalyCount > 0 && (
                        <span className="text-[9px] text-rose-900 dark:text-rose-300 font-black">({item.criticalAnomalyCount} crit)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">None flagged</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <RiskBadge level={item.riskLevel} />
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to={`/districts?state=${encodeURIComponent(item.state)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:text-brand-dark dark:text-emerald-400 hover:underline"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
