"""
NIRVIK Backend — Synthetic Data Generator
Generates realistic synthetic data for SIH MVP:
- 50+ persons
- 20 phones
- 15 vehicles
- 10 locations
- 10 organizations
- 20 bank accounts
- 15 cases (including primary demo case CASE-2026-0142)
- 500+ CDR records
- 200+ financial records
- 100+ FIR/intelligence documents

Contains zero real sensitive data.
"""
from __future__ import annotations

import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

PRIMARY_CASE_ID = "CASE-2026-0142"

NAMES = [
    "Ramesh Kumar", "Suresh Sharma", "Vikram Singh", "Amit Patel", "Rajesh Verma",
    "Priya Sharma", "Ankita Rao", "Deepak Gupta", "Sunil Yadav", "Manoj Joshi",
    "Vijay Kumar", "Rohan Mehta", "Pooja Reddy", "Neha Kapoor", "Rahul Malhotra",
    "Karan Saxena", "Sanjay Choudhary", "Alok Mishra", "Nitin Deshmukh", "Gaurav Tiwari",
    "Ajay Nair", "Vikas Agarwal", "Tarun Roy", "Manish Pandey", "Abhishek Dubey",
    "Siddharth Shah", "Dinesh Kulkarni", "Pradeep Bansal", "Harish Bhatia", "Ashok Solanki",
    "Rakesh Mittal", "Mukesh Soni", "Anil Chauhan", "Vinod Thakur", "Pankaj Jain",
    "Lokesh Tripathi", "Devendra Rathore", "Brijesh Gautam", "Shailesh Hegde", "Ganesh Shetty",
    "Kavita Deshpande", "Sunita Wagh", "Meena Mukherjee", "Ritu Sengupta", "Swati Pillai",
    "Preeti Iyengar", "Anjali Nambiar", "Divya Menon", "Poonam Das", "Sarita Kulkarni"
]

CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune"]


