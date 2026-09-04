import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string; className?: string }> = ({
  label = 'Loading intelligence telemetry...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-500 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-forest-700 mb-2" />
      <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-full"></div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-3">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-6 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};
