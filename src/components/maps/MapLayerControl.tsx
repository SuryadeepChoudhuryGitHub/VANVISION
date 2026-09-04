import React from 'react';
import { Shield, BarChart3, Clock, AlertOctagon } from 'lucide-react';

interface MapLayerControlProps {
  activeLayer: 'risk' | 'density' | 'pending' | 'anomalies';
  onLayerChange: (layer: 'risk' | 'density' | 'pending' | 'anomalies') => void;
}

export const MapLayerControl: React.FC<MapLayerControlProps> = ({ activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'risk', label: 'District Risk', icon: Shield },
    { id: 'density', label: 'Claim Density', icon: BarChart3 },
    { id: 'pending', label: 'Pending Backlog', icon: Clock },
    { id: 'anomalies', label: 'Active Anomalies', icon: AlertOctagon },
  ] as const;

  return (
    <div className="bg-white/95 backdrop-blur-xs p-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-1">
      {layers.map((layer) => {
        const Icon = layer.icon;
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-forest-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
};
