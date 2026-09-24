# NIRVIK — API Reference

## Base Endpoint
`http://localhost:8000/api/v1`

## Key Endpoints

### 1. Authentication
- `POST /auth/login`: Authenticate officer session and return JWT token.
- `GET /auth/me`: Get current authenticated user profile.

### 2. Cases
- `GET /cases/`: List active investigation cases.
- `GET /cases/{case_id}`: Retrieve detailed case intelligence summary.
- `POST /cases/`: Create a new investigation case.

### 3. Entity Resolution & Search
- `GET /entities/{entity_id}`: Retrieve unified entity profile (Person, Phone, Vehicle, Location, Bank Account).
- `GET /network/{case_id}`: Get Cytoscape graph nodes and edges for a case.
- `POST /search/`: Full-text & multi-attribute intelligence search.

### 4. Anomaly & Analytics
- `GET /analytics/anomalies/{case_id}`: List detected communication/financial anomalies.
- `GET /network/path`: Calculate shortest graph connection between two entities.
