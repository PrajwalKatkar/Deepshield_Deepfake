from typing import Dict, Any


class EnsembleEngine:
    def aggregate(
        self,
        detector_scores: Dict[str, float],
        media_type: str
    ) -> Dict[str, Any]:

        available_scores = []

        for _, value in detector_scores.items():
            if value is None:
                continue

            try:
                value = float(value)
            except (TypeError, ValueError):
                continue

            if 0.0 <= value <= 100.0:
                available_scores.append(value)

        if not available_scores:
            authenticity_score = 50.0
        else:
            authenticity_score = (
                sum(available_scores)
                / len(available_scores)
            )

        authenticity_score = round(
            max(0.0, min(100.0, authenticity_score)),
            1
        )

        manipulation_prob = round(
            100.0 - authenticity_score,
            1
        )

        # Conservative interpretation.
        # We avoid calling borderline results "authentic".
        if manipulation_prob >= 70:
            risk_level = "Highly Suspicious"

        elif manipulation_prob >= 45:
            risk_level = "Suspicious"

        elif manipulation_prob >= 25:
            risk_level = "Uncertain / Possible Manipulation"

        else:
            risk_level = "Probably Authentic"

        distance_from_center = abs(
            manipulation_prob - 50
        )

        if distance_from_center >= 30:
            confidence = "High"

        elif distance_from_center >= 15:
            confidence = "Medium"

        else:
            confidence = "Low"

        return {
            "authenticity_score": authenticity_score,
            "manipulation_probability": manipulation_prob,
            "risk_level": risk_level,
            "confidence": confidence
        }