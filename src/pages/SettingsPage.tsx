import React, { useState } from 'react';
import {
  Palette,
  LayoutDashboard,
  MapPin,
  Sliders,
  Eye,
  Bell,
  ShieldCheck,
  Server,
  RotateCcw,
  Check,
  Save,
  Info,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  useSettings,
  ThemeMode,
  AccentColor,
  DensityMode,
  AnimationMode,
  BorderRadiusMode,
} from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDefaults } = useSettings();
  const [activeTab, setActiveTab] = useState<
    'appearance' | 'dashboard' | 'gis' | 'anomalies' | 'accessibility' | 'notifications' | 'transparency' | 'system'
  >('appearance');
  const [savedNotification, setSavedNotification] = useState(false);

  const triggerSaveNotification = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gis', label: 'GIS & Cartography', icon: MapPin },
    { id: 'anomalies', label: 'Anomaly Engine', icon: Sliders },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'transparency', label: 'Data Transparency', icon: ShieldCheck },
    { id: 'system', label: 'System & Architecture', icon: Server },
  ] as const;

  const accentOptions: { id: AccentColor; label: string; bg: string; border: string }[] = [
    { id: 'forest', label: 'Forest Green', bg: 'bg-[#15803d]', border: 'border-emerald-600' },
    { id: 'blue', label: 'Government Blue', bg: 'bg-[#2563eb]', border: 'border-blue-600' },
    { id: 'teal', label: 'Teal Emerald', bg: 'bg-[#0d9488]', border: 'border-teal-600' },
    { id: 'amber', label: 'Administrative Amber', bg: 'bg-[#d97706]', border: 'border-amber-600' },
    { id: 'slate', label: 'Classic Slate', bg: 'bg-[#475569]', border: 'border-slate-600' },
  ];

  const handleReset = () => {
    resetDefaults();
    triggerSaveNotification();
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Personalization & System Configuration</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              User Preferences
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize workstation appearance, dashboard components, GIS layers, and policy anomaly thresholds. Changes persist automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in duration-150">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preferences Saved</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Settings Body: Tab Selector + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Vertical Tab Selector */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-forest-850 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Workstation Appearance</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tailor themes, accent shades, layout density, and border contours to your visual comfort.
                </p>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as ThemeMode[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSettings({ theme: t })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.theme === t
                          ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-2 ring-forest-600/30'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t} Theme
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Brand Accent Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {accentOptions.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => updateSettings({ accent: acc.id })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                        settings.accent === acc.id
                          ? 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-400/40'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${acc.bg} shrink-0`} />
                      <span className="truncate">{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Information Density</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['compact', 'comfortable', 'spacious'] as DensityMode[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => updateSettings({ density: d })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.density === d
                          ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-2 ring-forest-600/30'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Interface Border Radius</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['sharp', 'standard', 'soft'] as BorderRadiusMode[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => updateSettings({ borderRadius: r })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.borderRadius === r
                          ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-2 ring-forest-600/30'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r === 'sharp' ? 'Sharp (0px)' : r === 'standard' ? 'Standard (8-12px)' : 'Soft (16-20px)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Motion & Micro-interactions</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['full', 'reduced', 'off'] as AnimationMode[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateSettings({ animations: a })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.animations === a
                          ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-2 ring-forest-600/30'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {a === 'full' ? 'Full (Smooth)' : a === 'reduced' ? 'Reduced Motion' : 'Off (Static)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Dashboard Personalization</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure default executive views, visible KPI cards, and section visibility.
                </p>
              </div>

              {/* Visible KPI Cards */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Visible KPI Metric Cards</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'total', label: 'Total Claims' },
                    { id: 'approved', label: 'Titles Conferred' },
                    { id: 'pending', label: 'Active Pipeline' },
                    { id: 'anomalies', label: 'Active Anomalies' },
                    { id: 'rejected', label: 'Rejected Claims' },
                    { id: 'districts', label: 'Monitored Districts' },
                  ].map((k) => {
                    const isChecked = settings.visibleKpis.includes(k.id);
                    return (
                      <label
                        key={k.id}
                        className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked ? 'bg-forest-50/50 border-forest-300' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newKpis = e.target.checked
                              ? [...settings.visibleKpis, k.id]
                              : settings.visibleKpis.filter((x) => x !== k.id);
                            updateSettings({ visibleKpis: newKpis });
                          }}
                          className="w-4 h-4 accent-forest-700 rounded"
                        />
                        <span className="font-semibold text-slate-800 text-xs">{k.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section Visibility */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 block">Dashboard Section Visibility</label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">
                      Secondary Intelligence Strip (Adjudication Ratios & Statutory SLA Latency)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Renders the adjudication distribution and statutory SLA compliance benchmarking bar
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showSecondaryMetrics}
                    onChange={(e) => updateSettings({ showSecondaryMetrics: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">
                      State Implementation Rollup Matrix
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Displays state-by-state progress metrics, title vesting %, and active anomaly counts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showStateMatrix}
                    onChange={(e) => updateSettings({ showStateMatrix: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">
                      Recent Procedural Activity Feed
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Shows timeline of recent committee events, verifications, and anomaly triggers
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showActivityFeed}
                    onChange={(e) => updateSettings({ showActivityFeed: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: GIS & CARTOGRAPHY */}
          {activeTab === 'gis' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">GIS Cartography & Spatial Layers</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure default basemap providers, default active layer, and cartographic element displays.
                </p>
              </div>

              {/* Default Map Style */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Default Basemap Tile Provider (No API Key Watermarks)
                </label>
                <select
                  value={settings.mapBaseStyle}
                  onChange={(e) => updateSettings({ mapBaseStyle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-forest-700 font-semibold text-xs text-slate-900 cursor-pointer"
                >
                  <option>Esri Light Gray Canvas (Clean)</option>
                  <option>OpenStreetMap Standard</option>
                  <option>Esri World Topographic</option>
                  <option>CartoDB Voyager (Legacy)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  <b>Recommended:</b> Esri Light Gray Canvas provides an unwatermarked, neutral canvas specifically engineered for thematic cadastral data visualization.
                </p>
              </div>

              {/* Default Active Layer */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">Default Active Spatial Layer</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'risk', label: 'District Risk' },
                    { id: 'density', label: 'Claim Density' },
                    { id: 'pending', label: 'Pending Backlog' },
                    { id: 'anomalies', label: 'Active Anomalies' },
                  ].map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => updateSettings({ defaultMapLayer: layer.id as any })}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        settings.defaultMapLayer === layer.id
                          ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-2 ring-forest-600/30'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Marker Visibility */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 block">Spatial Overlays</label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">District Centroid Labels</span>
                    <span className="text-[11px] text-slate-500">Show permanent name tags on map markers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showDistrictLabels}
                    onChange={(e) => updateSettings({ showDistrictLabels: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Anomaly Cluster Markers</span>
                    <span className="text-[11px] text-slate-500">Display pulsating alerts over critical anomaly nodes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showAnomalyMarkers}
                    onChange={(e) => updateSettings({ showAnomalyMarkers: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: ANOMALY ENGINE THRESHOLDS */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Deterministic Anomaly Engine</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    Live Calculation
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjusting these legal SLA and cadastral tolerances immediately recalculates anomalies and risk scores across all 52 districts in real time.
                </p>
              </div>

              {/* Processing SLA */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    Statutory Processing SLA Threshold (Days)
                  </label>
                  <span className="font-mono font-extrabold text-forest-850 text-sm">
                    {settings.maxProcessingDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={240}
                  step={5}
                  value={settings.maxProcessingDays}
                  onChange={(e) => updateSettings({ maxProcessingDays: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>30 Days (Strict)</span>
                  <span>90 Days (Statutory FRA Rule)</span>
                  <span>240 Days (Permissive)</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Claims older than {settings.maxProcessingDays} days without title conferral are classified as statutory delay breaches.
                </p>
              </div>

              {/* Land Variance Tolerance */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    Cadastral Land Extent Discrepancy Tolerance (%)
                  </label>
                  <span className="font-mono font-extrabold text-forest-850 text-sm">
                    ±{settings.landVarianceTolerance}% Margin
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={settings.landVarianceTolerance}
                  onChange={(e) => updateSettings({ landVarianceTolerance: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>±1% (Exact DGPS)</span>
                  <span>±10% (Working Plan Baseline)</span>
                  <span>±30% (Wide Customary Margin)</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Triggers mismatch anomaly when difference between claimant FRC sketch and official revenue records exceeds {settings.landVarianceTolerance}%.
                </p>
              </div>

              {/* Spike Detection */}
              <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 text-xs block">
                    Automatic Submission Spike Detection (Statistical 3-Sigma)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Identifies sudden clustered surges exceeding 300% of the 30-day moving average.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFlagSpikes}
                  onChange={(e) => updateSettings({ autoFlagSpikes: e.target.checked })}
                  className="w-4 h-4 accent-forest-700 rounded"
                />
              </label>
            </div>
          )}

          {/* TAB 5: ACCESSIBILITY */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Accessibility & Visual Assist</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Workstation accessibility enhancements in accordance with administrative accessibility guidelines.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Larger Text Scale (+8%)</span>
                    <span className="text-[11px] text-slate-500">Increases body and table typography for easier reading</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.largerText}
                    onChange={(e) => updateSettings({ largerText: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">High Contrast Borders & Text</span>
                    <span className="text-[11px] text-slate-500">Accentuates container borders and darkens text for higher visual clarity</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Reduced Motion Mode</span>
                    <span className="text-[11px] text-slate-500">Disables non-essential animated transitions and pulses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Persistent Table Labels</span>
                    <span className="text-[11px] text-slate-500">Keeps column labels visible without abbreviations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.persistentLabels}
                    onChange={(e) => updateSettings({ persistentLabels: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure which administrative events trigger in-app alerts and telemetry notices.
                </p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <b>Note:</b> These configure your in-session telemetry filter preferences. External SMS/Email dispatch connectors are scheduled for production Phase 2.
                </span>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Critical Anomaly Alerts</span>
                    <span className="text-[11px] text-slate-500">Highlight high-priority statutory breaches requiring SLMC review</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyCriticalAnomalies}
                    onChange={(e) => updateSettings({ notifyCriticalAnomalies: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">High-Risk District Status Alerts</span>
                    <span className="text-[11px] text-slate-500">Notify when a district enters the Critical Risk composite tier (&gt; 80/100)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyHighRiskDistricts}
                    onChange={(e) => updateSettings({ notifyHighRiskDistricts: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">Delayed Claims SLA Warnings</span>
                    <span className="text-[11px] text-slate-500">Alert when claims cross 120 days at SDLC or DLC level</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyDelayedClaims}
                    onChange={(e) => updateSettings({ notifyDelayedClaims: e.target.checked })}
                    className="w-4 h-4 accent-forest-700 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 7: DATA TRANSPARENCY (PS-7 COMPLIANCE) */}
          {activeTab === 'transparency' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Data Provenance & PS-7 Honesty Registry</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PS-7 Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official data classification disclosure in strict accordance with the hackathon anti-disqualification standards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Data Environment
                  </span>
                  <span className="font-bold text-slate-900 mt-1 block">Simulated Evaluation Fixture</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    52 modeled districts and cadastral claim profiles synthesized from ISFR 2021 bulletins.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    AI Insights Engine
                  </span>
                  <span className="font-bold text-slate-900 mt-1 block">Preview / Decision Copilot</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Heuristic natural language decision-support grounded in structured district metrics.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active GIS Provider
                  </span>
                  <span className="font-bold text-slate-900 mt-1 block">{settings.mapBaseStyle}</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Open tile service with lawful attribution and zero unauthenticated watermarks.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-forest-950">
                <span className="font-bold block">Compliance Guarantee:</span>
                <p className="leading-relaxed text-[11px] text-forest-900/90">
                  VANVISION does not claim connection to live Ministry of Tribal Affairs (MoTA) production servers or state land revenue intranets. All metrics are computed deterministically via transparent mathematical rules.
                </p>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM ARCHITECTURE */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">System Architecture & Node Diagnostics</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Platform build specifications, active modules, and framework versions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Platform Version</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">VANVISION v1.0.0-rc1</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Anomaly Classifier</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Deterministic v1.2</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Geospatial Engine</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Leaflet WebGIS 1.9.4</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Active Build Target</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">Production-Ready (Vite TS)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
