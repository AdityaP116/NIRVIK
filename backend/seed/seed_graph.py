"""
NIRVIK Backend — Neo4j Graph Seeder
Seeds Neo4j graph with nodes (Person, Phone, Vehicle, Organization, Location, BankAccount, Case)
and parameterized Cypher relationships (CALLED, TRANSACTED_WITH, OWNS, LOCATED_AT, ASSOCIATED_WITH).
"""
from __future__ import annotations

import asyncio
from app.core.logging import configure_logging, get_logger
from app.db.neo4j import connect_neo4j, run_write_query
from seed.generate_data import generate_all_synthetic_data

logger = get_logger(__name__)


async def seed_neo4j_graph() -> None:
    await connect_neo4j()

    # Clear existing graph nodes
    logger.info("clearing_existing_neo4j_graph")
    await run_write_query("MATCH (n) DETACH DELETE n", {})

    data = generate_all_synthetic_data()

    # 1. Create Case Node
    case_cypher = """
    MERGE (c:Case {case_id: $case_id})
    SET c.name = $title, c.status = $status, c.priority = $priority
    """
    for c in data["cases"]:
        await run_write_query(case_cypher, {
            "case_id": c["case_number"],
            "title": c["title"],
            "status": c["status"],
            "priority": c["priority"],
        })

    # 2. Create Person Nodes
    person_cypher = """
    MERGE (p:Person {entity_id: $id})
    SET p.name = $name, p.normalized_name = $normalized_name, p.confidence = $confidence
    """
    for p in data["persons"]:
        await run_write_query(person_cypher, {
            "id": p["id"],
            "name": p["name"],
            "normalized_name": p["normalized_name"],
            "confidence": p["confidence"],
        })
        # Link to Case
        await run_write_query("""
            MATCH (p:Person {entity_id: $pid}), (c:Case {case_id: $case_id})
            MERGE (p)-[:INVOLVED_IN {confidence: 0.95, status: 'CONFIRMED'}]->(c)
        """, {"pid": p["id"], "case_id": p["linked_cases"][0]})

    # 3. Create Phone Nodes & Link CALLED relationships
    phone_cypher = """
    MERGE (ph:Phone {entity_id: $id})
    SET ph.name = $name, ph.confidence = $confidence
    """
    for ph in data["phones"]:
        await run_write_query(phone_cypher, {"id": ph["id"], "name": ph["name"], "confidence": ph["confidence"]})

    # Link Person -> OWNS -> Phone
    for idx, ph in enumerate(data["phones"]):
        owner = data["persons"][idx % len(data["persons"])]
        await run_write_query("""
            MATCH (p:Person {entity_id: $pid}), (ph:Phone {entity_id: $phid})
            MERGE (p)-[:OWNS {confidence: 0.98, status: 'CONFIRMED'}]->(ph)
        """, {"pid": owner["id"], "phid": ph["id"]})

    # 4. Create BankAccount Nodes & TRANSACTED_WITH relationships
    acc_cypher = """
    MERGE (b:BankAccount {entity_id: $id})
    SET b.name = $name, b.confidence = $confidence
    """
    for acc in data["bank_accounts"]:
        await run_write_query(acc_cypher, {"id": acc["id"], "name": acc["name"], "confidence": acc["confidence"]})

    # Link Person -> OWNS -> BankAccount
    for idx, acc in enumerate(data["bank_accounts"]):
        owner = data["persons"][idx % len(data["persons"])]
        await run_write_query("""
            MATCH (p:Person {entity_id: $pid}), (b:BankAccount {entity_id: $bacc_id})
            MERGE (p)-[:OWNS {confidence: 0.99, status: 'CONFIRMED'}]->(b)
        """, {"pid": owner["id"], "bacc_id": acc["id"]})

    # 5. Create Location Nodes & LOCATED_AT
    loc_cypher = """
    MERGE (l:Location {entity_id: $id})
    SET l.name = $name, l.latitude = $lat, l.longitude = $lng
    """
    for loc in data["locations"]:
        await run_write_query(loc_cypher, {
            "id": loc["id"],
            "name": loc["name"],
            "lat": loc["attributes"]["latitude"],
            "lng": loc["attributes"]["longitude"],
        })
        # Link Location to Case
        await run_write_query("""
            MATCH (l:Location {entity_id: $lid}), (c:Case {case_id: $case_id})
            MERGE (c)-[:ASSOCIATED_WITH {confidence: 0.90}]->(l)
        """, {"lid": loc["id"], "case_id": "CASE-2026-0142"})

    # 6. Insert Synthetic CDR CALLED Edges into Neo4j
    logger.info("creating_cdr_edges_in_neo4j")
    for cdr in data["cdr_records"][:150]:
        await run_write_query("""
            MATCH (p1:Phone {name: $caller}), (p2:Phone {name: $receiver})
            MERGE (p1)-[r:CALLED]->(p2)
            SET r.weight = coalesce(r.weight, 0) + 1,
                r.confidence = 0.98,
                r.status = 'CONFIRMED'
        """, {"caller": cdr["caller"], "receiver": cdr["receiver"]})

    # 7. Insert Synthetic Financial TRANSACTED_WITH Edges
    logger.info("creating_financial_edges_in_neo4j")
    for fin in data["financial_records"][:100]:
        await run_write_query("""
            MATCH (a1:BankAccount {name: $sender}), (a2:BankAccount {name: $receiver})
            MERGE (a1)-[r:TRANSACTED_WITH]->(a2)
            SET r.weight = coalesce(r.weight, 0) + $amount,
                r.confidence = 0.99,
                r.status = 'CONFIRMED'
        """, {
            "sender": fin["sender_account"],
            "receiver": fin["receiver_account"],
            "amount": float(fin["amount"]),
        })

    logger.info("seeded_neo4j_graph_successfully")


if __name__ == "__main__":
    configure_logging()
    asyncio.run(seed_neo4j_graph())
