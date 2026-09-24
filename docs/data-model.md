# NIRVIK — Data Model Specification

## Core Domain Entities

### 1. Entity Types
- **PERSON**: Name, Aliases, KYC Status, Gender, Links.
- **PHONE**: Phone Number, Carrier/Provider, IMEI, CDR Logs.
- **VEHICLE**: Registration Number, Make, Model, License Plate Recognition hits.
- **LOCATION**: Latitude, Longitude, Address, Geofence zones.
- **BANK_ACCOUNT**: Account Number, Bank Name, IFSC, Financial Transactions.
- **ORGANIZATION**: Company Name, Registration Number, Shell Company indicators.

### 2. Relationships (Neo4j Edges)
- `CALLED` / `MESSAGED`: Direct telecom connection (Phone → Phone).
- `TRANSACTED_WITH`: Financial transaction (BankAccount → BankAccount).
- `OWNS`: Property or asset ownership (Person → Vehicle / BankAccount).
- `ASSOCIATED_WITH`: Inferred co-occurrence or link between entities.
- `LOCATED_AT`: Geospatial location association (Entity → Location).
