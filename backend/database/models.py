import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from backend.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="USER") # USER, ANALYST, ADMIN
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)
    evidence_id = Column(String, unique=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    media_type = Column(String, nullable=False) # IMAGE, VIDEO, AUDIO
    file_size_bytes = Column(Integer, default=0)
    duration_seconds = Column(Float, default=0.0)
    resolution = Column(String, default="Unknown")
    codec = Column(String, default="Unknown")
    sha256 = Column(String, index=True, nullable=False)
    status = Column(String, default="COMPLETED") # PROCESSING, COMPLETED, FAILED
    
    authenticity_score = Column(Float, default=100.0) # 0 to 100
    manipulation_probability = Column(Float, default=0.0) # 0 to 100
    confidence = Column(String, default="High")
    risk_level = Column(String, default="Highly Authentic")
    
    likely_technique = Column(String, default="None Detected")
    technique_confidence = Column(Float, default=0.0)
    
    detector_scores = Column(JSON, default=dict) # {"face": 95, "temporal": 88, ...}
    explanations = Column(JSON, default=list)
    metadata_info = Column(JSON, default=dict)
    audio_info = Column(JSON, default=dict)
    multi_face_info = Column(JSON, default=list)
    analyst_notes = Column(Text, default="")
    is_demo = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    frames = relationship("VideoFrame", back_populates="analysis", cascade="all, delete-orphan")
    evidence = relationship("EvidenceRecord", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="analysis", cascade="all, delete-orphan")

class VideoFrame(Base):
    __tablename__ = "video_frames"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String, ForeignKey("analyses.id"))
    frame_number = Column(Integer, nullable=False)
    timestamp_str = Column(String, nullable=False)
    suspicion_score = Column(Float, default=0.0)
    is_suspicious = Column(Boolean, default=False)
    image_url = Column(String, nullable=False)
    heatmap_url = Column(String, nullable=True)
    detected_anomalies = Column(JSON, default=list)
    
    analysis = relationship("Analysis", back_populates="frames")

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String, primary_key=True, index=True) # EV-2026-XXXXXX
    analysis_id = Column(String, ForeignKey("analyses.id"))
    sha256 = Column(String, index=True, nullable=False)
    original_filename = Column(String, nullable=False)
    media_type = Column(String, nullable=False)
    model_version = Column(String, default="DeepShield Ensemble v1.0")
    status = Column(String, default="Active")
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    analysis = relationship("Analysis", back_populates="evidence")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    analysis_id = Column(String, ForeignKey("analyses.id"))
    pdf_filename = Column(String, nullable=False)
    download_url = Column(String, nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    analysis = relationship("Analysis", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_email = Column(String, default="system")
    action = Column(String, nullable=False)
    details = Column(String, nullable=False)
    ip_address = Column(String, default="127.0.0.1")
