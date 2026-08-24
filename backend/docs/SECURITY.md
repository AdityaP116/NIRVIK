# NIRVIK Security & Data Policy

## Security Controls

1. **Password Security**: Passwords are hashed using Argon2 with high memory and iteration parameters (`time_cost=2`, `memory_cost=65536`). Plaintext passwords are never logged or stored.
2. **Role-Based Access Control (RBAC)**: Enforced across endpoints via FastAPI dependency injection:
   - `ADMIN`: Full access & user management
   - `SUPERVISOR`: Case management, findings review, report generation
   - `INVESTIGATOR`: Case view/update, entity analysis, evidence upload
   - `ANALYST`: Read-only network analytics and search
3. **Cypher Injection Prevention**: All Neo4j Cypher queries pass values exclusively through parameters (`$case_id`, `$entity_id`). User input string concatenation is strictly prohibited.
4. **Audit Hash Chain**: Audit log entries calculate `current_hash = SHA256(previous_hash + payload)` creating a tamper-evident audit log trail.
5. **Synthetic Data Enforcement**: 100% synthetic data — no real personal, phone, bank account, or law enforcement data exists within the repository.
