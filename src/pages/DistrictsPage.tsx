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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">District Implementation & Risk Monitoring</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-800 border border-forest-200">
                52 Monitored Districts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comparative administrative metrics, title clearance velocity, and composite risk scoring across forest divisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Simulated: Exporting district performance matrix in CSV format.')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
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
