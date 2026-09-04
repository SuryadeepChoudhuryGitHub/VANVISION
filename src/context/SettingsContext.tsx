import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SystemSettings {
  maxProcessingDays: number;
  landVarianceTolerance: number;
  autoFlagSpikes: boolean;
  mapBaseStyle: string;
  emailAlerts: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  maxProcessingDays: 90,
  landVarianceTolerance: 10,
  autoFlagSpikes: true,
  mapBaseStyle: 'CartoDB Voyager (Clean Light)',
  emailAlerts: true,
};

const STORAGE_KEY = 'vanvision_system_settings_v1';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage write errors
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
    // Fallback if rendered outside provider
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      resetDefaults: () => {},
    };
  }
  return context;
};
