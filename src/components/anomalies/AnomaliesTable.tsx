import React from 'react';
import { Anomaly } from '../../types/anomalies';
import { SeverityBadge, RiskBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatting';
import { AlertOctagon, Search, ChevronRight } from 'lucide-react';

interface AnomaliesTableProps {
  anomalies: Anomaly[];
  onSelectAnomaly: (anomaly: Anomaly) => void;
}

export const AnomaliesTable: React.FC<AnomaliesTableProps> = ({ anomalies, onSelectAnomaly }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 dark:text-slate-200">
          Prioritized Investigation Queue ({anomalies.length} Flagged)
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">Sorted by Risk Score (Descending)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4">Anomaly ID</th>
              <th className="py-3 px-4">Claim Reference</th>
              <th className="py-3 px-4">District & State</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Detected</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {anomalies.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <AlertOctagon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-sm text-slate-700 dark:text-slate-300">No anomalies match active criteria</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All monitored claims within normal parameters</p>
                </td>
              </tr>
            ) : (
              anomalies.map((anom) => {
                return (
                  <tr
                    key={anom.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectAnomaly(anom)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-forest-850 dark:text-emerald-400 group-hover:underline">{anom.id}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      <div>{anom.claimId}</div>
                      {anom.claimantName && (
                        <div className="text-[11px] font-sans text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {anom.claimantName}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{anom.districtName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{anom.state}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {anom.anomalyType}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(anom.detectedDate)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <SeverityBadge severity={anom.severity} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{anom.riskScore}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">/100</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          anom.status === 'Open'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                            : anom.status === 'Under Investigation'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {anom.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnomaly(anom);
                        }}
                        className="px-2.5 py-1.5 bg-forest-800 hover:bg-forest-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
