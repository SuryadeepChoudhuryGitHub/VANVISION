import { RiskLevel } from '../types/districts';
import { AnomalySeverity } from '../types/anomalies';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'attention';
  return 'normal';
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High Risk';
    case 'attention':
      return 'Attention';
    case 'normal':
      return 'Normal';
  }
}

export function getRiskBadgeClasses(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-red-50 text-red-700',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
      };
    case 'high':
      return {
        bg: 'bg-orange-50 text-orange-700',
        text: 'text-orange-700',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'attention':
      return {
        bg: 'bg-amber-50 text-amber-800',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'normal':
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
  }
}

export function getRiskColorHex(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return '#dc2626'; // red-600
    case 'high':
      return '#ea580c'; // orange-600
    case 'attention':
      return '#d97706'; // amber-600
    case 'normal':
      return '#16a34a'; // emerald-600
  }
}

export function getSeverityBadgeClasses(severity: AnomalySeverity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-rose-50 text-rose-700',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'High':
      return {
        bg: 'bg-orange-50 text-orange-700',
        text: 'text-orange-700',
        border: 'border-orange-200',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'Low':
      return {
        bg: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}
