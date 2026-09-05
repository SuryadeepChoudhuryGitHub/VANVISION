import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Claim } from '../types/claims';
import { ClaimsFilterState } from '../types/filters';
import { ClaimFilterBar } from '../components/claims/ClaimFilterBar';
import { ClaimsTable } from '../components/claims/ClaimsTable';
import { ClaimDetailModal } from '../components/claims/ClaimDetailModal';
import { LoadingSpinner } from '../components/common/LoadingState';
import { FileText, Download, Plus } from 'lucide-react';

export const ClaimsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const initialFilter: ClaimsFilterState = {
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || 'All',
    districtId: searchParams.get('districtId') || 'All',
    status: (searchParams.get('status') as any) || 'All',
    claimType: (searchParams.get('claimType') as any) || 'All',
    riskLevel: (searchParams.get('riskLevel') as any) || 'All',
    dateRange: 'All',
  };

  const [filter, setFilter] = useState<ClaimsFilterState>(initialFilter);

  // Sync filters to query params and fetch
  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const res = await api.getClaims(filter, page, 10);
        setClaims(res.claims);
        setTotal(res.total);
        setTotalPages(res.totalPages);

        // If URL had a specific claim ID search and exact match exists, auto-open dossier
        if (filter.search && res.claims.length === 1 && res.claims[0].id.toLowerCase() === filter.search.toLowerCase()) {
          setSelectedClaim(res.claims[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, [filter, page]);

  const handleFilterChange = (newFilter: ClaimsFilterState) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleReset = () => {
    setFilter({
      search: '',
      state: 'All',
      districtId: 'All',
      status: 'All',
      claimType: 'All',
      riskLevel: 'All',
      dateRange: 'All',
    });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Forest Rights Claims Registry</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              National Cadastral Index
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and scrutinize individual and community forest rights claims across states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Simulated: Exporting filtered claims registry in CSV format.')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ClaimFilterBar filter={filter} onChange={handleFilterChange} onReset={handleReset} />

      {/* Claims Table */}
      {loading ? (
        <LoadingSpinner label="Querying Claims Database..." className="h-64" />
      ) : (
        <ClaimsTable
          claims={claims}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelectClaim={(claim) => setSelectedClaim(claim)}
        />
      )}

      {/* Detailed Claim Dossier Modal */}
      <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
};
