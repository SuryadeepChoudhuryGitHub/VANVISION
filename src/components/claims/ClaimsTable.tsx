import React from 'react';
import { Claim } from '../../types/claims';
import { StatusBadge, ClaimTypeBadge, RiskBadge } from '../common/Badge';
import { formatDate, formatDays } from '../../utils/formatting';
import { Eye, ChevronLeft, ChevronRight, AlertTriangle, FileText } from 'lucide-react';

interface ClaimsTableProps {
  claims: Claim[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectClaim: (claim: Claim) => void;
}

export const ClaimsTable: React.FC<ClaimsTableProps> = ({
  claims,
  total,
  page,
  totalPages,
  onPageChange,
  onSelectClaim,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Table Top Counter */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Total Filtered Records:</span>
          <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-900 font-mono font-bold">
            {total.toLocaleString()}
          </span>
        </div>
        <span className="text-slate-500 text-[11px]">
          Showing page {page} of {totalPages}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <th className="py-3 px-4">Claim ID</th>
              <th className="py-3 px-4">Claimant / Community</th>
              <th className="py-3 px-4">District & Village</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Submission</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Risk Tier</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {claims.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-sm text-slate-700">No claims match the active filters</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria or reset filters</p>
                </td>
              </tr>
            ) : (
              claims.map((claim) => {
                const isDelayed = claim.processingDays > 120 && claim.status !== 'Approved';
                const hasAnomaly = claim.flaggedAnomalyIds.length > 0;

                return (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => onSelectClaim(claim)}
                  >
                    {/* Claim ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-forest-850 hover:underline">{claim.id}</span>
                        {hasAnomaly && (
                          <span
                            title="Flagged with active anomaly"
                            className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"
                          />
                        )}
                      </div>
                    </td>

                    {/* Claimant */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {claim.claimantName}
                      </div>
                      <div className="text-[11px] text-slate-500">{claim.claimantCategory}</div>
                    </td>

                    {/* District & Village */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{claim.districtName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {claim.village}, {claim.block}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <ClaimTypeBadge type={claim.claimType} />
                    </td>

                    {/* Submission */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(claim.submissionDate)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={claim.status} />
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isDelayed
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isDelayed && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {formatDays(claim.processingDays)}
                      </span>
                    </td>

                    {/* Risk Tier */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={claim.riskLevel} />
                        <span className="font-mono text-[11px] text-slate-500 font-semibold">
                          {claim.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClaim(claim);
                        }}
                        className="p-1.5 text-forest-700 hover:text-forest-900 hover:bg-forest-50 rounded-md transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Detailed Claim Dossier"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <div className="text-slate-500">
          Showing <b>{claims.length}</b> records on this page
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-semibold px-2 text-slate-800">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
