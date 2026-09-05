import React, { useState } from 'react';
import { FileBarChart2, Download, FileText, CheckCircle2, Clock, Shield, Layers, Filter } from 'lucide-react';

type ReportStatus = 'AVAILABLE' | 'GENERATED' | 'DEMO' | 'DRAFT';

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  purpose: string;
  status: ReportStatus;
  lastGenerated: string;
  cadence: string;
  formats: ('PDF' | 'CSV' | 'GeoJSON')[];
}

export const ReportsPage: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const reports: ReportTemplate[] = [
    {
      id: 'rep-01',
      title: 'State Performance & Titling Progress Dossier',
      category: 'Governance & Policy',
      purpose: 'Compiles state-by-state progress, vesting velocity, Gram Sabha resolution volumes, and statutory SLA ratios for review.',
      status: 'AVAILABLE',
      lastGenerated: 'Today at 08:30 AM',
      cadence: 'Weekly Compilation',
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'rep-02',
      title: 'District Risk & Anomaly Audit Matrix',
      category: 'Cadastral Oversight',
      purpose: 'Granular breakdown of composite risk scores across all 52 districts, detailing parcel area discrepancies and processing delays.',
      status: 'GENERATED',
      lastGenerated: 'Yesterday at 06:15 PM',
      cadence: 'Daily Automated Audit',
      formats: ['PDF', 'CSV', 'GeoJSON'],
    },
    {
      id: 'rep-03',
      title: 'Pending Claims SLA Overdue Register',
      category: 'Administrative Compliance',
      purpose: 'Identifies all pending claims exceeding the configured statutory SLA threshold across Gram Sabha, SDLC, and DLC tiers.',
      status: 'AVAILABLE',
      lastGenerated: '02 Sep 2026',
      cadence: 'Fortnightly',
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'rep-04',
      title: 'Community Forest Resource (CFR) Boundary GIS Vectors',
      category: 'Spatial Intelligence',
      purpose: 'Spatial geometry attributes and polygon centroids for approved and pending CFR & CFRR resource claims under Section 3(1)(i).',
      status: 'DEMO',
      lastGenerated: '01 Sep 2026',
      cadence: 'Monthly GIS Sync',
      formats: ['GeoJSON', 'CSV'],
    },
    {
      id: 'rep-05',
      title: 'Monthly FRA Implementation Inter-Agency Bulletin',
      category: 'Executive Summary',
      purpose: 'Structured briefing template for inter-ministerial coordination between MoTA and State Forest Departments.',
      status: 'DRAFT',
      lastGenerated: '31 Aug 2026',
      cadence: 'Monthly Template',
      formats: ['PDF'],
    },
  ];

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            AVAILABLE
          </span>
        );
      case 'GENERATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            GENERATED
          </span>
        );
      case 'DEMO':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            DEMO
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            DRAFT
          </span>
        );
    }
  };

  const categories = ['All', 'Governance & Policy', 'Cadastral Oversight', 'Administrative Compliance', 'Spatial Intelligence', 'Executive Summary'];

  const filteredReports = activeCategory === 'All'
    ? reports
    : reports.filter((r) => r.category === activeCategory);

  const handleDownload = (id: string, format: string) => {
    setDownloadingId(`${id}-${format}`);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Simulated Export: Downloaded template "${reports.find((r) => r.id === id)?.title}" in ${format} format.`);
    }, 900);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Administrative Reports & Data Exports</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 dark:bg-emerald-950 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-emerald-800">
              Reporting Center
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized evaluation report templates for compliance monitoring, spatial parcel exports, and statutory audits.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-forest-800 dark:bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 dark:text-emerald-300 bg-forest-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-forest-200 dark:border-emerald-800">
                  {rep.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{rep.cadence}</span>
                  {getStatusBadge(rep.status)}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-forest-800 dark:group-hover:text-emerald-400 transition-colors">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{rep.purpose}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                Compilation: {rep.lastGenerated}
              </span>

              <div className="flex items-center gap-1.5">
                {rep.formats.map((fmt) => {
                  const isDownloading = downloadingId === `${rep.id}-${fmt}`;
                  return (
                    <button
                      key={fmt}
                      disabled={isDownloading}
                      onClick={() => handleDownload(rep.id, fmt)}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-forest-850 dark:hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isDownloading ? 'Generating...' : fmt}</span>
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
