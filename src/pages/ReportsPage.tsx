import React, { useState } from 'react';
import { FileBarChart2, Download, FileText, CheckCircle2, Clock, ShieldCheck, Layers, FileSpreadsheet } from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  lastGenerated: string;
  cadence: string;
  formats: ('PDF' | 'CSV' | 'GeoJSON')[];
}

export const ReportsPage: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const reports: ReportTemplate[] = [
    {
      id: 'rep-01',
      title: 'State Performance & Titling Dossier',
      category: 'Governance & Policy',
      description: 'Comprehensive state-by-state progress metrics, vesting velocity, Gram Sabha resolution statistics, and SLA adherence ratios.',
      lastGenerated: 'Today at 08:30 AM',
      cadence: 'Weekly Compilation',
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'rep-02',
      title: 'District Risk & Anomaly Audit Matrix',
      category: 'Cadastral Oversight',
      description: 'In-depth breakdown of composite risk scores across all 52 districts, detailing area mismatches, duplicate profiles, and processing delays.',
      lastGenerated: 'Yesterday',
      cadence: 'Daily Automated Audit',
      formats: ['PDF', 'CSV', 'GeoJSON'],
    },
    {
      id: 'rep-03',
      title: 'Pending Claims SLA Overdue Register',
      category: 'Administrative Compliance',
      description: 'Granular list of claims exceeding 90 days across Gram Sabha, SDLC, and DLC jurisdictions for statutory notice dispatch.',
      lastGenerated: '02 Sep 2026',
      cadence: 'Fortnightly',
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'rep-04',
      title: 'Community Forest Rights (CFR) Boundary GIS Layer',
      category: 'Spatial Intelligence',
      description: 'Vector spatial boundaries and polygon centroids for approved and pending CFR & CFRR resource claims under Section 3(1)(i).',
      lastGenerated: '01 Sep 2026',
      cadence: 'Monthly GIS Sync',
      formats: ['GeoJSON', 'CSV'],
    },
    {
      id: 'rep-05',
      title: 'Monthly FRA Implementation Bulletin (MoTA)',
      category: 'Executive Summary',
      description: 'Official statistical summary compiled for the Ministry of Tribal Affairs (MoTA) oversight panel and Parliamentary consultative committees.',
      lastGenerated: '31 Aug 2026',
      cadence: 'Monthly Official',
      formats: ['PDF'],
    },
  ];

  const handleDownload = (id: string, format: string) => {
    setDownloadingId(`${id}-${format}`);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Simulated: Downloaded "${reports.find(r => r.id === id)?.title}" in ${format} format.`);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Statutory Reports & Data Exports</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-800 border border-forest-200">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized government templates for administrative compliance, GIS parcel exports, and statutory reviews.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                  {rep.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{rep.cadence}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{rep.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Updated: {rep.lastGenerated}</span>

              <div className="flex items-center gap-1.5">
                {rep.formats.map((fmt) => {
                  const isDownloading = downloadingId === `${rep.id}-${fmt}`;
                  return (
                    <button
                      key={fmt}
                      disabled={isDownloading}
                      onClick={() => handleDownload(rep.id, fmt)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-forest-850 hover:text-white text-slate-700 rounded-md font-semibold text-[11px] flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isDownloading ? 'Exporting...' : fmt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
