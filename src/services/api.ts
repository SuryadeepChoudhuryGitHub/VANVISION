import { District } from '../types/districts';
import { Claim } from '../types/claims';
import { Anomaly } from '../types/anomalies';
import { OverviewStats, MonthlyTrend, AnomalySeverityBreakdown, RecentActivityItem } from '../types/stats';
import { ClaimsFilterState, AnomaliesFilterState } from '../types/filters';
import { mockDistricts } from '../data/mockDistricts';
import { mockClaims } from '../data/mockClaims';
import { mockAnomalies } from '../data/mockAnomalies';
import { mockOverviewStats, mockMonthlyTrends, mockAnomalyBreakdown, mockRecentActivity } from '../data/mockStats';

export const api = {
  async getOverviewStats(): Promise<OverviewStats> {
    return Promise.resolve({ ...mockOverviewStats });
  },

  async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    return Promise.resolve([...mockMonthlyTrends]);
  },

  async getAnomalyBreakdown(): Promise<AnomalySeverityBreakdown> {
    return Promise.resolve({ ...mockAnomalyBreakdown });
  },

  async getRecentActivity(): Promise<RecentActivityItem[]> {
    return Promise.resolve([...mockRecentActivity]);
  },

  async getDistricts(filter?: { state?: string; search?: string; riskLevel?: string }): Promise<District[]> {
    let result = [...mockDistricts];
    if (filter?.state && filter.state !== 'All') {
      result = result.filter(d => d.state.toLowerCase() === filter.state?.toLowerCase());
    }
    if (filter?.riskLevel && filter.riskLevel !== 'All') {
      result = result.filter(d => d.riskLevel === filter.riskLevel);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.primaryIssue.toLowerCase().includes(q));
    }
    return Promise.resolve(result);
  },

  async getDistrictById(id: string): Promise<District | undefined> {
    const found = mockDistricts.find(d => d.id === id || d.name.toLowerCase() === id.toLowerCase());
    return Promise.resolve(found);
  },

  async getClaims(
    filter?: Partial<ClaimsFilterState>,
    page = 1,
    pageSize = 10
  ): Promise<{ claims: Claim[]; total: number; page: number; totalPages: number }> {
    let result = [...mockClaims];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.claimantName.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.districtName.toLowerCase().includes(q) ||
          c.block.toLowerCase().includes(q)
      );
    }

    if (filter?.state && filter.state !== 'All') {
      result = result.filter(c => c.state.toLowerCase() === filter.state?.toLowerCase());
    }

    if (filter?.districtId && filter.districtId !== 'All') {
      result = result.filter(c => c.districtId === filter.districtId);
    }

    if (filter?.status && filter.status !== 'All') {
      result = result.filter(c => c.status === filter.status);
    }

    if (filter?.claimType && filter.claimType !== 'All') {
      result = result.filter(c => c.claimType === filter.claimType);
    }

    if (filter?.riskLevel && filter.riskLevel !== 'All') {
      result = result.filter(c => c.riskLevel === filter.riskLevel);
    }

    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startIdx = (page - 1) * pageSize;
    const pagedClaims = result.slice(startIdx, startIdx + pageSize);

    return Promise.resolve({
      claims: pagedClaims,
      total,
      page,
      totalPages,
    });
  },

  async getClaimById(id: string): Promise<Claim | undefined> {
    const found = mockClaims.find(c => c.id === id);
    return Promise.resolve(found);
  },

  async getAnomalies(filter?: Partial<AnomaliesFilterState>): Promise<Anomaly[]> {
    let result = [...mockAnomalies];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        a =>
          a.id.toLowerCase().includes(q) ||
          a.claimId.toLowerCase().includes(q) ||
          a.districtName.toLowerCase().includes(q) ||
          (a.claimantName && a.claimantName.toLowerCase().includes(q)) ||
          a.explanation.toLowerCase().includes(q)
      );
    }

    if (filter?.severity && filter.severity !== 'All') {
      result = result.filter(a => a.severity === filter.severity);
    }

    if (filter?.anomalyType && filter.anomalyType !== 'All') {
      result = result.filter(a => a.anomalyType === filter.anomalyType);
    }

    if (filter?.districtId && filter.districtId !== 'All') {
      result = result.filter(a => a.districtId === filter.districtId);
    }

    return Promise.resolve(result);
  },

  async getAnomalyById(id: string): Promise<Anomaly | undefined> {
    const found = mockAnomalies.find(a => a.id === id);
    return Promise.resolve(found);
  },
};
