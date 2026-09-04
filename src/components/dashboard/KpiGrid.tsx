import React from 'react';
import { FileText, CheckCircle2, Clock, XCircle, AlertTriangle, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { OverviewStats } from '../../types/stats';
import { formatNumber, formatPercent } from '../../utils/formatting';

interface KpiGridProps {
  stats: OverviewStats;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ stats }) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Claims Registered',
      value: formatNumber(stats.totalClaims),
      trend: '+3.8% vs last quarter',
      trendUp: true,
      subtext: 'Individual (IFR) & Community (CFR/CFRR)',
      icon: FileText,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'border-l-emerald-600',
    },
    {
      id: 'approved',
      label: 'Titles Conferred (Approved)',
      value: formatNumber(stats.approvedClaims),
      trend: `${formatPercent(stats.approvalRate)} titling rate`,
      trendUp: true,
      subtext: 'Vested under Section 3(1) of FRA 2006',
      icon: CheckCircle2,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
      accentColor: 'border-l-teal-600',
    },
    {
      id: 'pending',
      label: 'Claims in Active Pipeline',
      value: formatNumber(stats.pendingClaims),
      trend: `${stats.avgPendingDays} days avg. lifecycle`,
      trendUp: false,
      subtext: 'Across Gram Sabha, SDLC, and DLC scrutiny',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'border-l-amber-500',
    },
    {
      id: 'rejected',
      label: 'Rejected / Returned Claims',
      value: formatNumber(stats.rejectedClaims),
      trend: `${formatPercent(stats.rejectionRate)} rejection rate`,
      trendUp: false,
      subtext: 'Subject to statutory appeal provisions',
      icon: XCircle,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      accentColor: 'border-l-slate-400',
    },
    {
      id: 'anomalies',
      label: 'Active Anomalies Flagged',
      value: formatNumber(stats.activeAnomalies),
      trend: `${stats.criticalAnomalies} critical severity`,
      trendUp: false,
      subtext: 'Area mismatches, delays & spatial overlaps',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      accentColor: 'border-l-rose-600',
    },
    {
      id: 'districts',
      label: 'Districts Actively Monitored',
      value: formatNumber(stats.districtsMonitored),
      trend: `${stats.statesCovered} scheduled tribal states`,
      trendUp: true,
      subtext: 'Central & Eastern forest belts (MP, OD, CG, MH, JH)',
      icon: MapPin,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      accentColor: 'border-l-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white rounded-xl p-4 shadow-xs border border-slate-200 border-l-4 ${card.accentColor} hover:shadow-md transition-shadow flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-500 truncate" title={card.label}>
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-md border ${card.iconBg} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                {card.value}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                {card.trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="truncate">{card.trend}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1" title={card.subtext}>
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
