export interface OverviewStats {
  totalClaims: number;
  totalClaimsTrend: number; // percentage change
  approvedClaims: number;
  approvalRate: number;
  pendingClaims: number;
  avgPendingDays: number;
  rejectedClaims: number;
  rejectionRate: number;
  activeAnomalies: number;
  criticalAnomalies: number;
  districtsMonitored: number;
  statesCovered: number;
  lastSyncTime: string;
}

export interface MonthlyTrend {
  month: string;
  submitted: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface AnomalySeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface RecentActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'anomaly' | 'sla' | 'approval' | 'report' | 'system';
  severity?: 'critical' | 'high' | 'medium' | 'info';
  targetId?: string; // claimId or districtId
  targetRoute?: string;
}
