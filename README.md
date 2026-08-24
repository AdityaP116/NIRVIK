# NIRVIK — AI-Powered Criminal Network Intelligence Platform

<div align="center">
  <img src="public/favicon.svg" alt="NIRVIK Logo" width="80" height="80" />
  <h1>NIRVIK</h1>
  <p><b>AI-Powered Criminal Network Intelligence & Investigation Decision-Support Platform</b></p>
  <p><i>Architected & Developed by <b>Rishabh Shevde</b></i></p>

  <p>
    <img src="https://img.shields.io/badge/React-18%2F19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Cytoscape.js-3.x-f58220?style=flat-square" alt="Cytoscape.js" />
    <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet" />
    <img src="https://img.shields.io/badge/Status-Judge--Ready-success?style=flat-square" alt="Status" />
  </p>
</div>

---

## 📌 Executive Summary

**NIRVIK** is an advanced criminal network intelligence workstation engineered to assist law enforcement agencies, cyber crime branches, and state intelligence directorates in unraveling complex organized crime syndicates. 

Modern criminal syndicates operate across fragmented jurisdictions, utilizing layered shell corporations, rotating burner phones, and cross-border financial conduits. NIRVIK transforms disparate intelligence streams (First Information Reports, Call Detail Records, FIU wire transfers, and geospatial tower pings) into unified, interactive topological graphs and actionable decision-support dossiers.

---

## 👨‍💻 Engineering & Architecture by Rishabh

This repository represents an end-to-end, judge-ready frontend implementation designed and engineered by **Rishabh Shevde**, converting 13 multi-modal Stitch design specifications into a responsive, type-safe, interactive intelligence workstation.

### Key Engineering Milestones Achieved by Rishabh:

### 1. Unified 4-Color Intelligence Design System
- Engineered custom Tailwind CSS design tokens faithfully matching the official NIRVIK brand palette:
  - **Dark Navy (`#10232F` / `#263845`)**: Structural elevation, primary headers, sidebars, and high-contrast containers.
  - **Vibrant Orange (`#FD974E` / `#FF994F`)**: High-priority alert badges, bridge entity highlights, active graph selections, and AI confidence indicators.
  - **Slate Grey (`#C3C7CC` / `#BFC9D0`)**: Subtle panel borders, dividers, secondary metadata tags, and background grid lines.
  - **Light Canvas (`#F5FAFA` / `#EAEFEF`)**: Low-strain background canvas tailored for prolonged analytical work.
- Configured typography scale based on **Inter** and Google **Material Symbols Outlined** for standardized law enforcement workstation iconography.

---

### 2. High-Performance Interactive Graph Engine (Cytoscape.js)
- Implemented real interactive graph canvas (`src/components/graph/CytoscapeGraph.tsx`) with zero reliance on static images or mock SVGs.
- Supported multi-layout physics engines: **COSE Bilkent**, **Force-Directed (Concentric)**, and **Breadthfirst / Radial Tree**.
- Built dynamic filtering by entity type (`Person`, `Corporate Entity`, `Phone/IMSI`, `Bank Account`, `Vehicle/Asset`, `Location`, `Case`).
- Integrated a real-time **AI Confidence Threshold Slider** (0%–100%) that dynamically filters inferred edges based on underlying correlation scores.
- Implemented the **"Expand Intermediary Network"** feature that adds offshore corporate entities (*Gulf Horizon FZE*), secondary handlers (*Vikram R.*), and storage assets (*Warehouse Sector 4*) dynamically to the active graph.

---

### 3. Geospatial Intelligence Telemetry (Leaflet.js)
- Implemented real interactive mapping (`src/components/map/LeafletMap.tsx`) with custom pulsing CSS markers for active criminal activity hotspots.
- Mapped tactical cross-jurisdiction corridors connecting **Pune Sector 4 Logistics Hub**, **BKC Mumbai Front Corp HQ**, **XYZ Market Altercation Zone**, and **Goa Transit Checkpoints**.

---

