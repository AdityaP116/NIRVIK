"""
NIRVIK Ingestion Service Package
"""
import csv
from pathlib import Path
from typing import Any, Dict, List

async def ingest_csv_file(file_path: Path) -> List[Dict[str, Any]]:
    records = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    return records
