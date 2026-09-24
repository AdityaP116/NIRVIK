# NIRVIK — Production Deployment Guide

## Overview
This document provides complete instructions for deploying NIRVIK Intelligence Platform to production using Docker Compose, Cloud Run / DigitalOcean / AWS, Kubernetes, or Bare-Metal VM infrastructure.

---

## 1. Quick Start: Local & Single-Server Deployment (Docker Compose)

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Steps
1. **Clone Repository & Configure Environment**
   ```bash
   git clone https://github.com/AdityaP116/NIRVIK.git
   cd NIRVIK
   cp backend/.env.example backend/.env
   ```

2. **Generate Production Cryptographic Keys**
   Update `backend/.env`:
   ```env
   APP_SECRET_KEY=your_secure_random_32char_key
   JWT_SECRET_KEY=your_secure_random_64char_key
   ```

3. **Launch All Services**
   ```bash
   docker compose up -d --build
   ```

4. **Verify Operational Status**
   - **Frontend**: `http://localhost` (Served via Nginx)
   - **Backend API**: `http://localhost:8000/docs` (FastAPI Swagger UI)
   - **Neo4j Browser**: `http://localhost:7474`
   - **MinIO Storage Console**: `http://localhost:9001`

---

## 2. Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `API_BASE_URL` | Frontend backend API URL | `http://localhost:8000/api/v1` |
| `MONGODB_URI` | Mongo database connection URI | `mongodb://nirvik_user:nirvik_pass@mongodb:27017/nirvik` |
| `NEO4J_URI` | Neo4j Bolt connection URI | `bolt://neo4j:7687` |
| `NEO4J_USER` | Neo4j database user | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j database password | `nirvik_neo4j_pass` |
| `REDIS_URL` | Redis cache URI | `redis://redis:6379/0` |
| `JWT_SECRET_KEY` | JWT signature key | Must be set in production |

---

## 3. Cloud Container Deployment (GCP Cloud Run / AWS ECS)

### Backend Deployment
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/nirvik-backend:latest ./backend
docker push gcr.io/YOUR_PROJECT_ID/nirvik-backend:latest
```

### Frontend Deployment
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/nirvik-frontend:latest ./frontend
docker push gcr.io/YOUR_PROJECT_ID/nirvik-frontend:latest
```

---

## 4. Health Checks & Maintenance
- **Health Endpoint**: `GET /health` returns `{ "status": "healthy" }`
- **Audit Verification**: `GET /api/v1/audit/verify/{case_id}` checks hash integrity.
