# VANVISION
**Forest Rights Intelligence & Decision Support System**
*PS-7: AI-powered Decision Support System for Forest Rights Act (FRA) Monitoring*
 
---

## Overview
**VANVISION** is an AI-powered government decision-support and GIS platform designed for administrative oversight of Forest Rights Act (FRA) 2006 implementation across states and districts. The platform visualizes spatial claim data, identifies statutory anomalies (processing delays, boundary mismatches, area outliers), and assists district collectors and State Level Monitoring Committees (SLMC) with actionable decision intelligence.

---

## Core Capabilities
- **National Executive Dashboard**: 6 high-level KPI cards, interactive Leaflet forest GIS map, priority districts alert panel, monthly claim activity trajectory (Recharts), and live cadastral activity feed.
- **Dedicated GIS Studio**: Dual-pane spatial workspace with layer switcher (*District Risk, Claim Density, Pending Backlog, Active Anomalies*) and real-time district spatial dossiers.
- **Claims Management**: Multi-faceted filtering and search with an interactive **Claim Detail Dossier** modal (workflow progression stepper, cadastral comparison with variance alerts, and anomaly tags).
- **Anomaly Investigation Console**: Prioritized investigation queue with **Anomaly Investigation Modals** highlighting *"Why was this flagged?"*, underlying parameter evidence, visual risk meters, and recommended procedural actions.
- **District Intelligence**: Multi-column sortable district rankings and in-depth **District Detail View** with AI-generated governance summaries.
- **AI Decision Intelligence Copilot (Preview)**: Multi-state executive synthesis, priority recommendations, and an interactive *"Ask VANVISION"* natural language query console.
- **Statutory Reports**: Downloadable report templates (State Performance, District Risk, Overdue SLA Register, CFR GeoJSON, Monthly MoTA Bulletin).
- **System Settings**: Configurable delay SLA tolerances, land extent variance thresholds, and GIS cartography settings.

---

## Tech Stack
- **Framework**: React 18, TypeScript, Vite
- **Styling & Design System**: Tailwind CSS (Government Forest Emeralds & Slate Neutral Palette)
- **Icons**: Lucide React
- **Visual Analytics**: Recharts
- **GIS Cartography**: Leaflet with CartoDB Voyager tiles
- **Routing**: React Router v6

---

## Running Locally

### Option 1: One-Click Launcher (Windows)
Double-click `run-dev.bat` in the repository root.

### Option 2: Command Line
```bash
# If running in a directory path with special characters, use the virtual drive mount:
subst V: "%cd%"
cd /d V:\

# Install dependencies (already installed in workspace)
npm install

# Start development server
npm run dev

# Or build production bundle
npm run build
npm run preview
```

Open [http://localhost:5173/](http://localhost:5173/) or [http://localhost:4173/](http://localhost:4173/) in your browser.
