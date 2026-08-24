# NIRVIK Backend Architecture

## Architectural Principles

1. **Strict Separation of Database Responsibilities**
   - **MongoDB** stores document metadata, cases, audit logs, finding reports, and user accounts.
   - **Neo4j** stores graph entities (Person, Phone, Vehicle, BankAccount, Location, Case) and parameterized relationships (`CALLED`, `TRANSACTED_WITH`, `OWNS`, `LOCATED_AT`).
   - **MinIO** stores encrypted raw evidence files.
   - **Hyperledger Fabric** stores SHA-256 integrity proofs and verification timestamps.

2. **Explainable AI & Decision Support**
   - No black-box score decisions. Every finding contains a structured explanation payload detailing graph centrality, anomaly deviation, or fuzzy matching signals.

3. **Read-Only AI Assistant**
   - The assistant service uses intent classification mapped to an allowlist of query templates. Unrestricted Cypher or database execution is impossible.

4. **Evidence Chain of Custody**
   - File Upload → SHA-256 → MinIO → MongoDB Metadata → Hyperledger Fabric Transaction.
