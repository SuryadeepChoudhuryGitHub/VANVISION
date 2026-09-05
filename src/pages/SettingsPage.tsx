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
  Info,
  UserCheck,
  Cpu,
  Key,
  EyeOff,
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
    'appearance' | 'profile' | 'ai' | 'dashboard' | 'gis' | 'anomalies' | 'accessibility' | 'notifications' | 'transparency' | 'system'
  >('appearance');
  const [savedNotification, setSavedNotification] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const triggerSaveNotification = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance & Accent', icon: Palette },
    { id: 'profile', label: 'Identity & Profile', icon: UserCheck },
    { id: 'ai', label: 'AI Copilot Setup', icon: Cpu },
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

  const isGeminiConfigured = Boolean(
    (settings.aiApiKey && settings.aiApiKey.trim()) ||
    (import.meta.env.VITE_GEMINI_API_KEY && (import.meta.env.VITE_GEMINI_API_KEY as string).trim())
  );

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Personalization & System Configuration</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              Evaluation Preferences
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize workstation appearance, brand accents, generic console identity, AI keys, dashboard components, and anomaly thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Preferences Saved</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Settings Body: Tab Selector + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Vertical Tab Selector */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1 h-fit transition-colors">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-6 transition-colors">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Workstation Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tailor themes, accent shades, layout density, and border contours to your visual comfort.
                </p>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as ThemeMode[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSettings({ theme: t })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.theme === t
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t} Theme
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Brand Accent Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {accentOptions.map((acc) => {
                    const isSelected = settings.accent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => updateSettings({ accent: acc.id })}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-primary bg-brand-light/40 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus shadow-xs font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${acc.bg} shrink-0 ring-1 ring-black/10`} />
                        <span className="truncate">{acc.label}</span>
                        {isSelected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                      </button>
                    );
                  })}
                </div>

                {/* Live Brand Accent Preview Strip */}
                <div className="p-3.5 rounded-xl border border-brand-border bg-brand-light/30 dark:bg-slate-800/80 space-y-2.5 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                      Live Brand Accent Preview
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      Active: {settings.accent.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-primary shadow-xs cursor-default">
                      Primary Action
                    </button>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-light text-brand-primary border border-brand-border">
                      Active Badge
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-brand-primary font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                      <span>Accent Propagated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Information Density</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['compact', 'comfortable', 'spacious'] as DensityMode[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => updateSettings({ density: d })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.density === d
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Interface Border Radius</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['sharp', 'standard', 'soft'] as BorderRadiusMode[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => updateSettings({ borderRadius: r })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.borderRadius === r
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r === 'sharp' ? 'Sharp (0px)' : r === 'standard' ? 'Standard (8-12px)' : 'Soft (16-20px)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Motion & Micro-interactions</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['full', 'reduced', 'off'] as AnimationMode[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateSettings({ animations: a })}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.animations === a
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {a === 'full' ? 'Full (Smooth)' : a === 'reduced' ? 'Reduced Motion' : 'Off (Static)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE & CONSOLE IDENTITY */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Application Profile & Session Identity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure the generic administrative display identity shown in the header and evaluation logs.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <b>Data Integrity Standard:</b> VANVISION is an evaluation prototype and does not implement production state authentication. Personal identities of real government officials are prohibited. This identity represents your administrative evaluation session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Display User Name
                  </label>
                  <input
                    type="text"
                    value={settings.userName}
                    onChange={(e) => updateSettings({ userName: e.target.value })}
                    placeholder="e.g. System Administrator"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-primary text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Defaults to &quot;System Administrator&quot;
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Console Role Label
                  </label>
                  <input
                    type="text"
                    value={settings.userRole}
                    onChange={(e) => updateSettings({ userRole: e.target.value })}
                    placeholder="e.g. FRA Monitoring Console"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-primary text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Defaults to &quot;FRA Monitoring Console&quot;
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Profile Avatar Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={settings.userInitials}
                    onChange={(e) => updateSettings({ userInitials: e.target.value.toUpperCase() })}
                    placeholder="e.g. SA"
                    className="w-28 px-3.5 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-primary text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      userName: 'System Administrator',
                      userRole: 'FRA Monitoring Console',
                      userInitials: 'SA',
                    })
                  }
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Reset Profile to Generic Default
                </button>
              </div>
            </div>
          )}

          {/* TAB: AI COPILOT INTEGRATION */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">AI Decision-Support Model Configuration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure Google Gemini 1.5 Flash API credentials or monitor deterministic fallback states.
                </p>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                isGeminiConfigured
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-forest-900 dark:text-emerald-200'
                  : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-bold block">
                      {isGeminiConfigured ? 'Live AI Model Connected (Gemini 1.5 Flash)' : 'Deterministic Rule Engine Active (Offline Mode)'}
                    </span>
                    <p className="text-[11px] mt-0.5 opacity-90">
                      {isGeminiConfigured
                        ? 'Natural language explanations will be generated live via Gemini 1.5 Flash, strictly grounded on active cadastral telemetry.'
                        : 'No API key configured. The copilot transparently renders mathematical deterministic explanations without hallucinations.'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                  isGeminiConfigured
                    ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100'
                    : 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100'
                }`}>
                  {isGeminiConfigured ? 'LIVE AI' : 'DETERMINISTIC'}
                </span>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Google Gemini API Key (VITE_GEMINI_API_KEY)
                </label>
                <div className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.aiApiKey}
                      onChange={(e) => updateSettings({ aiApiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full pl-8 pr-10 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-primary text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {settings.aiApiKey && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ aiApiKey: '' })}
                      className="px-2.5 py-2 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Stored securely in your local browser session or configured via <code>.env</code>. Never exposed in production builds.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Dashboard Personalization</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure default executive views, visible KPI cards, and section visibility.
                </p>
              </div>

              {/* Visible KPI Cards */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Visible KPI Metric Cards</label>
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
                          isChecked
                            ? 'bg-brand-light/30 dark:bg-slate-800 border-brand-border text-brand-primary'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
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
                          className="w-4 h-4 accent-brand rounded"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{k.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section Visibility */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Dashboard Section Visibility</label>

                <label className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                      Secondary Intelligence Strip (Adjudication Ratios & Statutory SLA Latency)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Renders adjudication distribution and statutory SLA compliance benchmarking bar
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showSecondaryMetrics}
                    onChange={(e) => updateSettings({ showSecondaryMetrics: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                      State Implementation Rollup Matrix
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Displays state-by-state progress metrics, title vesting %, and active anomaly counts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showStateMatrix}
                    onChange={(e) => updateSettings({ showStateMatrix: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                      Recent Procedural Activity Feed
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Shows timeline of recent committee events, verifications, and anomaly triggers
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showActivityFeed}
                    onChange={(e) => updateSettings({ showActivityFeed: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: GIS & CARTOGRAPHY */}
          {activeTab === 'gis' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">GIS Cartography & Spatial Layers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure default basemap providers, default active layer, and cartographic element displays.
                </p>
              </div>

              {/* Default Layer */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Default Starting GIS Layer</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'risk', label: 'District Risk' },
                    { id: 'density', label: 'Claim Density' },
                    { id: 'pending', label: 'SLA Backlog' },
                    { id: 'anomalies', label: 'Anomaly Density' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => updateSettings({ defaultMapLayer: l.id as 'risk' | 'density' | 'pending' | 'anomalies' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        settings.defaultMapLayer === l.id
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basemap Style */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Default Cartographic Basemap Provider</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Esri Light Gray Canvas (Clean)',
                    'OpenStreetMap Standard',
                    'Esri World Topographic',
                    'CartoDB Voyager (Legacy)',
                  ].map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSettings({ mapBaseStyle: style })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        settings.mapBaseStyle === style
                          ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800 text-brand-primary ring-2 ring-brand-focus font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{style}</span>
                      {settings.mapBaseStyle === style && (
                        <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANOMALY ENGINE */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Deterministic Anomaly Classifier Thresholds</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Adjust procedural SLA boundaries and land variance limits evaluated by <code>anomalyEngine.ts</code>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-slate-800 dark:text-slate-200">Statutory SLA Max Processing Lifecycle</span>
                    <span className="font-mono text-brand-primary">{settings.maxProcessingDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={180}
                    step={15}
                    value={settings.maxProcessingDays}
                    onChange={(e) => updateSettings({ maxProcessingDays: Number(e.target.value) })}
                    className="w-full accent-brand cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    <span>30 Days</span>
                    <span>90 Days (Standard SLA)</span>
                    <span>180 Days</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-slate-800 dark:text-slate-200">Land Extent Variance Tolerance</span>
                    <span className="font-mono text-brand-primary">±{settings.landVarianceTolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={settings.landVarianceTolerance}
                    onChange={(e) => updateSettings({ landVarianceTolerance: Number(e.target.value) })}
                    className="w-full accent-brand cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    <span>±5% (Strict)</span>
                    <span>±10% (Default)</span>
                    <span>±25% (Permissive)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACCESSIBILITY */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Accessibility & Visual Ergonomics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Options designed to improve readability, motion sensitivity, and contrast.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">Larger Typography (+8%)</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Scales up base interface font size for improved scanning</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.largerText}
                    onChange={(e) => updateSettings({ largerText: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">High-Contrast Borders</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Accentuates container borders and darkens text for higher visual clarity</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">Reduced Motion Mode</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Disables non-essential animated transitions and pulses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure which administrative events trigger in-app alerts and telemetry notices.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">Critical Anomaly Alerts</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Highlight high-priority statutory breaches requiring SLMC review</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyCriticalAnomalies}
                    onChange={(e) => updateSettings({ notifyCriticalAnomalies: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">High-Risk District Status Alerts</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Notify when a district enters Critical Risk composite tier (&gt; 80/100)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyHighRiskDistricts}
                    onChange={(e) => updateSettings({ notifyHighRiskDistricts: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">Delayed Claims SLA Warnings</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Alert when claims cross statutory processing limits</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyDelayedClaims}
                    onChange={(e) => updateSettings({ notifyDelayedClaims: e.target.checked })}
                    className="w-4 h-4 accent-brand rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 7: DATA TRANSPARENCY (PS-7 COMPLIANCE) */}
          {activeTab === 'transparency' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Data Provenance & PS-7 Honesty Registry</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    PS-7 Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official data classification disclosure in strict accordance with the hackathon anti-disqualification standards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Data Environment
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-1 block">Simulated Evaluation Fixture</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    52 modeled districts and cadastral claim profiles synthesized from ISFR 2021 bulletins.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    AI Insights Engine
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-1 block">Preview / Decision Copilot</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Heuristic natural language decision-support grounded in structured district metrics.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Active GIS Provider
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-1 block truncate">{settings.mapBaseStyle}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Open tile service with lawful attribution and zero unauthenticated watermarks.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs space-y-1.5 text-forest-950 dark:text-emerald-200">
                <span className="font-bold block">Compliance Guarantee:</span>
                <p className="leading-relaxed text-[11px] text-forest-900/90 dark:text-emerald-300/80">
                  VANVISION does not claim connection to live Ministry of Tribal Affairs (MoTA) production servers or state land revenue intranets. All metrics are computed deterministically via transparent mathematical rules.
                </p>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM ARCHITECTURE */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">System Architecture & Node Diagnostics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform build specifications, active modules, and framework versions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Platform Version</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">VANVISION v1.0.0-rc1</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Anomaly Classifier</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">Deterministic v1.2</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Geospatial Engine</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">Leaflet WebGIS 1.9.4</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Active Build Target</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">Production-Ready (Vite TS)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
