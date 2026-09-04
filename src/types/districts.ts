export type RiskLevel = 'normal' | 'attention' | 'high' | 'critical';

export interface DistrictGeo {
  lat: number;
  lng: number;
}

export interface District {
  id: string;
  name: string;
  state: string;
  coordinates: DistrictGeo;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  approvalRate: number; // percentage e.g. 71.2
  avgProcessingDays: number;
  activeAnomalies: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryIssue: string;
  dominantClaimType: 'IFR' | 'CFR' | 'CFRR';
  forestCoverSqKm: number;
  tribalPopulationPct: number;
  lastUpdated: string;
}
