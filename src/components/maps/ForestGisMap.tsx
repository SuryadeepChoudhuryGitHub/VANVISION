import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { District } from '../../types/districts';
import { MapLegend } from './MapLegend';
import { MapLayerControl } from './MapLayerControl';
import { getRiskColorHex } from '../../utils/risk';
import { Maximize2, RotateCcw } from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Central/Eastern India tribal forest heartland
      const map = L.map(mapContainerRef.current, {
        center: [21.8, 81.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 14,
        zoomControl: false,
      });

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add CartoDB Positron basemap tiles for clean government look
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Survey of India Reference',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

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

  // Update Markers when districts, activeLayer, or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    districts.forEach((dist) => {
      // Determine node color and size based on active layer
      let color = getRiskColorHex(dist.riskLevel);
      let radius = 14;

      if (activeLayer === 'density') {
        color = dist.totalClaims > 4000 ? '#065f46' : dist.totalClaims > 3000 ? '#059669' : '#34d399';
        radius = Math.max(10, Math.min(22, (dist.totalClaims / 4821) * 20));
      } else if (activeLayer === 'pending') {
        color = dist.pendingClaims > 800 ? '#d97706' : dist.pendingClaims > 500 ? '#f59e0b' : '#94a3b8';
        radius = Math.max(10, Math.min(22, (dist.pendingClaims / 1102) * 20));
      } else if (activeLayer === 'anomalies') {
        color = dist.activeAnomalies > 60 ? '#dc2626' : dist.activeAnomalies > 35 ? '#ea580c' : '#94a3b8';
        radius = Math.max(10, Math.min(22, (dist.activeAnomalies / 88) * 20));
      }

      const isSelected = selectedDistrict?.id === dist.id;

      // Create Custom SVG DivIcon
      const iconHtml = `
        <div style="
          width: ${radius * 2}px;
          height: ${radius * 2}px;
          background-color: ${color};
          border: ${isSelected ? '3px solid #0f172a' : '2px solid #ffffff'};
          border-radius: 50%;
          box-shadow: ${isSelected ? '0 0 0 4px rgba(15, 23, 42, 0.25), 0 4px 10px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.25)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          font-weight: 700;
          font-size: 10px;
          transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
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
        `<div class="text-xs font-semibold text-slate-900">${dist.name} <span class="font-normal text-slate-500">(${dist.state})</span></div>
         <div class="text-[11px] text-slate-600">Claims: <b>${dist.totalClaims.toLocaleString()}</b> • Risk: <b style="color: ${color}">${dist.riskScore}/100</b></div>`,
        {
          direction: 'top',
          offset: [0, -radius],
          opacity: 0.95,
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

  // Center on selected district when provided
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

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 flex flex-col`}>
      {/* Top Floating GIS Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {onLayerChange && (
            <div className="pointer-events-auto">
              <MapLayerControl activeLayer={activeLayer} onLayerChange={onLayerChange} />
            </div>
          )}

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleResetExtent}
              title="Reset Map Extent"
              className="px-2.5 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-forest-700" />
              <span>Reset Extent</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto max-w-xs">
        <MapLegend activeLayer={activeLayer} />
      </div>
    </div>
  );
};
