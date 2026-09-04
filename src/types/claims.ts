import { RiskLevel } from './districts';

export type ClaimType = 'IFR' | 'CFR' | 'CFRR'; // Individual Forest Rights, Community Forest Rights, Community Forest Resource Rights
export type ClaimStatus = 'Approved' | 'Pending' | 'Rejected' | 'Under Review';
export type WorkflowStage = 'Gram Sabha Verification' | 'SDLC Scrutiny' | 'DLC Final Approval' | 'Title Conferred';

export interface LandDetails {
  claimedAreaHa: number;
  recordedAreaHa: number;
  discrepancyHa: number;
  surveyNumber?: string;
  compartmentNumber?: string;
  forestType: string;
}

export interface Claim {
  id: string; // e.g. FRA-MP-MAN-0194
  claimantName: string;
  claimantCategory: string; // e.g. Gond, Baiga, Santhal, Oraon
  spouseName?: string;
  claimType: ClaimType;
  state: string;
  districtId: string;
  districtName: string;
  block: string;
  gramPanchayat: string;
  village: string;
  submissionDate: string;
  processingDays: number;
  status: ClaimStatus;
  workflowStage: WorkflowStage;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  landDetails: LandDetails;
  flaggedAnomalyIds: string[];
  notes?: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
}