### 4. Decoupled Service & Mock Data Layer
- Architected comprehensive TypeScript data models (`src/types/index.ts`) defining 14 core domain structures (`Case`, `Entity`, `GraphNode`, `GraphEdge`, `IntelligenceAlert`, `TimelineEvent`, `EvidenceItem`, `AuditEvent`, `DocumentIntelligenceItem`, etc.).
- Built a realistic synthetic data layer (`src/mock/`) providing rich, cross-referenced intelligence narratives for Operation Shadow (Case `2026-0142`) and its linked Hawala network (Case `2025-0891`).
- Abstracted all data operations behind modular asynchronous services in `src/services/` for seamless future backend integration.

---

### 5. Multi-Jurisdictional Workspace Suite (13 Completed Modules)

| # | Workspace Module | Route | Engineered Features by Rishabh |
|---|---|---|---|
| 1 | **Officer Authentication** | `/login` | Officer ID verification (`RAJ-4482`), security clearance badges, fast evaluator demo logins. |
| 2 | **Intelligence Dashboard** | `/dashboard` | Executive KPIs (142 Cases, 38 Signals, 17 Alerts, 4,286 Entities), Attention Required feed, Active Investigations table. |
| 3 | **Investigations Workspace** | `/investigations` | Status filtering (`Active`, `Closed`, `Review`), keyword search, case dossier cards. |
| 4 | **Case Intelligence Detail** | `/investigations/:caseId` | Case 2026-0142 synopsis, cross-case linkage visualization, AI signals, verified evidence table. |
| 5 | **Network Analysis** | `/network-analysis` | Fullscreen Cytoscape graph canvas, layout controls, entity filter sidebar, and Entity Inspector drawer. |
| 6 | **Target Entity Profile** | `/entities/:entityId` | Ramesh Kumar (UID-8842-A) profile, Centrality Score (0.84), Explainability Matrix, 87% Confidence gauge, and Human Verification action block. |
| 7 | **Intelligence Search** | `/search` | Natural language NLP search input, query example chips, entity category tabs, split-pane inspector. |
| 8 | **Intelligence Alerts** | `/alerts` | Severity filters (`Critical`, `High`, `Medium`), anomaly metrics, and direct graph investigation triggers. |
| 9 | **Data Sources & Pipeline** | `/data-sources` | Active integration cards (CCTNS, CDR, FIU) + Interactive 5-step Ingestion Pipeline simulation (`Ingest` → `Schema Check` → `NLP Extraction` → `Entity Link` → `Graph Update`). |
| 10 | **Document Intelligence** | `/document-intelligence` | Split-screen FIR document viewer with interactive entity highlight tags, extracted triples, and "Add to Graph" action. |
| 11 | **Investigation Timeline** | `/timeline` | Operation Shadow chronological timeline with multi-channel filtering (AI Findings, Calls, Transactions, Locations, Reports). |
| 12 | **Dossier & Reports** | `/reports` | Multi-section dossier builder + Real-time court-ready PDF preview with official police seal, cryptographic block-anchor, and print simulation. |
| 13 | **Immutable Audit Trail** | `/audit` | 24,892 recorded events KPI, 100% Tamper-Evident badge, search, immutable logs table with SHA-256 verification. |
| 14 | **Command Overview** | `/command-overview` | Executive strategic dashboard with Leaflet map telemetry and Priority Networks ranking. |
| 15 | **Women Safety Intelligence** | `/women-safety` | Anonymized pattern analysis for repeat offenders, trafficking networks, and transit corridors under Criminal Justice Code §228A. |

---

### 6. Global Investigative Utilities
- **AI Decision-Support Drawer (`AIAssistantDrawer.tsx`)**: Global slide-out assistant providing conversational investigative summaries, confidence scores, related entity pivots, and evidence citations.
- **Evidence Vault Modal (`EvidenceModal.tsx`)**: Modal displaying SHA-256 cryptographic hashes, file metadata, and tamper-evident verification badges.
- **Command Palette (`SearchModal.tsx`)**: Quick navigation overlay triggered via `⌘K` or `/` for instantaneous entity, case, and tool routing.

---

## 🏛️ Project Directory Structure

