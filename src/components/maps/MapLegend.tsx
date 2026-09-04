import React from 'react';

export const MapLegend: React.FC<{ activeLayer?: string }> = ({ activeLayer = 'risk' }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-2">
      <div className="font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-1">
        <span>Map Legend</span>
        <span className="text-[10px] text-slate-500 uppercase font-mono">{activeLayer}</span>
      </div>

      {activeLayer === 'risk' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs"></span>
            <span className="text-slate-700">Critical Risk (Score 80–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-xs"></span>
            <span className="text-slate-700">High Risk (Score 65–79)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
            <span className="text-slate-700">Attention Needed (Score 40–64)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
            <span className="text-slate-700">Normal / Optimal (Score &lt; 40)</span>
          </div>
        </div>
      )}

      {activeLayer === 'density' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-800 opacity-80"></span>
            <span className="text-slate-700">&gt; 4,000 Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 opacity-80"></span>
            <span className="text-slate-700">3,000 – 4,000 Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-80"></span>
            <span className="text-slate-700">&lt; 3,000 Claims</span>
          </div>
        </div>
      )}

      {activeLayer === 'pending' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
            <span className="text-slate-700">&gt; 800 Backlogged Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-slate-700">400 – 800 Backlogged Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="text-slate-700">&lt; 400 Backlogged Claims</span>
          </div>
        </div>
      )}

      {activeLayer === 'anomalies' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="text-slate-700">&gt; 60 Active Anomalies</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span className="text-slate-700">30 – 60 Active Anomalies</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="text-slate-700">&lt; 30 Active Anomalies</span>
          </div>
        </div>
      )}

      <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-400">
        Click any district node for complete intelligence
      </div>
    </div>
  );
};
