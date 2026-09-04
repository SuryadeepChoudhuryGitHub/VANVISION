import { OverviewStats, MonthlyTrend, AnomalySeverityBreakdown, RecentActivityItem } from '../types/stats';

export const mockOverviewStats: OverviewStats = {
  totalClaims: 45540,
  totalClaimsTrend: 3.8, // +3.8% MoM
  approvedClaims: 32821,
  approvalRate: 72.1,
  pendingClaims: 8420,
  avgPendingDays: 118,
  rejectedClaims: 4299,
  rejectionRate: 9.4,
  activeAnomalies: 1237,
  criticalAnomalies: 18,
  districtsMonitored: 52,
  statesCovered: 5,
  lastSyncTime: '2026-09-04T18:30:00+05:30',
};

export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', submitted: 4820, approved: 3510, rejected: 410, pending: 900 },
  { month: 'Feb', submitted: 5120, approved: 3840, rejected: 460, pending: 820 },
  { month: 'Mar', submitted: 6240, approved: 4420, rejected: 590, pending: 1230 },
  { month: 'Apr', submitted: 5890, approved: 4190, rejected: 520, pending: 1180 },
  { month: 'May', submitted: 5410, approved: 3950, rejected: 480, pending: 980 },
  { month: 'Jun', submitted: 6100, approved: 4310, rejected: 580, pending: 1210 },
  { month: 'Jul', submitted: 5980, approved: 4280, rejected: 550, pending: 1150 },
  { month: 'Aug', submitted: 5980, approved: 4321, rejected: 709, pending: 950 },
];

export const mockAnomalyBreakdown: AnomalySeverityBreakdown = {
  critical: 18,
  high: 43,
  medium: 82,
  low: 124,
  total: 267, // prioritized investigation queue
};

export const mockRecentActivity: RecentActivityItem[] = [
  {
    id: 'act-01',
    timestamp: '12 mins ago',
    title: 'Claim Flagged for Land-Record Mismatch',
    description: 'Claim FRA-MP-MAN-0194 in Mandla has a 4.2 Ha discrepancy between patta and satellite polygon.',
    type: 'anomaly',
    severity: 'critical',
    targetId: 'FRA-MP-MAN-0194',
    targetRoute: '/claims',
  },
  {
    id: 'act-02',
    timestamp: '38 mins ago',
    title: 'Processing Delay Threshold Exceeded',
    description: 'District Mandla crossed the 120-day SLA median threshold with 183 overdue claims at SDLC level.',
    type: 'sla',
    severity: 'high',
    targetId: 'dist-mp-man',
    targetRoute: '/districts',
  },
  {
    id: 'act-03',
    timestamp: '1 hour ago',
    title: 'New Spatial Anomaly Detected in Balaghat',
    description: 'Unusual boundary geometry overlap identified in Baihar forest range (Survey No. 412).',
    type: 'anomaly',
    severity: 'high',
    targetId: 'dist-mp-bal',
    targetRoute: '/anomalies',
  },
  {
    id: 'act-04',
    timestamp: '3 hours ago',
    title: 'Batch Title Approval in Nandurbar',
    description: 'DLC confirmed 142 Individual Forest Rights titles in Dhadgaon block.',
    type: 'approval',
    severity: 'info',
    targetId: 'dist-mh-nan',
    targetRoute: '/claims',
  },
  {
    id: 'act-05',
    timestamp: '5 hours ago',
    title: 'Monthly FRA Cadastral Audit Report Ready',
    description: 'Automated synthesis compiled for Ministry of Tribal Affairs (MoTA) oversight committee.',
    type: 'report',
    severity: 'info',
    targetId: 'rep-aug-2026',
    targetRoute: '/reports',
  },
];
