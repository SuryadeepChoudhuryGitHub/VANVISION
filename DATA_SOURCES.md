# VANVISION — Data Provenance & Source Inventory

This document establishes the official data classification, provenance, and transparency inventory for **VANVISION** in strict accordance with the **PS-7 (AI-powered Decision Support System for Forest Rights Act Monitoring)** problem statement and hackathon anti-disqualification standards.

---

## 1. Compliance Statement

> **CRITICAL HONESTY NOTICE:**  
> All cadastral claim records, tribal applicant identities, district performance statistics, and procedural event timelines in the current version of VANVISION are **synthetic demonstration fixtures** generated specifically to model administrative workflows under the Forest Rights Act (FRA) 2006.  
>  
> VANVISION does **NOT** currently connect to production databases of the Ministry of Tribal Affairs (MoTA), state revenue department portals, or live Survey of India APIs. No synthetic data is represented as live, official, or government-verified.

---

## 2. Dataset Classification Taxonomy

Every displayed metric, geometry, flag, and report in VANVISION is classified into exactly one of five categories:

| Category | Definition | Status in VANVISION |
| :--- | :--- | :--- |
| **Public** | Open-access data sourced from public repositories with verifiable licenses. | CartoDB Voyager & OpenStreetMap basemap tiles under ODbL terms. |
| **Synthetic** | Artificially modeled demonstration data representing typical statutory records. | 52 district profiles, 50+ individual & community claim records. |
| **Derived** | System-calculated results computed deterministically by algorithmic engines. | Anomaly detection outputs (`anomalyEngine.ts`), state aggregate progress matrix, district composite risk scores. |
| **AI-Generated (Preview)** | Demonstrative cognitive synthesis and natural language explanations. | Pre-indexed heuristic explanations and query summaries in the AI Insights preview. |
| **Placeholder** | Static UI demonstration elements with mock triggers. | Report download triggers (PDF/GeoJSON template stubs). |

---

## 3. Comprehensive Data Provenance Inventory

| Dataset / Output | File / Service Location | Classification | User Visible? | Labeling Status | Evidence in Codebase | Source / Terms | Transformations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **District Cadastral Telemetry** | `src/data/mockDistricts.ts` | **Synthetic** | Yes (Overview, GIS Map, Districts) | Labeled as "Evaluation Model" | 52 districts across MP, Odisha, Jharkhand, Chhattisgarh, Maharashtra | Self-generated based on public ISFR 2021 & MoTA statistical bulletins | Coordinates approximated to district headquarters centroids; metrics modeled to reflect real-world variance. |
| **Cadastral Claim Dossiers** | `src/data/mockClaims.ts` | **Synthetic** | Yes (Claims, Map, Dossier Modals) | Labeled as "Recorded in Evaluation Registry" | Structured `Claim[]` objects with land extents, survey numbers, workflow stages | Self-generated mock claims | Formatted to simulate Gram Sabha, SDLC, and DLC workflow lifecycles under Section 3(1)(a)-(i). |
| **Detected Statutory Anomalies** | `src/utils/anomalyEngine.ts` | **Derived** | Yes (Anomalies Dashboard, Modals, Map) | Labeled as "Deterministic Engine Queue" | Dynamically computed via `detectAnomalies()` | Computed from `mockClaims.ts` and user-configured SLA / tolerance thresholds | Mathematical delta calculations: processing delay $> \text{SLA}$, land area variance $> \text{tolerance}\%$, statutory ceiling $> 4.0\text{ ha}$. |
| **State Progress Matrix** | `src/components/dashboard/StateProgressSummary.tsx` | **Derived** | Yes (Overview Dashboard) | Labeled as "Aggregated Telemetry" | Computed via `stateAggregates` memo | Dynamically calculated from `mockDistricts.ts` and active anomalies | Aggregated state totals for claims, conferral rate %, average latency days, and critical anomaly counters. |
| **Overview Executive KPIs** | `src/data/mockStats.ts` + `src/services/api.ts` | **Derived & Synthetic** | Yes (Overview Dashboard KPI cards) | Labeled as "Evaluation Environment" | Computed in `api.getOverviewStats()` | Baseline stats combined with live engine anomaly totals | Dynamic replacement of static anomaly totals with actual calculated counts from active engine configuration. |
| **Cartographic Basemap** | `src/components/maps/ForestGisMap.tsx` | **Public** | Yes (Map Canvas) | Correctly attributed to CARTO & OpenStreetMap | Leaflet `L.tileLayer` pointing to CartoDB Voyager raster tiles | CartoDB / CARTO, OpenStreetMap contributors | Raster map rendering; standard web Mercator EPSG:3857 projection. |
| **AI Copilot Synthesis** | `src/pages/AIInsightsPage.tsx` | **AI-Generated (Preview)** | Yes (AI Copilot Page) | Explicitly badged as "PREVIEW / DEMO MODEL" | Pre-formatted responses grounded in structured district metrics | Synthetic demonstration knowledge base | Heuristically grounded in simulated district telemetry; no fabricated claims or hallucinations. |
| **Statutory Report Exports** | `src/pages/ReportsPage.tsx` | **Placeholder** | Yes (Reports Center) | Labeled as "Standardized reporting template" | Download triggers with simulated file generation alerts | Self-contained UI templates | Simulates downloadable PDF and GeoJSON dossier compilation. |

---

## 4. Algorithmic Anomaly Grounding Rules

To eliminate the risk of hallucinated or fabricated anomaly flags:
1. **Zero Hardcoded Anomaly Queues**: The investigation queue is generated purely by running `detectAnomalies()` against the active claims dataset.
2. **Transparent Mathematical Telemetry**: Every anomaly displayed in the system retains an explainable proof object showing:
   - **Rule Triggered**: The exact policy rule evaluated (e.g., *Statutory Processing Delay SLA*, *Cadastral Land Extent Discrepancy*).
   - **Claimed Value**: The value present on the claim record.
   - **Expected / Baseline Value**: The statutory baseline or registry comparator.
   - **Difference / Excess**: The mathematically calculated variance.
   - **Threshold**: The active configuration threshold driving the decision.
   - **Status**: The resulting statutory breach classification.

---

## 5. Future Public Data Integration Roadmap (Phase 2)

When external datasets are connected in subsequent phases, each dataset will be documented prior to inclusion:

| Planned Source Agency | Intended Dataset | Proposed Integration Path | Required Provenance Verification |
| :--- | :--- | :--- | :--- |
| **Forest Survey of India (FSI)** | India State of Forest Report (ISFR) vector boundaries | GeoJSON boundary polygons in `public/data/districts.geojson` | Verify open-access terms and document survey publication year. |
| **Survey of India** | Open Series Map (OSM) administrative district boundary vectors | Leaflet vector polygon layer with district boundary snapping | Verify official NGI / SOI digital vector license terms. |
| **Bhuvan (ISRO)** | LULC (Land Use / Land Cover) forest canopy density rasters | WMS/WMTS tile overlay | Ingest via registered Bhuvan WMS endpoint with attribution. |
| **Ministry of Tribal Affairs (MoTA)** | National Monthly FRA Progress MIS tables | Backend REST ingestion service | Document gazette / monthly bulletin publication date and table number. |
