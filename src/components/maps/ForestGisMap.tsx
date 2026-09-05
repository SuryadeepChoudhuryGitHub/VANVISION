import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { District } from '../../types/districts';
import { MapLegend } from './MapLegend';
import { MapLayerControl } from './MapLayerControl';
import { getRiskColorHex } from '../../utils/risk';
import { RotateCcw, Map as MapIcon, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface ForestGisMapProps {
  districts: District[];
  selectedDistrict?: District | null;
  onSelectDistrict?: (district: District) => void;
  activeLayer?: 'risk' | 'density' | 'pending' | 'anomalies';
  onLayerChange?: (layer: 'risk' | 'density' | 'pending' | 'anomalies') => void;
  heightClass?: string;
  showControls?: boolean;
}

export const ForestGisMap: React.FC<ForestGisMapProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  activeLayer = 'risk',
  onLayerChange,
  heightClass = 'h-[520px]',
  showControls = true,
}) => {
  const { settings, updateSettings } = useSettings();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const basemapMenuRef = useRef<HTMLDivElement>(null);

  // Close basemap dropdown on outside click or Escape key
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (basemapMenuRef.current && !basemapMenuRef.current.contains(event.target as Node)) {
        setShowStyleMenu(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowStyleMenu(false);
      }
    }
    if (showStyleMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showStyleMenu]);

  // Basemap tile definitions
  const getTileConfig = (styleName: string) => {
    if (styleName.includes('OpenStreetMap')) {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c'],
        },
      };
    }
    if (styleName.includes('Topographic')) {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          attribution:
            'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ, &copy; OpenStreetMap contributors',
          maxZoom: 18,
        },
      };
    }
    if (styleName.includes('Voyager')) {
      return {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        options: {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      };
    }
    // Default: Clean Esri Light Gray Canvas (Zero Watermark, Highest Visual Quality for Thematic GIS)
    return {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      options: {
        attribution:
          'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 16,
      },
    };
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Central/Eastern India tribal forest heartland
      const map = L.map(mapContainerRef.current, {
        center: [21.8, 81.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 15,
        zoomControl: false,
      });

      // Position zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add active basemap tiles
      const tileConfig = getTileConfig(settings.mapBaseStyle);
      const tiles = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
      tileLayerRef.current = tiles;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Seamlessly update tile layer when mapBaseStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = getTileConfig(settings.mapBaseStyle);
    const newTiles = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    tileLayerRef.current = newTiles;
  }, [settings.mapBaseStyle]);

  // 3. Update District Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    districts.forEach((dist) => {
      let color = getRiskColorHex(dist.riskLevel);
      let radius = 14;

      if (activeLayer === 'density') {
        color =
          dist.totalClaims > 4000 ? '#065f46' : dist.totalClaims > 3000 ? '#059669' : '#34d399';
        radius = Math.max(11, Math.min(22, (dist.totalClaims / 4821) * 20));
      } else if (activeLayer === 'pending') {
        color =
          dist.pendingClaims > 800 ? '#d97706' : dist.pendingClaims > 500 ? '#f59e0b' : '#94a3b8';
        radius = Math.max(11, Math.min(22, (dist.pendingClaims / 1102) * 20));
      } else if (activeLayer === 'anomalies') {
        color =
          dist.activeAnomalies > 60 ? '#dc2626' : dist.activeAnomalies > 35 ? '#ea580c' : '#94a3b8';
        radius = Math.max(11, Math.min(22, (dist.activeAnomalies / 88) * 20));
      }

      const isSelected = selectedDistrict?.id === dist.id;

      // Custom SVG DivIcon
      const iconHtml = `
        <div style="
          width: ${radius * 2}px;
          height: ${radius * 2}px;
          background-color: ${color};
          border: ${isSelected ? '3px solid #064e3b' : '2px solid #ffffff'};
          border-radius: 50%;
          box-shadow: ${
            isSelected
              ? '0 0 0 5px rgba(5, 150, 105, 0.45), 0 8px 16px rgba(0,0,0,0.35)'
              : '0 2px 6px rgba(0,0,0,0.25)'
          };
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          font-weight: 800;
          font-family: monospace;
          font-size: 10px;
          transform: ${isSelected ? 'scale(1.28)' : 'scale(1)'};
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          ${dist.riskScore}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-district-marker',
        iconSize: [radius * 2, radius * 2],
        iconAnchor: [radius, radius],
      });

      const marker = L.marker([dist.coordinates.lat, dist.coordinates.lng], {
        icon: customIcon,
      });

      // Hover Tooltip
      marker.bindTooltip(
        `<div class="p-1 text-slate-800">
          <div class="text-xs font-bold">${dist.name} <span class="font-normal text-slate-500">(${dist.state})</span></div>
          <div class="text-[11px] text-slate-600 mt-0.5">Claims: <b>${dist.totalClaims.toLocaleString()}</b> • Risk: <b style="color: ${color}">${dist.riskScore}/100</b></div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -radius],
          opacity: 0.98,
        }
      );

      // On Click Handler
      marker.on('click', () => {
        if (onSelectDistrict) {
          onSelectDistrict(dist);
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [districts, activeLayer, selectedDistrict, onSelectDistrict]);

  // Center on selected district when changed
  useEffect(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng],
        8,
        { duration: 0.8 }
      );
    }
  }, [selectedDistrict]);

  const handleResetExtent = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([21.8, 81.5], 6, { duration: 0.6 });
    }
  };

  const basemapOptions = [
    'Esri Light Gray Canvas (Clean)',
    'OpenStreetMap Standard',
    'Esri World Topographic',
    'CartoDB Voyager (Legacy)',
  ];

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-900 flex flex-col`}
    >
      {/* Top Floating GIS Controls Toolbar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {onLayerChange && (
            <div className="pointer-events-auto">
              <MapLayerControl activeLayer={activeLayer} onLayerChange={onLayerChange} />
            </div>
          )}

          <div className="flex items-center gap-2 pointer-events-auto ml-auto">
            {/* Basemap Style Switcher Dropdown */}
            <div className="relative" ref={basemapMenuRef}>
              <button
                onClick={() => setShowStyleMenu(!showStyleMenu)}
                title="Select Basemap Provider"
                className="px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                <span className="hidden sm:inline">
                  {settings.mapBaseStyle.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showStyleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[1050] p-1.5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Basemap Provider
                  </div>
                  {basemapOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        updateSettings({ mapBaseStyle: opt });
                        setShowStyleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        settings.mapBaseStyle === opt
                          ? 'bg-forest-50 text-forest-850 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      {settings.mapBaseStyle === opt && (
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-700 dark:bg-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Extent */}
            <button
              onClick={handleResetExtent}
              title="Reset Map to National Center Extent"
              className="px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Reset Extent</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {/* Bottom Left Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[900] pointer-events-auto max-w-xs">
        <MapLegend activeLayer={activeLayer} />
      </div>
    </div>
  );
};
