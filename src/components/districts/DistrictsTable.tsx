import React, { useState } from 'react';
import { District } from '../../types/districts';
import { RiskBadge } from '../common/Badge';
import { formatNumber, formatPercent, formatDays } from '../../utils/formatting';
import { ArrowUpDown, ChevronRight, Search, Building2 } from 'lucide-react';

interface DistrictsTableProps {
  districts: District[];
  onSelectDistrict: (district: District) => void;
}

type SortField = 'name' | 'totalClaims' | 'approvalRate' | 'pendingClaims' | 'avgProcessingDays' | 'activeAnomalies' | 'riskScore';

export const DistrictsTable: React.FC<DistrictsTableProps> = ({ districts, onSelectDistrict }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

  const filtered = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase()) ||
      d.primaryIssue.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortField === 'name') {
      diff = a.name.localeCompare(b.name);
    } else {
      diff = (a[sortField] as number) - (b[sortField] as number);
    }
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
      {/* Search & Counter */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter districts by name, state, or issue..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-[11px] self-end sm:self-auto">
          Monitored Districts: <b className="text-slate-800 dark:text-slate-200">{sorted.length}</b> • Click headers to sort
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>District & State</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('totalClaims')}>
                <div className="flex items-center gap-1">
                  <span>Total Claims</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('approvalRate')}>
                <div className="flex items-center gap-1">
                  <span>Approval Rate</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('pendingClaims')}>
                <div className="flex items-center gap-1">
                  <span>Pending</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('avgProcessingDays')}>
                <div className="flex items-center gap-1">
                  <span>Avg Duration</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('activeAnomalies')}>
                <div className="flex items-center gap-1">
                  <span>Active Anomalies</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {sorted.map((dist) => (
              <tr
                key={dist.id}
                onClick={() => onSelectDistrict(dist)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-forest-800 dark:group-hover:text-emerald-400 transition-colors">
                    {dist.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{dist.state}</div>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatNumber(dist.totalClaims)}
                </td>

                <td className="py-3 px-4 font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatPercent(dist.approvalRate)}
                </td>

                <td className="py-3 px-4 font-mono text-amber-800 dark:text-amber-400 font-semibold">
                  {formatNumber(dist.pendingClaims)}
                </td>

                <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                  {formatDays(dist.avgProcessingDays)}
                </td>

                <td className="py-3 px-4 font-mono font-bold text-rose-700 dark:text-rose-400">
                  {dist.activeAnomalies}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={dist.riskLevel} />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {dist.riskScore}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDistrict(dist);
                    }}
                    className="p-1.5 text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 hover:bg-forest-50 dark:hover:bg-emerald-950/50 rounded-md font-semibold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