def generate_all_synthetic_data() -> dict:
    random.seed(42)

    persons = []
    phones = []
    vehicles = []
    locations = []
    organizations = []
    bank_accounts = []

    # 1. Persons (50+)
    for idx, name in enumerate(NAMES, start=1):
        pid = f"PER_{idx:03d}"
        persons.append({
            "id": pid,
            "entity_type": "PERSON",
            "name": name,
            "normalized_name": name.lower().strip(),
            "confidence": 0.95,
            "source_count": random.randint(2, 10),
            "linked_cases": [PRIMARY_CASE_ID] if idx <= 20 else [f"CASE-2026-01{random.randint(40, 55):02d}"],
            "attributes": {
                "gender": "Male" if idx <= 40 else "Female",
                "alias": f"Alias_{idx}",
                "kyc_status": "VERIFIED" if idx % 2 == 0 else "PARTIAL",
            }
        })

    # 2. Phones (20)
    for idx in range(1, 21):
        ph_id = f"PHN_{idx:03d}"
        num = f"+9198{random.randint(10000000, 99999999)}"
        phones.append({
            "id": ph_id,
            "entity_type": "PHONE",
            "name": num,
            "normalized_name": num,
            "confidence": 0.98,
            "source_count": random.randint(5, 25),
            "linked_cases": [PRIMARY_CASE_ID],
            "attributes": {"number": num, "provider": random.choice(["Airtel", "Jio", "Vi"])}
        })

    # 3. Vehicles (15)
    for idx in range(1, 16):
        v_id = f"VEH_{idx:03d}"
        v_num = f"MH{random.randint(10, 49)}AB{random.randint(1000, 9999)}"
        vehicles.append({
            "id": v_id,
            "entity_type": "VEHICLE",
            "name": v_num,
            "normalized_name": v_num.lower(),
            "confidence": 0.92,
            "source_count": random.randint(1, 6),
            "linked_cases": [PRIMARY_CASE_ID],
            "attributes": {"registration": v_num, "make": "Sedan"}
        })

    # 4. Locations (10 synthetic coordinates)
    for idx in range(1, 11):
        loc_id = f"LOC_{idx:03d}"
        city = CITIES[(idx - 1) % len(CITIES)]
        lat = round(18.5 + (idx * 0.1), 4)
        lng = round(73.8 + (idx * 0.1), 4)
        locations.append({
            "id": loc_id,
            "entity_type": "LOCATION",
            "name": f"Synthetic Terminal Node {idx} ({city})",
            "normalized_name": f"synthetic terminal node {idx} {city}".lower(),
            "confidence": 0.90,
            "source_count": random.randint(3, 15),
            "linked_cases": [PRIMARY_CASE_ID],
            "attributes": {"latitude": lat, "longitude": lng, "city": city}
        })

    # 5. Organizations (10)
    for idx in range(1, 11):
        org_id = f"ORG_{idx:03d}"
        name = f"Global Trading Corp {idx} Pvt Ltd"
        organizations.append({
            "id": org_id,
            "entity_type": "ORGANIZATION",
            "name": name,
            "normalized_name": name.lower(),
            "confidence": 0.94,
            "source_count": random.randint(2, 8),
            "linked_cases": [PRIMARY_CASE_ID],
            "attributes": {"type": "Shell Company" if idx <= 3 else "Enterprise"}
        })

    # 6. Bank Accounts (20)
    for idx in range(1, 21):
        acc_id = f"ACC_{idx:03d}"
        acc_num = f"50100{random.randint(1000000, 9999999)}"
        bank_accounts.append({
            "id": acc_id,
            "entity_type": "BANK_ACCOUNT",
            "name": acc_num,
            "normalized_name": acc_num,
            "confidence": 0.99,
            "source_count": random.randint(4, 20),
            "linked_cases": [PRIMARY_CASE_ID],
            "attributes": {"bank_name": "Synthetic Commercial Bank", "account_number": acc_num}
        })

    # 7. Cases (15)
    cases = [{
        "case_number": PRIMARY_CASE_ID,
        "title": "Organized Financial Network",
        "description": "Primary synthetic investigation into coordinated cross-jurisdictional financial transactions and communication anomalies.",
        "jurisdiction": "Central Economic Intelligence Bureau",
        "status": "ACTIVE",
        "priority": "HIGH",
        "assigned_to": "OFFICER_001",
        "entity_ids": [p["id"] for p in persons[:20]],
        "created_by": "OFFICER_001",
        "tags": ["financial_anomaly", "communication_burst", "cross_case"],
    }]

    for idx in range(1, 15):
        c_num = f"CASE-2026-01{42+idx:02d}"
        cases.append({
            "case_number": c_num,
            "title": f"Synthetic Intelligence Operation {idx}",
            "description": f"Secondary synthetic investigation tracking pattern {idx}.",
            "jurisdiction": "State Crime Branch",
            "status": "ACTIVE" if idx % 2 == 0 else "UNDER_REVIEW",
            "priority": "MEDIUM",
            "assigned_to": f"OFFICER_{idx:03d}",
            "entity_ids": [persons[idx]["id"], persons[idx + 5]["id"]],
            "created_by": "OFFICER_001",
            "tags": ["secondary"],
        })

    # 8. CDR Records (500+)
    cdr_records = []
    base_time = datetime.now(timezone.utc) - timedelta(days=30)
    for idx in range(1, 520):
        p1 = random.choice(phones)
        p2 = random.choice(phones)
        if p1["id"] == p2["id"]:
            continue
        ts = base_time + timedelta(hours=idx * 1.2, minutes=random.randint(1, 45))
        cdr_records.append({
            "record_id": f"CDR_{idx:04d}",
            "caller": p1["name"],
            "receiver": p2["name"],
            "timestamp": ts.isoformat(),
            "duration": random.randint(10, 600),
            "location": random.choice(locations)["name"],
            "source": "SYNTHETIC_TELCO_GATEWAY",
        })

    # 9. Financial Transactions (200+)
    financial_records = []
    for idx in range(1, 220):
        a1 = random.choice(bank_accounts)
        a2 = random.choice(bank_accounts)
        if a1["id"] == a2["id"]:
            continue
        ts = base_time + timedelta(hours=idx * 3, minutes=random.randint(1, 50))

        # Inject financial anomalies
        is_anomaly = (idx in [15, 42, 88, 140, 195])
        amount = random.randint(750000, 2500000) if is_anomaly else random.randint(5000, 45000)

        financial_records.append({
            "transaction_id": f"TXN_{idx:04d}",
            "sender_account": a1["name"],
            "receiver_account": a2["name"],
            "amount": amount,
            "timestamp": ts.isoformat(),
            "location": random.choice(locations)["name"],
            "source": "SYNTHETIC_BANK_SWITCH",
            "is_anomaly_injected": is_anomaly,
        })

    # 10. Documents (100+)
    documents = []
    for idx in range(1, 105):
        documents.append({
            "doc_id": f"DOC_{idx:03d}",
            "case_id": PRIMARY_CASE_ID if idx <= 40 else f"CASE-2026-01{random.randint(43, 55):02d}",
            "document_type": random.choice(["FIR", "INTELLIGENCE_REPORT", "CDR_REPORT", "FINANCIAL_REPORT"]),
            "title": f"Synthetic Field Report {idx}",
            "content": f"Intelligence report detailing activity of {persons[idx % len(persons)]['name']} calling {phones[idx % len(phones)]['name']}.",
        })

    return {
        "persons": persons,
        "phones": phones,
        "vehicles": vehicles,
        "locations": locations,
        "organizations": organizations,
        "bank_accounts": bank_accounts,
        "cases": cases,
        "cdr_records": cdr_records,
        "financial_records": financial_records,
        "documents": documents,
    }


if __name__ == "__main__":
    data = generate_all_synthetic_data()
    out_dir = Path(__file__).parent
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "synthetic_dataset.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated synthetic dataset with {len(data['persons'])} persons, {len(data['cases'])} cases, {len(data['cdr_records'])} CDRs, {len(data['financial_records'])} transactions.")