```text
NIRVIK/
├── public/
│   └── favicon.svg                     # Custom NIRVIK brand emblem
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AIAssistantDrawer.tsx   # Global AI investigative assistant
│   │   │   ├── EvidenceModal.tsx       # SHA-256 evidence integrity modal
│   │   │   └── SearchModal.tsx         # ⌘K quick search overlay
│   │   ├── graph/
│   │   │   ├── CytoscapeGraph.tsx      # Real interactive Cytoscape.js canvas
│   │   │   └── EntityInspector.tsx     # Graph entity inspector drawer
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx           # Global shell integrating sidebar & header
│   │   │   ├── Sidebar.tsx             # Fixed navy navigation sidebar
│   │   │   └── TopAppBar.tsx           # Breadcrumb top header & action triggers
│   │   └── map/
│   │       └── LeafletMap.tsx          # Real Leaflet geospatial intelligence map
│   ├── context/
│   │   ├── AuthContext.tsx             # Officer authentication state & credentials
│   │   └── CaseContext.tsx             # Active case, selection, and modal state
│   ├── mock/                           # Comprehensive synthetic intelligence datasets
│   │   ├── alerts.ts
│   │   ├── analytics.ts
│   │   ├── audit.ts
│   │   ├── cases.ts
│   │   ├── documents.ts
│   │   ├── entities.ts
│   │   ├── evidence.ts
│   │   ├── graph.ts
│   │   ├── timeline.ts
│   │   ├── users.ts
│   │   └── womenSafety.ts
│   ├── pages/                          # Complete 13-workspace screen suite
│   │   ├── Alerts/AlertsPage.tsx
│   │   ├── Audit/AuditPage.tsx
│   │   ├── CommandOverview/CommandOverviewPage.tsx
│   │   ├── Dashboard/DashboardPage.tsx
│   │   ├── DataSources/DataSourcesPage.tsx
│   │   ├── DocumentIntelligence/DocumentIntelligencePage.tsx
│   │   ├── EntityProfile/EntityProfilePage.tsx
│   │   ├── Investigations/
│   │   │   ├── CaseDetailPage.tsx
│   │   │   └── InvestigationsPage.tsx
│   │   ├── Login/LoginPage.tsx
│   │   ├── NetworkAnalysis/NetworkAnalysisPage.tsx
│   │   ├── Reports/ReportsPage.tsx
│   │   ├── Search/IntelligenceSearchPage.tsx
│   │   ├── Timeline/TimelinePage.tsx
│   │   └── WomenSafety/WomenSafetyPage.tsx
│   ├── services/                       # Data access & query abstraction layer
│   │   └── index.ts
│   ├── types/                          # Strict TypeScript domain interfaces
│   │   └── index.ts
│   ├── App.tsx                         # Client-side router configuration
│   ├── index.css                       # Global styles, scrollbars, & animations
│   └── main.tsx                        # Application mount entry point
├── stitch_nirvik_intelligence_platform/ # Source Stitch screens & HTML references
├── package.json
├── tailwind.config.js                  # NIRVIK 4-color palette configuration
├── tsconfig.json                       # TypeScript compiler configuration
└── vite.config.ts                      # Vite build & path alias configuration
```

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AdityaP116/NIRVIK.git
cd NIRVIK
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, type-checked production bundle in `dist/`.

---

## ⚖️ Ethical AI & Legal Compliance

NIRVIK adheres strictly to criminal justice guidelines:
- **Investigative Decision Support Only**: AI outputs are framed as *Intelligence Signals* and *Investigation Leads*, requiring human investigator sign-off prior to warrant applications or field operations.
- **Privacy Shielding**: Women safety and sensitive informant modules enforce automatic identity redaction under Criminal Justice Code §228A.
- **Immutable Chain of Custody**: All evidence access, search queries, and dossier exports are logged with cryptographic SHA-256 hashes in an immutable audit ledger.

---

<div align="center">
  <p><b>NIRVIK Intelligence System</b> · Designed & Developed by <b>Rishabh Shevde</b></p>
</div>
