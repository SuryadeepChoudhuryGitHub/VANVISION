import React from 'react';
import { RiskLevel } from '../../types/districts';
import { AnomalySeverity } from '../../types/anomalies';
import { ClaimStatus, ClaimType } from '../../types/claims';
import { getRiskBadgeClasses, getSeverityBadgeClasses } from '../../utils/risk';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'dot';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 ${className}`}>
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel; showDot?: boolean; className?: string }> = ({
  level,
  showDot = true,
  className = '',
}) => {
  const styling = getRiskBadgeClasses(level);
  const labelMap: Record<RiskLevel, string> = {
    normal: 'Normal',
    attention: 'Attention',
    high: 'High Risk',
    critical: 'Critical',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${styling.bg} ${styling.border} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${styling.dot}`} />}
      {labelMap[level]}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AnomalySeverity; className?: string }> = ({
  severity,
  className = '',
}) => {
  const styling = getSeverityBadgeClasses(severity);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${styling.bg} ${styling.border} ${className}`}
    >
      {severity}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ClaimStatus; className?: string }> = ({ status, className = '' }) => {
  const styles: Record<ClaimStatus, string> = {
    Approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-800 border-amber-200',
    'Under Review': 'bg-blue-50 text-blue-800 border-blue-200',
    Rejected: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} ${className}`}
    >
      {status}
    </span>
  );
};

export const ClaimTypeBadge: React.FC<{ type: ClaimType; className?: string }> = ({ type, className = '' }) => {
  const labelMap: Record<ClaimType, { label: string; tooltip: string; style: string }> = {
    IFR: { label: 'IFR', tooltip: 'Individual Forest Rights (Sec 3(1)(a))', style: 'bg-teal-50 text-teal-800 border-teal-200' },
    CFR: { label: 'CFR', tooltip: 'Community Forest Rights', style: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    CFRR: { label: 'CFRR', tooltip: 'Community Forest Resource Rights (Sec 3(1)(i))', style: 'bg-purple-50 text-purple-800 border-purple-200' },
  };

  const item = labelMap[type];

  return (
    <span
      title={item.tooltip}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${item.style} ${className}`}
    >
      {item.label}
    </span>
  );
};
