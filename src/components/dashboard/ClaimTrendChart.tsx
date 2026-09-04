import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyTrend } from '../../types/stats';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface ClaimTrendChartProps {
  data: MonthlyTrend[];
}

export const ClaimTrendChart: React.FC<ClaimTrendChartProps> = ({ data }) => {
  const [activeSeries, setActiveSeries] = useState<{
    submitted: boolean;
    approved: boolean;
    rejected: boolean;
  }>({
    submitted: true,
    approved: true,
    rejected: true,
  });

  const toggleSeries = (key: 'submitted' | 'approved' | 'rejected') => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-forest-800">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Claim Activity Trajectory</h3>
            <p className="text-[11px] text-slate-500">Monthly submissions, approvals, and rejections (2026)</p>
          </div>
        </div>

        {/* Series Filter Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => toggleSeries('submitted')}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeSeries.submitted
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Submitted
          </button>

          <button
            onClick={() => toggleSeries('approved')}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeSeries.approved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Approved
          </button>

          <button
            onClick={() => toggleSeries('rejected')}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeSeries.rejected
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Rejected
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            {activeSeries.submitted && (
              <Area
                type="monotone"
                dataKey="submitted"
                name="Submitted"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSubmitted)"
              />
            )}
            {activeSeries.approved && (
              <Area
                type="monotone"
                dataKey="approved"
                name="Approved"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApproved)"
              />
            )}
            {activeSeries.rejected && (
              <Area
                type="monotone"
                dataKey="rejected"
                name="Rejected"
                stroke="#dc2626"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRejected)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Title conversion velocity up +4.2% since Q1 special drive</span>
        </div>
        <span className="font-mono text-slate-400">Monthly Aggregation</span>
      </div>
    </div>
  );
};
