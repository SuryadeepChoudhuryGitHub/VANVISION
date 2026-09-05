import React from 'react';
import { ClaimsFilterState } from '../../types/filters';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { mockDistricts } from '../../data/mockDistricts';

interface ClaimFilterBarProps {
  filter: ClaimsFilterState;
  onChange: (filter: ClaimsFilterState) => void;
  onReset: () => void;
}

export const ClaimFilterBar: React.FC<ClaimFilterBarProps> = ({ filter, onChange, onReset }) => {
  const states = ['All', 'Madhya Pradesh', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Jharkhand'];
  const statuses = ['All', 'Approved', 'Pending', 'Under Review', 'Rejected'];
  const claimTypes = ['All', 'IFR', 'CFR', 'CFRR'];
  const riskLevels = ['All', 'critical', 'high', 'attention', 'normal'];

  const handleFieldChange = (field: keyof ClaimsFilterState, value: any) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            placeholder="Search by Claim ID (e.g. FRA-MP-MAN), Claimant Name, Village..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-forest-700 dark:focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-end md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Selectors Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* State */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            State
          </label>
          <select
            value={filter.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All States' : st}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            District
          </label>
          <select
            value={filter.districtId}
            onChange={(e) => handleFieldChange('districtId', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Districts</option>
            {mockDistricts
              .filter((d) => filter.state === 'All' || d.state === filter.state)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filter.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>

        {/* Claim Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Claim Type
          </label>
          <select
            value={filter.claimType}
            onChange={(e) => handleFieldChange('claimType', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {claimTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Rights Types' : t}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Risk Tier
          </label>
          <select
            value={filter.riskLevel}
            onChange={(e) => handleFieldChange('riskLevel', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200 capitalize"
          >
            {riskLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'All' ? 'All Risk Levels' : lvl}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
