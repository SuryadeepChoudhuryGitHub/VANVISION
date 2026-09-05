import React from 'react';
import { Shield, BarChart3, Clock, AlertOctagon } from 'lucide-react';

interface MapLayerControlProps {
  activeLayer: 'risk' | 'density' | 'pending' | 'anomalies';
  onLayerChange: (layer: 'risk' | 'density' | 'pending' | 'anomalies') => void;
}

export const MapLayerControl: React.FC<MapLayerControlProps> = ({
  activeLayer,
  onLayerChange,
}) => {
  const layers = [
    { id: 'risk', label: 'District Risk', icon: Shield, badge: 'Composite' },
    { id: 'density', label: 'Claim Density', icon: BarChart3, badge: 'Volume' },
    { id: 'pending', label: 'Pending Backlog', icon: Clock, badge: 'SLA' },
    { id: 'anomalies', label: 'Active Anomalies', icon: AlertOctagon, badge: 'Flags' },
  ] as const;

  return (
    <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-lg flex items-center gap-1 pointer-events-auto">
      <span className="hidden sm:inline-block px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-r border-slate-200">
        GIS Layer
      </span>
      {layers.map((layer) => {
        const Icon = layer.icon;
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            title={`Switch view to ${layer.label}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#0a2e1f] text-white shadow-sm ring-1 ring-emerald-600/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
};
