import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'forest' | 'blue' | 'teal' | 'amber' | 'slate';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';
export type AnimationMode = 'full' | 'reduced' | 'off';
export type BorderRadiusMode = 'sharp' | 'standard' | 'soft';

export interface SystemSettings {
  // Application Profile / Identity (Generic Evaluation Session)
  userName: string;
  userRole: string;
  userInitials: string;

  // AI Decision-Support Configuration
  aiApiKey: string;
  aiProvider: 'gemini' | 'offline_deterministic';

  // Appearance
  theme: ThemeMode;
  accent: AccentColor;
  density: DensityMode;
  animations: AnimationMode;
  borderRadius: BorderRadiusMode;

  // Dashboard Personalization
  visibleKpis: string[];
  showSecondaryMetrics: boolean;
  showStateMatrix: boolean;
  showActivityFeed: boolean;
  defaultDashboardState: string;

  // GIS Configuration
  defaultMapLayer: 'risk' | 'density' | 'pending' | 'anomalies';
  mapBaseStyle: string;
  showDistrictLabels: boolean;
  showAnomalyMarkers: boolean;
  showRiskIndicators: boolean;

  // Anomaly Engine Thresholds (Connected to deterministic calculations)
  maxProcessingDays: number;
  landVarianceTolerance: number;
  autoFlagSpikes: boolean;
  defaultSeverity: string;
  showResolvedAnomalies: boolean;
  expandedEvidenceByDefault: boolean;

  // Accessibility
  largerText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  persistentLabels: boolean;

  // Notification Preferences
  notifyCriticalAnomalies: boolean;
  notifyHighRiskDistricts: boolean;
  notifyDelayedClaims: boolean;
  notifySystemAlerts: boolean;
  emailAlerts: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  // Application Profile / Identity
  userName: 'System Administrator',
  userRole: 'FRA Monitoring Console',
  userInitials: 'SA',

  // AI Decision-Support Configuration
  aiApiKey: '',
  aiProvider: 'gemini',

  // Appearance
  theme: 'light',
  accent: 'forest',
  density: 'comfortable',
  animations: 'full',
  borderRadius: 'standard',

  // Dashboard
  visibleKpis: ['total', 'approved', 'pending', 'anomalies', 'rejected', 'districts'],
  showSecondaryMetrics: true,
  showStateMatrix: true,
  showActivityFeed: true,
  defaultDashboardState: 'All',

  // GIS (Default to clean, unwatermarked Esri Gray Canvas)
  defaultMapLayer: 'risk',
  mapBaseStyle: 'Esri Light Gray Canvas (Clean)',
  showDistrictLabels: true,
  showAnomalyMarkers: true,
  showRiskIndicators: true,

  // Anomaly Engine
  maxProcessingDays: 90,
  landVarianceTolerance: 10,
  autoFlagSpikes: true,
  defaultSeverity: 'All',
  showResolvedAnomalies: false,
  expandedEvidenceByDefault: false,

  // Accessibility
  largerText: false,
  highContrast: false,
  reducedMotion: false,
  persistentLabels: true,

  // Notifications
  notifyCriticalAnomalies: true,
  notifyHighRiskDistricts: true,
  notifyDelayedClaims: true,
  notifySystemAlerts: true,
  emailAlerts: true,
};

const STORAGE_KEY_V2 = 'vanvision_system_settings_v2';
const STORAGE_KEY_V1 = 'vanvision_system_settings_v1';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const savedV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (savedV2) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedV2) };
      }
      const savedV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (savedV1) {
        const parsed = JSON.parse(savedV1);
        return {
          ...DEFAULT_SETTINGS,
          maxProcessingDays: parsed.maxProcessingDays ?? DEFAULT_SETTINGS.maxProcessingDays,
          landVarianceTolerance: parsed.landVarianceTolerance ?? DEFAULT_SETTINGS.landVarianceTolerance,
          autoFlagSpikes: parsed.autoFlagSpikes ?? DEFAULT_SETTINGS.autoFlagSpikes,
          emailAlerts: parsed.emailAlerts ?? DEFAULT_SETTINGS.emailAlerts,
          mapBaseStyle: parsed.mapBaseStyle ?? DEFAULT_SETTINGS.mapBaseStyle,
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Apply visual styling classes to document root
  useEffect(() => {
    const root = document.documentElement;

    // Theme (light / dark)
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Accent colors
    ['theme-forest', 'theme-blue', 'theme-teal', 'theme-amber', 'theme-slate'].forEach((cls) =>
      root.classList.remove(cls)
    );
    root.classList.add(`theme-${settings.accent}`);

    // Density
    ['density-compact', 'density-comfortable', 'density-spacious'].forEach((cls) =>
      root.classList.remove(cls)
    );
    root.classList.add(`density-${settings.density}`);

    // Border Radius
    ['radius-sharp', 'radius-standard', 'radius-soft'].forEach((cls) => root.classList.remove(cls));
    root.classList.add(`radius-${settings.borderRadius}`);

    // Accessibility toggles
    if (settings.largerText) {
      root.classList.add('text-scale-large');
    } else {
      root.classList.remove('text-scale-large');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion || settings.animations === 'off') {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(settings));
      // Keep v1 compatible for legacy readers in api.ts
      localStorage.setItem(
        STORAGE_KEY_V1,
        JSON.stringify({
          maxProcessingDays: settings.maxProcessingDays,
          landVarianceTolerance: settings.landVarianceTolerance,
          autoFlagSpikes: settings.autoFlagSpikes,
          mapBaseStyle: settings.mapBaseStyle,
          emailAlerts: settings.emailAlerts,
        })
      );
    } catch {
      // Storage error
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      resetDefaults: () => {},
    };
  }
  return context;
};

