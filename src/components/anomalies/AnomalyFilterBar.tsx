import React from 'react';
import { AnomaliesFilterState } from '../../types/filters';
import { AnomalySeverity, AnomalyType } from '../../types/anomalies';
import { Search, RotateCcw } from 'lucide-react';
import { mockDistricts } from '../../data/mockDistricts';

interface AnomalyFilterBarProps {
  filter: AnomaliesFilterState;
  onChange: (filter: AnomaliesFilterState) => void;
  onReset: () => void;
}

export const AnomalyFilterBar: React.FC<AnomalyFilterBarProps> = ({ filter, onChange, onReset }) => {
  const severities: (AnomalySeverity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const anomalyTypes: (AnomalyType | 'All')[] = [
    'All',
    'Processing Delay',
    'Land Record Mismatch',
    'Unusual Claim Area',
    'Submission Spike',
    'Duplicate-looking Record',
    'Statistical Outlier',
  ];

  const handleFieldChange = (field: keyof AnomaliesFilterState, value: any) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            placeholder="Search anomaly ID, claim ID, district, keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-forest-700 dark:focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Severity */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Severity Filter
          </label>
          <select
            value={filter.severity}
            onChange={(e) => handleFieldChange('severity', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {severities.map((sev) => (
              <option key={sev} value={sev}>
                {sev === 'All' ? 'All Severities' : `${sev} Severity`}
              </option>
            ))}
          </select>
        </div>

        {/* Anomaly Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Anomaly Classification
          </label>
          <select
            value={filter.anomalyType}
            onChange={(e) => handleFieldChange('anomalyType', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {anomalyTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Types' : t}
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
            {mockDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
