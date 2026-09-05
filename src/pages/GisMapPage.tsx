import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { District } from '../types/districts';
import { ForestGisMap } from '../components/maps/ForestGisMap';
import { RiskBadge, ClaimTypeBadge } from '../components/common/Badge';
import { formatNumber, formatPercent, formatDays } from '../utils/formatting';
import {
  RotateCcw,
  Layers,
  MapPin,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trees,
  Users,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const GisMapPage: React.FC = () => {
  const { settings } = useSettings();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeLayer, setActiveLayer] = useState<'risk' | 'density' | 'pending' | 'anomalies'>(
    settings.defaultMapLayer || 'risk'
  );

  // Filters
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    async function loadDistricts() {
      const data = await api.getDistricts();
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0]); // Mandla default
      }
    }
    loadDistricts();
  }, []);

  const states = ['All', 'Madhya Pradesh', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Jharkhand'];
  const riskTiers = ['All', 'critical', 'high', 'attention', 'normal'];
  const claimTypes = ['All', 'IFR', 'CFR', 'CFRR'];

  const filteredDistricts = districts.filter((d) => {
    if (selectedState !== 'All' && d.state !== selectedState) return false;
    if (selectedRisk !== 'All' && d.riskLevel !== selectedRisk) return false;
    if (selectedType !== 'All' && d.dominantClaimType !== selectedType) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedRisk('All');
    setSelectedType('All');
    setActiveLayer('risk');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar Strip */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 pr-2 border-r border-slate-200 dark:border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
            <span>GIS Filters</span>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All 5 States' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Risk Tier:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 font-medium text-slate-800 dark:text-slate-200 capitalize cursor-pointer"
            >
              {riskTiers.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Risk Levels' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Claim Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Dominant Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-forest-700 dark:focus:border-emerald-500 font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {claimTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Showing <b>{filteredDistricts.length}</b> of {districts.length} districts
          </span>
          <button
            onClick={handleResetFilters}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Interactive Map Canvas (2 cols) */}
        <div className="lg:col-span-2">
          <ForestGisMap
            districts={filteredDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            heightClass="h-[640px]"
          />
        </div>

        {/* Right: District Intelligence Dossier Panel (1 col) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between overflow-y-auto max-h-[640px]">
          {selectedDistrict ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    District Spatial Dossier
                  </span>
                  <RiskBadge level={selectedDistrict.riskLevel} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedDistrict.name}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDistrict.state}</span>
                  <span>•</span>
                  <span>Centroid Lat/Lng: {selectedDistrict.coordinates.lat.toFixed(2)}°, {selectedDistrict.coordinates.lng.toFixed(2)}°</span>
                </div>
              </div>

              {/* Primary Issue Alert */}
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Cadastral Hotspot Issue</span>
                </div>
                <p className="text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed pl-5">
                  {selectedDistrict.primaryIssue}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
                    Total Claims
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                    {formatNumber(selectedDistrict.totalClaims)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Dominant: {selectedDistrict.dominantClaimType}</span>
                </div>

                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase tracking-wider block">
                    Approval Rate
                  </span>
                  <span className="text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono mt-0.5 block">
                    {formatPercent(selectedDistrict.approvalRate)}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Titles Conferred</span>
                </div>

                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800">
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider block">
                    Pending Claims
                  </span>
                  <span className="text-lg font-black text-amber-800 dark:text-amber-300 font-mono mt-0.5 block">
                    {formatNumber(selectedDistrict.pendingClaims)}
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Under Review</span>
                </div>

                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl border border-rose-200/80 dark:border-rose-800">
                  <span className="text-[10px] text-rose-800 dark:text-rose-300 font-semibold uppercase tracking-wider block">
                    Active Anomalies
                  </span>
                  <span className="text-lg font-black text-rose-800 dark:text-rose-300 font-mono mt-0.5 block">
                    {selectedDistrict.activeAnomalies}
                  </span>
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Flags Detected</span>
                </div>
              </div>

              {/* Forest & Tribal Demographics */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Trees className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                    <span>Forest Cover</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatNumber(selectedDistrict.forestCoverSqKm)} km²
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Tribal Population</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedDistrict.tribalPopulationPct}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Avg Processing Lifecycle</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatDays(selectedDistrict.avgProcessingDays)}
                  </span>
                </div>
              </div>

              {/* Spatial Centroid Info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Cadastral Coordinate Centroid</span>
                </div>
                <div>Lat: {selectedDistrict.coordinates.lat.toFixed(4)}° N</div>
                <div>Lng: {selectedDistrict.coordinates.lng.toFixed(4)}° E</div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  to={`/claims?districtId=${selectedDistrict.id}`}
                  className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                  <span>Inspect All Claims in {selectedDistrict.name}</span>
                </Link>

                <Link
                  to={`/anomalies?districtId=${selectedDistrict.id}`}
                  className="w-full py-2 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Investigate District Anomalies ({selectedDistrict.activeAnomalies})</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <MapPin className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Select a district node on the GIS canvas</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Spatial intelligence and cadastral attributes will render here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
