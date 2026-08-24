# NIRVIK — Intelligence & Investigation Decision-Support Backend

NIRVIK is an advanced decision-support platform designed for intelligence and investigation agencies. It converts fragmented synthetic records (FIRs, CDRs, financial transactions, vehicle registries, and intelligence briefs) into structured knowledge graphs, automated anomaly signals, graph analytics, and explainable findings.

> **CRITICAL LEGAL NOTICE**: NIRVIK is strictly a **decision-support platform**. The system **NEVER** automatically determines guilt, criminality, intent, responsibility, or legal liability. All algorithmic outputs are presented as analytical signals and recommendations for human investigator review.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI + Python 3.12 |
| Primary Database | MongoDB (Metadata, documents, cases, findings, audit logs) |
| Graph Database | Neo4j (Entities, multi-hop relationships, Cytoscape format) |
| Cache & Task Broker | Redis + Celery |
| Object Storage | MinIO (S3-compatible encrypted storage) |
| Integrity Ledger | Hyperledger Fabric (Mock adapter for MVP, modular swap) |
| Graph Analytics | Neo4j GDS + NetworkX fallback |
| NLP & NER | spaCy + Transformers |
| Entity Matching | RapidFuzz + Semantic Similarity |
| Anomaly Engine | Rule heuristics + scikit-learn IsolationForest |
| Auth & Security | JWT + Argon2 password hashing + RBAC |

---

## Quick Start (Local Development)

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Run Infrastructure via Docker Compose
```bash
docker-compose up -d
```
This starts MongoDB (`27017`), Neo4j (`7687`/`7474`), Redis (`6379`), and MinIO (`9000`/`9001`).

### 3. Install Python Dependencies
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Seed Synthetic Data
```bash
python -m seed.seed_database
python -m seed.seed_graph
```

### 5. Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Demo Credentials (Synthetic Data Only)

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@nirvik.gov.in` | `NirvikAdmin2026!` |
| **INVESTIGATOR** | `investigator@nirvik.gov.in` | `Investigator2026!` |
| **SUPERVISOR** | `supervisor@nirvik.gov.in` | `Supervisor2026!` |
| **ANALYST** | `analyst@nirvik.gov.in` | `Analyst2026!` |

---

## Key API Endpoints Summary

- `POST /api/v1/auth/login` — User authentication & JWT issuance
- `GET /api/v1/cases` — Case list & search
- `GET /api/v1/network/{case_id}` — Cytoscape.js compatible graph representation
- `GET /api/v1/network/{case_id}/analytics` — Centrality metrics & Louvain community detection
- `GET /api/v1/network/path/shortest` — Multi-hop shortest connection path with explanation
- `POST /api/v1/evidence` — File upload with SHA-256 calculation & Fabric integrity recording
- `GET /api/v1/evidence/{id}/verify` — Verify evidence against stored SHA-256 & Fabric proof
- `POST /api/v1/assistant/query` — Read-only AI decision support query
- `GET /api/v1/network/{case_id}/locations` — Leaflet map compatible location coordinates

---

## Running Tests
```bash
pytest tests/ -v
```
