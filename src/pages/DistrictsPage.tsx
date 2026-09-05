import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { District } from '../types/districts';
import { DistrictsTable } from '../components/districts/DistrictsTable';
import { DistrictDetailView } from '../components/districts/DistrictDetailView';
import { LoadingSpinner } from '../components/common/LoadingState';
import { Building2, Layers, Download } from 'lucide-react';

export const DistrictsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getDistricts();
        setDistricts(data);

        // Check if query param `selected` is present
        const selId = searchParams.get('selected');
        if (selId) {
          const match = data.find((d) => d.id === selId || d.name.toLowerCase() === selId.toLowerCase());
          if (match) setSelectedDistrict(match);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  const handleSelect = (dist: District) => {
    setSelectedDistrict(dist);
    setSearchParams({ selected: dist.id });
  };

  const handleBack = () => {
    setSelectedDistrict(null);
    setSearchParams({});
  };

  return (
    <div className="space-y-5">
      {!selectedDistrict && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">District Implementation & Risk Monitoring</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 dark:bg-emerald-950 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-emerald-800">
                52 Monitored Districts
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comparative administrative metrics, title clearance velocity, and composite risk scoring across forest divisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Simulated: Exporting district performance matrix in CSV format.')}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Export Summary (CSV)</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Compiling District Intelligence..." className="h-64" />
      ) : selectedDistrict ? (
        <DistrictDetailView district={selectedDistrict} onBack={handleBack} />
      ) : (
        <DistrictsTable districts={districts} onSelectDistrict={handleSelect} />
      )}
    </div>
  );
};
