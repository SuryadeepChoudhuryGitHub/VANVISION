import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { District } from '../types/districts';
import { ForestGisMap } from '../components/maps/ForestGisMap';
import { RiskBadge, ClaimTypeBadge } from '../components/common/Badge';
import { formatNumber, formatPercent, formatDays, formatHectares } from '../utils/formatting';
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
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GisMapPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeLayer, setActiveLayer] = useState<'risk' | 'density' | 'pending' | 'anomalies'>('risk');

  // Filters
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    async function loadDistricts() {
      const data = await api.getDistricts();
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0]); // Mandla
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
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 pr-2 border-r border-slate-200">
            <Layers className="w-4 h-4 text-forest-700" />
            <span>GIS Controls</span>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-forest-700 font-medium text-slate-800"
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
            <span className="text-slate-500 font-medium">Risk Tier:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-forest-700 font-medium text-slate-800 capitalize"
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
            <span className="text-slate-500 font-medium">Dominant Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-forest-700 font-medium text-slate-800"
            >
              {claimTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
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

        {/* Right: District Intelligence Panel (1 col) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between overflow-y-auto max-h-[640px]">
          {selectedDistrict ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    District Spatial Dossier
                  </span>
                  <RiskBadge level={selectedDistrict.riskLevel} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedDistrict.name}</h3>
                <span className="text-xs text-slate-500 font-medium">{selectedDistrict.state}</span>
              </div>

              {/* Primary Issue Alert */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Cadastral Hotspot Issue</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  {selectedDistrict.primaryIssue}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Claims</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {formatNumber(selectedDistrict.totalClaims)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Approval Rate</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {formatPercent(selectedDistrict.approvalRate)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Pending Claims</span>
                  <span className="text-base font-black text-amber-700 font-mono">
                    {formatNumber(selectedDistrict.pendingClaims)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Active Anomalies</span>
                  <span className="text-base font-black text-rose-700 font-mono">
                    {selectedDistrict.activeAnomalies}
                  </span>
                </div>
              </div>

              {/* Forest & Tribal Demographics */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-forest-700" />
                    <span>Forest Cover</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatNumber(selectedDistrict.forestCoverSqKm)} km²
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tribal Population</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedDistrict.tribalPopulationPct}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Avg Processing Days</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatDays(selectedDistrict.avgProcessingDays)}
                  </span>
                </div>
              </div>

              {/* Geographic Bounds */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Spatial Centroid
                </div>
                <div>Lat: {selectedDistrict.coordinates.lat.toFixed(4)}° N</div>
                <div>Lng: {selectedDistrict.coordinates.lng.toFixed(4)}° E</div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  to={`/claims?districtId=${selectedDistrict.id}`}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-forest-700" />
                  <span>Inspect All Claims in {selectedDistrict.name}</span>
                </Link>

                <Link
                  to={`/anomalies?districtId=${selectedDistrict.id}`}
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Investigate District Anomalies</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Select a district node on the GIS canvas</p>
              <p className="text-[11px] text-slate-400 mt-1">Spatial intelligence and cadastral attributes will render here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
