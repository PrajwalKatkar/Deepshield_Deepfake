from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "USER"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class FrameResponse(BaseModel):
    id: int
    frame_number: int
    timestamp_str: str
    suspicion_score: float
    is_suspicious: bool
    image_url: str
    heatmap_url: Optional[str] = None
    detected_anomalies: List[str] = []
    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    id: str
    evidence_id: str
    filename: str
    original_filename: str
    media_type: str
    file_size_bytes: int
    duration_seconds: float
    resolution: str
    codec: str
    sha256: str
    status: str
    authenticity_score: float
    manipulation_probability: float
    confidence: str
    risk_level: str
    likely_technique: str
    technique_confidence: float
    detector_scores: Dict[str, float]
    explanations: List[Dict[str, Any]]
    metadata_info: Dict[str, Any]
    audio_info: Dict[str, Any]
    multi_face_info: List[Dict[str, Any]]
    analyst_notes: Optional[str] = ""
    is_demo: bool = True
    created_at: datetime
    frames: List[FrameResponse] = []
    class Config:
        from_attributes = True

class AnalystNotesUpdate(BaseModel):
    notes: str

class ComparisonRequest(BaseModel):
    video_a_id: str
    video_b_id: str

class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user_email: str
    action: str
    details: str
    ip_address: str
    class Config:
        from_attributes = True
