import { RiskLevel } from './districts';

export type AnomalyType =
  | 'Processing Delay'
  | 'Land Record Mismatch'
  | 'Unusual Claim Area'
  | 'Submission Spike'
  | 'Duplicate-looking Record'
  | 'Statistical Outlier';

export type AnomalySeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AnomalyStatus = 'Open' | 'Under Investigation' | 'Resolved' | 'Dismissed';

export interface AnomalyEvidence {
  metric: string;
  claimedValue: string | number;
  expectedValue: string | number;
  unit?: string;
  delta?: string;
}

export interface Anomaly {
  id: string; // e.g. ANOM-2026-0812
  claimId: string;
  claimantName?: string;
  districtId: string;
  districtName: string;
  state: string;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  riskScore: number;
  riskLevel: RiskLevel;
  detectedDate: string;
  status: AnomalyStatus;
  explanation: string;
  evidence: AnomalyEvidence[];
  recommendedAction: string;
  assignedOfficer?: string;
}
