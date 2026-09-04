import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OverviewStats, MonthlyTrend, AnomalySeverityBreakdown, RecentActivityItem } from '../types/stats';
import { District } from '../types/districts';
import { Anomaly } from '../types/anomalies';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { ForestGisMap } from '../components/maps/ForestGisMap';
import { PriorityDistricts } from '../components/dashboard/PriorityDistricts';
import { StateProgressSummary } from '../components/dashboard/StateProgressSummary';
import { ClaimTrendChart } from '../components/dashboard/ClaimTrendChart';
import { AnomalySummary } from '../components/dashboard/AnomalySummary';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { DistrictPopup } from '../components/maps/DistrictPopup';
import { LoadingSpinner } from '../components/common/LoadingState';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, MapPin, ChevronRight, X } from 'lucide-react';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [anomalyBreakdown, setAnomalyBreakdown] = useState<AnomalySeverityBreakdown | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeLayer, setActiveLayer] = useState<'risk' | 'density' | 'pending' | 'anomalies'>('risk');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const engineConfig = {
          maxProcessingDays: settings.maxProcessingDays,
          landVarianceTolerancePct: settings.landVarianceTolerance,
          autoFlagSpikes: settings.autoFlagSpikes,
        };

        const [s, t, ab, anoms, act, dists] = await Promise.all([
          api.getOverviewStats(engineConfig),
          api.getMonthlyTrends(),
          api.getAnomalyBreakdown(engineConfig),
          api.getAnomalies({}, engineConfig),
          api.getRecentActivity(),
          api.getDistricts(),
        ]);
        setStats(s);
        setTrends(t);
        setAnomalyBreakdown(ab);
        setAnomalies(anoms);
        setActivities(act);
        setDistricts(dists);

        // Default select Mandla as the highlighted sample district
        const mandla = dists.find((d) => d.name === 'Mandla');
        if (mandla) setSelectedDistrict(mandla);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [settings]);

  if (loading || !stats || !anomalyBreakdown) {
    return <LoadingSpinner label="Loading Executive Decision Intelligence..." className="h-96" />;
  }

  const handleInspectDistrict = (district: District) => {
    navigate(`/districts?selected=${district.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-[#09291c] via-[#0e3b29] to-[#124b35] rounded-xl p-5 text-white shadow-sm border border-emerald-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700/60">
              Decision Support Active
            </span>
            <span className="text-xs text-emerald-300/80">Forest Rights Act (FRA) Cadastral Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
            National Forest Rights Implementation Overview
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Consolidated spatial monitoring and anomaly detection across 52 scheduled districts. 
            Prioritizing title security for Scheduled Tribes (ST) and Other Traditional Forest Dwellers (OTFD).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <button
            onClick={() => navigate('/ai-insights')}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Briefing</span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Full GIS Studio</span>
          </button>
        </div>
      </div>

      {/* 1. 6 KPI Cards */}
      <KpiGrid stats={stats} />

      {/* 2. Main GIS Overview & Priority Districts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large GIS Map Panel (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-forest-800">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">National Forest Land Cadastral Map</h3>
                <p className="text-[11px] text-slate-500">
                  Interactive district risk choropleth and anomaly clusters
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Datum: WGS 84 / WebGIS Standard
            </span>
          </div>

          {/* Map Container */}
          <div className="relative flex-1">
            <ForestGisMap
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
              heightClass="h-[460px]"
            />

            {/* Floating District Intelligence Card on District Selection */}
            {selectedDistrict && (
              <div className="absolute top-4 right-4 z-20 shadow-xl rounded-xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="relative">
                  <button
                    onClick={() => setSelectedDistrict(null)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 bg-white/80 rounded-full z-30 transition-colors"
                    title="Close District Card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <DistrictPopup
                    district={selectedDistrict}
                    onInspect={handleInspectDistrict}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Priority Districts Panel (1 col) */}
        <div className="lg:col-span-1">
          <PriorityDistricts
            districts={districts}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            selectedDistrictId={selectedDistrict?.id}
          />
        </div>
      </div>

      {/* 4. State-Wise Implementation Matrix (Calculated Dynamic Rollups) */}
      <StateProgressSummary districts={districts} anomalies={anomalies} />

      {/* 5. Analytics Row: Claim Trend Chart + Anomaly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClaimTrendChart data={trends} />
        </div>
        <div className="lg:col-span-1">
          <AnomalySummary breakdown={anomalyBreakdown} />
        </div>
      </div>

      {/* 5. Recent Activity Feed */}
      <RecentActivity activities={activities} />
    </div>
  );
};
