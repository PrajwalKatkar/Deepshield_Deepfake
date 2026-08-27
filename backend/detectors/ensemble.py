from typing import Dict, Any, List

class EnsembleEngine:
    def aggregate(self, detector_scores: Dict[str, float], media_type: str) -> Dict[str, Any]:
        """
        Weights:
        - Face Manipulation: 35%
        - Temporal Consistency: 25% (if video)
        - Audio Authenticity: 20%
        - Lip Sync: 10%
        - Metadata Integrity: 10%
        """
        weights = {
            "face": 0.35,
            "temporal": 0.25 if media_type == "VIDEO" else 0.0,
            "audio": 0.20 if media_type in ["VIDEO", "AUDIO"] else 0.0,
            "lip_sync": 0.10 if media_type == "VIDEO" else 0.0,
            "metadata": 0.10
        }
        
        # Normalize weights
        total_weight = sum(weights.values())
        normalized_weights = {k: v / total_weight for k, v in weights.items()}
        
        # Calculation: higher score = higher authenticity
        authenticity_score = 0.0
        for key, weight in normalized_weights.items():
            val = detector_scores.get(key, 90.0)
            authenticity_score += val * weight
            
        authenticity_score = round(max(0.0, min(100.0, authenticity_score)), 1)
        manipulation_prob = round(100.0 - authenticity_score, 1)
        
        # Determine Risk Level
        if authenticity_score <= 20.0:
            risk_level = "Highly Suspicious"
        elif authenticity_score <= 40.0:
            risk_level = "Suspicious"
        elif authenticity_score <= 60.0:
            risk_level = "Uncertain"
        elif authenticity_score <= 80.0:
            risk_level = "Probably Authentic"
        else:
            risk_level = "Highly Authentic"
            
        # Determine Confidence
        if authenticity_score < 25.0 or authenticity_score > 75.0:
            confidence = "High"
        elif authenticity_score < 40.0 or authenticity_score > 60.0:
            confidence = "Medium"
        else:
            confidence = "Low"
            
        return {
            "authenticity_score": authenticity_score,
            "manipulation_probability": manipulation_prob,
            "risk_level": risk_level,
            "confidence": confidence
        }
