from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseDetector(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        pass

    @abstractmethod
    def analyze(self, file_path: str, media_type: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Returns dictionary containing:
        - detector_scores: Dict[str, float] (scores 0-100 for face, temporal, audio, lip_sync, metadata)
        - likely_technique: str
        - technique_confidence: float
        - explanations: List[Dict[str, Any]]
        - multi_face_info: List[Dict[str, Any]]
        - is_suspicious: bool
        """
        pass
