# NIRVIK — AI-Powered Criminal Network Intelligence Platform

<div align="center">
  <img src="public/favicon.svg" alt="NIRVIK Logo" width="80" height="80" />
  <h3>AI-Powered Criminal Network Intelligence</h3>
  <p>An investigation decision-support interface built for law enforcement analysts, crime branch investigators, and command personnel.</p>
</div>

---

## 🚀 Overview

**NIRVIK** translates fragmented multi-jurisdictional intelligence (FIR documents, CDR call records, financial transactions, geospatial movements) into actionable graph topologies. Built with a strict, high-contrast 4-color law enforcement design system, NIRVIK enables investigators to detect hidden bridge entities, track financial conduits, and verify evidence integrity in court-ready dossiers.

---

## 🎨 Design System & Visual Palette

| Token | Hex Code | Purpose |
|---|---|---|
| **Primary (Dark Navy)** | `#10232F` / `#263845` | Main structural identity, headers, sidebars |
| **Action & Highlight (Orange)** | `#FD974E` / `#FF994F` | High-priority signals, bridge nodes, active triggers |
| **Surface (Slate Grey)** | `#C3C7CC` / `#BFC9D0` | Subtle borders, dividers, secondary tags |
| **Canvas (Light Canvas)** | `#F5FAFA` / `#EAEFEF` | Crisp background canvas for prolonged investigative analysis |

---

## 💻 Tech Stack

- **Framework**: React 18 / 19, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Material Symbols Outlined, Inter Font
- **Network Graph**: [Cytoscape.js](https://js.cytoscape.org/) (interactive physics layout, node centrality clustering, network expansion)
- **Geospatial Mapping**: [Leaflet.js](https://leafletjs.com/) (real-time telemetry and regional crime corridors)
- **Icons**: Google Material Symbols & Lucide React

---

## 📂 Key Workspaces & Screens

1. **Intelligence Dashboard (`/dashboard`)**: High-level KPIs, attention-required alerts, and active cases summary.
2. **Network Analysis (`/network-analysis`)**: Full interactive Cytoscape.js graph canvas with real-time confidence filtering, centrality metrics, and one-click intermediate network expansion.
3. **Entity Profile (`/entities/:id`)**: Target dossiers (e.g. Ramesh Kumar, UID-8842-A) with AI explainability matrix, confidence indicators, and human-in-the-loop verification buttons.
4. **Investigations Workspace (`/investigations`)**: Case index and detailed linkage topology views (`/investigations/:caseId`).
5. **Document Intelligence (`/document-intelligence`)**: NLP text viewer highlighting named entities in FIRs and injecting extracted relationships into the graph.
6. **Command Overview (`/command-overview`)**: Executive summary with interactive Leaflet geospatial map and priority network rankings.
7. **Intelligence Search (`/search`)**: Natural language query search with query chips and category breakdowns.
8. **Intelligence Alerts (`/alerts`)**: Cross-case anomaly detection and severity filtering.
9. **Data Sources & Pipeline (`/data-sources`)**: Multi-modal ingestion simulator (CCTNS, Telecom, Financial FIU).
10. **Investigation Timeline (`/timeline`)**: Chronological event flow with multi-channel filtering.
11. **Dossier & Reports (`/reports`)**: Court-ready dossier generator with cryptographic block-anchor stamps and PDF export.
12. **Immutable Audit Trail (`/audit`)**: Cryptographically verified audit log of all system queries and actions.
13. **Women Safety Intelligence (`/women-safety`)**: Privacy-shielded repeat offender pattern analysis.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/AdityaP116/NIRVIK.git
cd NIRVIK

# Install dependencies
npm install

# Start the local development server
npm run dev

# Build production bundle
npm run build
```

---

## 🛡️ License

Law Enforcement Authorized Access Protocol. Confidential Criminal Intelligence Platform.
