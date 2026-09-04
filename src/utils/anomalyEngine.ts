import { Claim } from '../types/claims';
import { Anomaly, AnomalySeverity, MathematicalEvidence } from '../types/anomalies';
import { AnomalySeverityBreakdown } from '../types/stats';
import { RiskLevel } from '../types/districts';

export interface AnomalyEngineConfig {
  maxProcessingDays: number;
  landVarianceTolerancePct: number;
  autoFlagSpikes?: boolean;
}

export const DEFAULT_ANOMALY_CONFIG: AnomalyEngineConfig = {
  maxProcessingDays: 90,
  landVarianceTolerancePct: 10,
  autoFlagSpikes: true,
};

/**
 * Deterministic Anomaly Engine
 *
 * Rules:
 * 1. Statutory Processing Delay:
 *    Condition: claim.status !== 'Approved' && claim.processingDays > config.maxProcessingDays
 * 2. Cadastral Land-Area Mismatch:
 *    Condition: abs(claimedArea - recordedArea) / recordedArea * 100 > config.landVarianceTolerancePct
 * 3. Statutory IFR Ceiling Breach (FRA 2006 Section 4(6)):
 *    Condition: claim.claimType === 'IFR' && claim.landDetails.claimedAreaHa > 4.0
 */
export function detectAnomalies(
  claims: Claim[],
  config: AnomalyEngineConfig = DEFAULT_ANOMALY_CONFIG
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (const claim of claims) {
    // -------------------------------------------------------------------------
    // Rule 1: Processing Delay Detection (SLA Breach)
    // -------------------------------------------------------------------------
    if (claim.status !== 'Approved' && claim.processingDays > config.maxProcessingDays) {
      const excessDays = claim.processingDays - config.maxProcessingDays;

      // Deterministic severity
      let severity: AnomalySeverity = 'Low';
      if (excessDays >= 90 || claim.processingDays >= 220) {
        severity = 'Critical';
      } else if (excessDays >= 45 || claim.processingDays >= 160) {
        severity = 'High';
      } else if (excessDays >= 20) {
        severity = 'Medium';
      }

      // Deterministic risk score (50 - 99)
      const normalizedDelay = Math.min(1.5, excessDays / config.maxProcessingDays);
      const riskScore = Math.min(99, Math.round(50 + normalizedDelay * 33));
      const riskLevel: RiskLevel =
        riskScore >= 80 ? 'critical' : riskScore >= 65 ? 'high' : riskScore >= 45 ? 'attention' : 'normal';

      const mathEvidence: MathematicalEvidence = {
        ruleName: 'Statutory Processing Delay SLA',
        metricLabel: 'Claim Processing Duration',
        claimedValue: `${claim.processingDays} days`,
        expectedValue: `${config.maxProcessingDays} days (Statutory SLA)`,
        difference: `+${excessDays} days`,
        threshold: `${config.maxProcessingDays} days`,
        unit: 'days',
        statusText: 'Statutory SLA Threshold Exceeded',
      };

      anomalies.push({
        id: `ANOM-${claim.id.replace('FRA-', '')}-DLY`,
        claimId: claim.id,
        claimantName: claim.claimantName,
        districtId: claim.districtId,
        districtName: claim.districtName,
        state: claim.state,
        anomalyType: 'Processing Delay',
        severity,
        riskScore,
        riskLevel,
        detectedDate: '2026-09-04T10:00:00Z',
        status: 'Open',
        ruleTriggered: 'Statutory Processing Delay',
        explanation: `Claim processing duration of ${claim.processingDays} days at ${claim.workflowStage} stage exceeds the configured statutory SLA of ${config.maxProcessingDays} days by ${excessDays} days.`,
        evidence: [
          {
            metric: 'Claim Processing Time',
            claimedValue: claim.processingDays,
            expectedValue: config.maxProcessingDays,
            unit: 'Days',
            delta: `+${excessDays} Days`,
          },
          {
            metric: 'Allowed SLA Threshold',
            claimedValue: `${claim.processingDays} Days`,
            expectedValue: `${config.maxProcessingDays} Days`,
            delta: `${excessDays} Days Overdue`,
          },
          {
            metric: 'Current Administrative Stage',
            claimedValue: claim.workflowStage,
            expectedValue: 'Title Conferred',
            delta: 'Awaiting Action',
          },
        ],
        recommendedAction: `Issue statutory review reminder notice to ${
          claim.workflowStage.includes('SDLC')
            ? 'Sub-Divisional Level Committee (SDLC)'
            : 'District Level Committee (DLC)'
        } to expedite file verification.`,
        assignedOfficer: 'District Scrutiny Cell',
        mathematicalEvidence: mathEvidence,
      });
    }

    // -------------------------------------------------------------------------
    // Rule 2: Land-Area Mismatch Detection (Cadastral Variance)
    // -------------------------------------------------------------------------
    if (
      claim.landDetails &&
      claim.landDetails.claimedAreaHa > 0 &&
      claim.landDetails.recordedAreaHa > 0
    ) {
      const claimedArea = claim.landDetails.claimedAreaHa;
      const recordedArea = claim.landDetails.recordedAreaHa;
      const diffHa = Math.abs(claimedArea - recordedArea);
      const diffPct = (diffHa / recordedArea) * 100;

      if (diffPct > config.landVarianceTolerancePct) {
        let severity: AnomalySeverity = 'Low';
        if (diffPct >= 35 || diffHa >= 2.0) {
          severity = 'Critical';
        } else if (diffPct >= 20 || diffHa >= 1.0) {
          severity = 'High';
        } else if (diffPct >= config.landVarianceTolerancePct * 1.5) {
          severity = 'Medium';
        }

        const normalizedVariance = Math.min(1.0, diffPct / 100);
        const riskScore = Math.min(99, Math.round(55 + normalizedVariance * 40));
        const riskLevel: RiskLevel =
          riskScore >= 80 ? 'critical' : riskScore >= 65 ? 'high' : riskScore >= 45 ? 'attention' : 'normal';

        const mathEvidence: MathematicalEvidence = {
          ruleName: 'Cadastral Land Extent Discrepancy',
          metricLabel: 'Claimed vs Recorded Land Area',
          claimedValue: `${claimedArea.toFixed(2)} ha`,
          expectedValue: `${recordedArea.toFixed(2)} ha`,
          difference: `${diffHa.toFixed(2)} ha`,
          threshold: `${config.landVarianceTolerancePct}%`,
          tolerancePercentage: Number(diffPct.toFixed(2)),
          unit: 'ha',
          statusText: 'Cadastral Area Tolerance Exceeded',
        };

        anomalies.push({
          id: `ANOM-${claim.id.replace('FRA-', '')}-MIS`,
          claimId: claim.id,
          claimantName: claim.claimantName,
          districtId: claim.districtId,
          districtName: claim.districtName,
          state: claim.state,
          anomalyType: 'Land Record Mismatch',
          severity,
          riskScore,
          riskLevel,
          detectedDate: '2026-09-04T10:30:00Z',
          status: 'Open',
          ruleTriggered: 'Land Record Mismatch',
          explanation: `Claimed parcel extent (${claimedArea.toFixed(2)} Ha) diverges from recorded cadastral registry (${recordedArea.toFixed(2)} Ha) by ${diffPct.toFixed(1)}% (${diffHa.toFixed(2)} Ha), exceeding allowed tolerance of ${config.landVarianceTolerancePct}%.`,
          evidence: [
            {
              metric: 'Claimed Parcel Area',
              claimedValue: claimedArea.toFixed(2),
              expectedValue: recordedArea.toFixed(2),
              unit: 'Ha',
              delta: `${claimedArea > recordedArea ? '+' : '-'}${diffHa.toFixed(2)} Ha`,
            },
            {
              metric: 'Area Discrepancy %',
              claimedValue: `${diffPct.toFixed(1)}%`,
              expectedValue: `< ${config.landVarianceTolerancePct}%`,
              delta: `+${(diffPct - config.landVarianceTolerancePct).toFixed(1)}% Over Margin`,
            },
            {
              metric: 'Compartment / Survey Match',
              claimedValue: claim.landDetails.compartmentNumber || claim.landDetails.surveyNumber || 'Unsurveyed',
              expectedValue: 'Verified Boundary Map',
              delta: diffPct > 25 ? 'High Variance' : 'Moderate Variance',
            },
          ],
          recommendedAction:
            'Conduct joint GPS field demarcation between Revenue Inspector and Forest Department to reconcile cadastral records.',
          assignedOfficer: 'Cadastral Verification Unit',
          mathematicalEvidence: mathEvidence,
        });
      }
    }

    // -------------------------------------------------------------------------
    // Rule 3: Statutory Ceiling Outlier (FRA Section 4(6))
    // -------------------------------------------------------------------------
    if (
      claim.claimType === 'IFR' &&
      claim.landDetails &&
      claim.landDetails.claimedAreaHa > 4.0
    ) {
      const claimedArea = claim.landDetails.claimedAreaHa;
      const excessHa = claimedArea - 4.0;

      const mathEvidence: MathematicalEvidence = {
        ruleName: 'Statutory IFR Area Ceiling (FRA 2006 Sec 4(6))',
        metricLabel: 'Individual Forest Rights Land Extent',
        claimedValue: `${claimedArea.toFixed(2)} ha`,
        expectedValue: '4.00 ha (Statutory Limit)',
        difference: `+${excessHa.toFixed(2)} ha`,
        threshold: '4.00 ha',
        unit: 'ha',
        statusText: 'Statutory Legal Maximum Exceeded',
      };

      anomalies.push({
        id: `ANOM-${claim.id.replace('FRA-', '')}-CAP`,
        claimId: claim.id,
        claimantName: claim.claimantName,
        districtId: claim.districtId,
        districtName: claim.districtName,
        state: claim.state,
        anomalyType: 'Unusual Claim Area',
        severity: 'Critical',
        riskScore: 94,
        riskLevel: 'critical',
        detectedDate: '2026-09-04T11:00:00Z',
        status: 'Open',
        ruleTriggered: 'Statutory Area Ceiling (Sec 4(6))',
        explanation: `Individual Forest Rights (IFR) claim of ${claimedArea.toFixed(2)} Ha exceeds the non-negotiable statutory cap of 4.00 hectares (10 acres) specified under Section 4(6) of FRA 2006.`,
        evidence: [
          {
            metric: 'Claimed Parcel Area',
            claimedValue: claimedArea.toFixed(2),
            expectedValue: '4.00',
            unit: 'Ha',
            delta: `+${excessHa.toFixed(2)} Ha Excess`,
          },
          {
            metric: 'Statutory Ceiling (Sec 4(6))',
            claimedValue: `${claimedArea.toFixed(2)} Ha`,
            expectedValue: '4.00 Ha Max',
            delta: 'Statutory Violation',
          },
        ],
        recommendedAction:
          'Restrict claim parcel extent to statutory maximum of 4.00 Ha or verify whether part of the claim belongs under Community Forest Rights (CFR).',
        assignedOfficer: 'District Forest Officer',
        mathematicalEvidence: mathEvidence,
      });
    }
  }

  // Sort descending by risk score
  return anomalies.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Calculate dynamic severity breakdown from detected anomalies list
 */
export function calculateAnomalyBreakdown(anomalies: Anomaly[]): AnomalySeverityBreakdown {
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  for (const anom of anomalies) {
    if (anom.severity === 'Critical') critical++;
    else if (anom.severity === 'High') high++;
    else if (anom.severity === 'Medium') medium++;
    else low++;
  }

  return {
    critical,
    high,
    medium,
    low,
    total: anomalies.length,
  };
}
