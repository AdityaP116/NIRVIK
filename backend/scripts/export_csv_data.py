import csv
import json
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

# Import synthetic generator logic
from backend.seed.generate_data import generate_all_synthetic_data

def main():
    data = generate_all_synthetic_data()
    data_dir = Path("c:/Users/Admin/Desktop/NIRVIK/data")
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "reports").mkdir(parents=True, exist_ok=True)

    # 1. persons.csv
    with open(data_dir / "persons.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "gender", "alias", "kyc_status", "confidence"])
        writer.writeheader()
        for p in data["persons"]:
            writer.writerow({
                "id": p["id"],
                "name": p["name"],
                "gender": p["attributes"].get("gender", ""),
                "alias": p["attributes"].get("alias", ""),
                "kyc_status": p["attributes"].get("kyc_status", ""),
                "confidence": p["confidence"],
            })

    # 2. phones.csv
    with open(data_dir / "phones.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "number", "provider", "confidence"])
        writer.writeheader()
        for ph in data["phones"]:
            writer.writerow({
                "id": ph["id"],
                "number": ph["name"],
                "provider": ph["attributes"].get("provider", ""),
                "confidence": ph["confidence"],
            })

    # 3. vehicles.csv
    with open(data_dir / "vehicles.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "registration", "make", "confidence"])
        writer.writeheader()
        for v in data["vehicles"]:
            writer.writerow({
                "id": v["id"],
                "registration": v["name"],
                "make": v["attributes"].get("make", ""),
                "confidence": v["confidence"],
            })

    # 4. locations.csv
    with open(data_dir / "locations.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "city", "latitude", "longitude", "confidence"])
        writer.writeheader()
        for loc in data["locations"]:
            writer.writerow({
                "id": loc["id"],
                "name": loc["name"],
                "city": loc["attributes"].get("city", ""),
                "latitude": loc["attributes"].get("latitude", 0.0),
                "longitude": loc["attributes"].get("longitude", 0.0),
                "confidence": loc["confidence"],
            })

    # 5. cases.csv
    with open(data_dir / "cases.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["case_number", "title", "jurisdiction", "status", "priority", "assigned_to", "created_by"])
        writer.writeheader()
        for c in data["cases"]:
            writer.writerow({
                "case_number": c["case_number"],
                "title": c["title"],
                "jurisdiction": c["jurisdiction"],
                "status": c["status"],
                "priority": c["priority"],
                "assigned_to": c["assigned_to"],
                "created_by": c["created_by"],
            })

    # 6. cdr.csv
    with open(data_dir / "cdr.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["record_id", "caller", "receiver", "timestamp", "duration", "location", "source"])
        writer.writeheader()
        for cdr in data["cdr_records"]:
            writer.writerow(cdr)

    # 7. financial_transactions.csv
    with open(data_dir / "financial_transactions.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["transaction_id", "sender_account", "receiver_account", "amount", "timestamp", "location", "source", "is_anomaly_injected"])
        writer.writeheader()
        for txn in data["financial_records"]:
            writer.writerow(txn)

    # 8. reports/ sample
    with open(data_dir / "reports" / "sample_investigation_report.txt", "w", encoding="utf-8") as f:
        f.write("NIRVIK Intelligence Platform - Sample Field Investigation Report\n")
        f.write("Case Ref: CASE-2026-0142\n")
        f.write("Subject: Organized Communications Burst and Financial Anomaly Analysis\n")
        f.write("Summary: Multi-source correlation detected abnormal high-frequency CDR bursts between node PER_001 and PER_012 followed by rapid high-value transactions.\n")

    print("Data CSV files successfully created in c:/Users/Admin/Desktop/NIRVIK/data")

if __name__ == "__main__":
    main()
