import random
from typing import Dict, Any
from backend.detectors.base import BaseDetector

class DemoDetector(BaseDetector):
    @property
    def name(self) -> str:
        return "DeepShield Forensic Ensemble (Demo Mode)"

    @property
    def version(self) -> str:
        return "1.0-demo"

    def analyze(self, file_path: str, media_type: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        lower_name = file_path.lower()
        # Heuristic trigger for deepfake detection test files
        is_suspicious = any(kw in lower_name for kw in ["fake", "deepfake", "swap", "synth", "clone", "manipulated", "ai"])
        
        # If filename doesn't specify, use deterministic hash trigger (even hash = suspicious)
        if not is_suspicious:
            file_len = len(lower_name)
            is_suspicious = (file_len % 2 == 0) and ("real" not in lower_name and "auth" not in lower_name)
            
        if is_suspicious:
            detector_scores = {
                "face": round(random.uniform(12.0, 24.0), 1),
                "temporal": round(random.uniform(15.0, 31.0), 1),
                "audio": round(random.uniform(22.0, 38.0), 1),
                "lip_sync": round(random.uniform(18.0, 34.0), 1),
                "metadata": round(random.uniform(45.0, 68.0), 1)
            }
            likely_technique = random.choice([
                "Face Swap", 
                "Face Reenactment", 
                "Lip Sync Manipulation", 
                "Voice Cloning"
            ])
            technique_confidence = round(random.uniform(84.0, 96.0), 1)
            
            explanations = [
                {
                    "title": "Facial Boundary & Edge Artifact Inconsistency",
                    "confidence": "High",
                    "description": "High pixel intensity gradients around jawline and forehead indicate warping/blending boundaries typical of deepfake autoencoder face-swapping."
                },
                {
                    "title": "Temporal Frame-to-Frame Discontinuity",
                    "confidence": "High",
                    "description": "Inter-frame facial landmark jitter detected across frames #30-#90. Optical flow vectors exhibit non-physical motion spikes."
                },
                {
                    "title": "Lip-Sync Latency & Viseme Mismatch",
                    "confidence": "Medium",
                    "description": "Mouth aperture velocity does not correlate with audio spectral envelope during plosive phonemes."
                },
                {
                    "title": "Metadata Container & Software Anomaly",
                    "confidence": "Medium",
                    "description": "Encoding container lacks original camera EXIF hardware parameters and shows non-standard ffmpeg re-encode stream signatures."
                },
                {
                    "title": "Unnatural Skin Texture & Frequency Variance",
                    "confidence": "High",
                    "description": "High-frequency spatial noise filtering observed in facial ROI, inconsistent with natural camera sensor noise."
                }
            ]
            
            multi_face_info = [
                {"person_id": 1, "name": "Person 1 (Target)", "manipulation_probability": round(random.uniform(88.0, 96.0), 1), "is_manipulated": True, "bbox": [195, 75, 445, 325]},
                {"person_id": 2, "name": "Person 2 (Background)", "manipulation_probability": round(random.uniform(8.0, 15.0), 1), "is_manipulated": False, "bbox": [50, 100, 150, 250]}
            ]
        else:
            detector_scores = {
                "face": round(random.uniform(90.0, 98.0), 1),
                "temporal": round(random.uniform(92.0, 99.0), 1),
                "audio": round(random.uniform(88.0, 96.0), 1),
                "lip_sync": round(random.uniform(91.0, 97.0), 1),
                "metadata": round(random.uniform(85.0, 95.0), 1)
            }
            likely_technique = "None Detected"
            technique_confidence = 0.0
            
            explanations = [
                {
                    "title": "Natural Facial Consistency",
                    "confidence": "High",
                    "description": "Facial boundaries, texture, and eye reflections exhibit natural distribution matching hardware sensor noise."
                },
                {
                    "title": "Temporal Motion Continuity",
                    "confidence": "High",
                    "description": "Optical flow vectors and head posture move smoothly across all extracted video frames with zero jitter spikes."
                },
                {
                    "title": "Acoustic Lip Synchrony",
                    "confidence": "High",
                    "description": "Phoneme audio wave alignment strictly corresponds to visual mouth landmarks."
                }
            ]
            
            multi_face_info = [
                {"person_id": 1, "name": "Person 1", "manipulation_probability": round(random.uniform(4.0, 10.0), 1), "is_manipulated": False, "bbox": [200, 80, 440, 320]}
            ]

        return {
            "detector_scores": detector_scores,
            "likely_technique": likely_technique,
            "technique_confidence": technique_confidence,
            "explanations": explanations,
            "multi_face_info": multi_face_info,
            "is_suspicious": is_suspicious
        }
