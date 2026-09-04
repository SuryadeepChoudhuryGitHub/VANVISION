import React, { useState } from 'react';
import { Settings, Shield, Sliders, MapPin, Database, Bell, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);

  // Settings State
  const [maxProcessingDays, setMaxProcessingDays] = useState(90);
  const [landVarianceTolerance, setLandVarianceTolerance] = useState(10);
  const [autoFlagSpikes, setAutoFlagSpikes] = useState(true);
  const [mapBaseStyle, setMapBaseStyle] = useState('CartoDB Voyager (Official)');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">System Configuration & Administrative Thresholds</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            FRA Policy v2.4
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure statutory delay SLA boundaries, algorithmic anomaly tolerance margins, and GIS base references.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Statutory & SLA Tolerances */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Sliders className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-slate-900">Statutory SLA & Cadastral Threshold Tolerances</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Maximum Statutory Processing Time (Days)
              </label>
              <input
                type="number"
                value={maxProcessingDays}
                onChange={(e) => setMaxProcessingDays(Number(e.target.value))}
                min={30}
                max={365}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-forest-700 font-mono font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Claims exceeding this age are automatically escalated as "Processing Delay" anomalies.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Land Parcel Extent Variance Tolerance (%)
              </label>
              <input
                type="number"
                value={landVarianceTolerance}
                onChange={(e) => setLandVarianceTolerance(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-forest-700 font-mono font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Discrepancy percentage between FRC claimed extent and revenue records before flagging.
              </p>
            </div>

            <div className="col-span-full pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFlagSpikes}
                  onChange={(e) => setAutoFlagSpikes(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Automatic Submission Spike Detection (Statistical 3σ)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Triggers audit when 48-hour submission volume in a block exceeds normal velocity by 300%.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: GIS Base Layer Configuration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <MapPin className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-slate-900">GIS Cartography & Spatial Settings</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Default Base Tile Provider</label>
              <select
                value={mapBaseStyle}
                onChange={(e) => setMapBaseStyle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-forest-700 text-slate-900"
              >
                <option>CartoDB Voyager (Official Government Light)</option>
                <option>OpenStreetMap Standard Carto</option>
                <option>Survey of India Topographic Overlay (Simulated)</option>
                <option>ISFR Forest Canopy Density Layer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Integration Node Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Database className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-slate-900">System Integration & Connectivity Status</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">State Cadastral Data Engine</span>
                <span className="text-[11px] text-slate-500">Simulated dataset with 52 districts across 5 states</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Active (Mock Service)
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">National MoTA API Integration</span>
                <span className="text-[11px] text-slate-500">REST endpoint binding ready in src/services/api.ts</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                Ready for Phase 2
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings saved successfully</span>
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-850 hover:bg-forest-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
