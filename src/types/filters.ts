import { ClaimStatus, ClaimType } from './claims';
import { RiskLevel } from './districts';
import { AnomalySeverity, AnomalyType } from './anomalies';

export interface ClaimsFilterState {
  search: string;
  state: string;
  districtId: string;
  status: ClaimStatus | 'All';
  claimType: ClaimType | 'All';
  riskLevel: RiskLevel | 'All';
  dateRange: string;
}

export interface AnomaliesFilterState {
  search: string;
  severity: AnomalySeverity | 'All';
  anomalyType: AnomalyType | 'All';
  districtId: string;
  status: string | 'All';
}

export interface MapFilterState {
  state: string;
  districtId: string;
  claimStatus: ClaimStatus | 'All';
  riskLevel: RiskLevel | 'All';
  claimType: ClaimType | 'All';
  activeLayer: 'risk' | 'density' | 'pending' | 'anomalies';
}
