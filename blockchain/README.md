# NIRVIK — Blockchain & Immutable Evidence Verification

## Overview
NIRVIK incorporates cryptographic audit logging and hash-chain verification to guarantee tamper-evident preservation of investigative evidence, chain of custody, and forensic action logs.

## Key Features
1. **Cryptographic Hash Chaining (SHA-256)**
   - Every log entry or evidence artifact ingested is cryptographically hashed (`SHA-256`).
   - Block headers link to the previous entry's hash, forming an immutable sequence.

2. **Chain of Custody Verification**
   - Verification endpoint checks block sequence hashes against the state store.
   - Any tampering or out-of-order alteration immediately flags validation errors.

3. **Hyperledger / Ethereum Adapter Support**
   - Pre-configured RPC endpoints for anchoring hash roots to private enterprise distributed ledgers (e.g. Hyperledger Fabric / Ethereum Enterprise networks).

## Usage & API Integration
- `POST /api/v1/audit/log`: Appends forensic audit record with cryptographic signature.
- `GET /api/v1/audit/verify/{case_id}`: Performs cryptographic integrity check on case audit trail.
