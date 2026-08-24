"""
NIRVIK Backend — Anomaly Detection Engine
Uses rule-based heuristics AND scikit-learn IsolationForest ML model.
Distinguishes between anomaly scores and confidence scores.
Does NOT label findings as criminal activity; flags them as FINANCIAL_ANOMALY or COMMUNICATION_BURST for human review.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest

from app.core.logging import get_logger

logger = get_logger(__name__)


class AnomalyService:
    """Anomaly detection service combining deterministic rules and IsolationForest."""

    def __init__(self) -> None:
        # Pre-trained / Default IsolationForest model for financial & CDR feature vectors
        self._clf = IsolationForest(n_estimators=50, contamination=0.1, random_state=42)

    def detect_financial_anomalies(
        self, transactions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Evaluate financial transactions for velocity, amount, and structural anomalies.
        """
        if not transactions:
            return []

        anomalies: List[Dict[str, Any]] = []

        # Prepare feature matrix: [amount, frequency_count, hour_of_day]
        feature_list = []
        for t in transactions:
            amount = float(t.get("amount", 0))
            hour = float(t.get("hour", 12))
            freq = float(t.get("recent_count", 1))
            feature_list.append([amount, freq, hour])

        features = np.array(feature_list)

        # Fit & Predict IsolationForest if sufficient data
        if len(features) >= 5:
            self._clf.fit(features)
            scores = -self._clf.score_samples(features)  # Higher = more anomalous
            # Normalize scores to 0.0 - 1.0
            min_s, max_s = scores.min(), scores.max()
            norm_scores = (scores - min_s) / (max_s - min_s + 1e-6)
        else:
            norm_scores = [0.5] * len(transactions)

        # Evaluate rules and combine with ML scores
        for idx, t in enumerate(transactions):
            amount = float(t.get("amount", 0))
            is_rule_anomaly = False
            rule_reasons = []

            # Rule 1: High transaction amount (> 500,000 INR synthetic threshold)
            if amount > 500000:
                is_rule_anomaly = True
                rule_reasons.append("unusual_transaction_amount")

            # Rule 2: Sudden velocity spike (> 10 transactions/hour)
            if t.get("recent_count", 0) > 10:
                is_rule_anomaly = True
                rule_reasons.append("sudden_transaction_velocity_spike")

            ml_score = float(norm_scores[idx])

            if is_rule_anomaly or ml_score > 0.65:
                combined_score = round(max(ml_score, 0.75 if is_rule_anomaly else 0.5), 2)
                anomalies.append({
                    "transaction_id": t.get("transaction_id", f"tx_{idx}"),
                    "sender_account": t.get("sender_account"),
                    "receiver_account": t.get("receiver_account"),
                    "amount": amount,
                    "anomaly_score": combined_score,
                    "method": "HYBRID_RULES_ISOLATION_FOREST" if is_rule_anomaly else "ISOLATION_FOREST",
                    "explanation": {
                        "rule_reasons": rule_reasons,
                        "ml_isolation_score": round(ml_score, 2),
                        "amount_dev": round(amount / 50000.0, 2),
                        "recent_activity_change": round(t.get("recent_count", 1) / 2.0, 2),
                    },
                    "status": "REQUIRES_REVIEW",
                })

        return anomalies

    def detect_communication_bursts(
        self, cdr_records: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Evaluate CDR records for burst communication patterns (>15 calls in short window).
        """
        if not cdr_records:
            return []

        bursts: List[Dict[str, Any]] = []
        call_counts: Dict[str, int] = {}

        for r in cdr_records:
            caller = r.get("caller", "")
            call_counts[caller] = call_counts.get(caller, 0) + 1

        for caller, count in call_counts.items():
            if count >= 15:
                bursts.append({
                    "caller": caller,
                    "call_count": count,
                    "anomaly_score": round(min(0.5 + (count * 0.02), 0.98), 2),
                    "method": "COMMUNICATION_BURST_RULE",
                    "explanation": {
                        "call_frequency": "high",
                        "total_calls_window": count,
                        "burst_threshold_exceeded": True,
                    },
                    "status": "REQUIRES_REVIEW",
                })

        return bursts
