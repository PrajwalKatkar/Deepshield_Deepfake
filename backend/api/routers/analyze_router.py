import os
import uuid
import datetime
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.config import UPLOAD_DIR, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS, ALLOWED_AUDIO_EXTENSIONS, REPORTS_DIR
from backend.database.database import get_db
from backend.database.models import User, Analysis, VideoFrame, EvidenceRecord, Report, AuditLog
from backend.schemas.schemas import AnalysisResponse, AnalystNotesUpdate
from backend.auth.auth import get_current_user
from backend.forensic.hash_utils import calculate_sha256
from backend.forensic.metadata_extractor import extract_media_metadata
from backend.forensic.frame_extractor import extract_and_analyze_frames
from backend.forensic.audio_forensics import analyze_audio_track
from backend.detectors.real_detector import RealDeepfakeDetector
from backend.detectors.ensemble import EnsembleEngine
from backend.reports.pdf_generator import generate_forensic_pdf_report

router = APIRouter(prefix="/api", tags=["Analyze"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = Path(file.filename).suffix.lower()
    if ext in ALLOWED_IMAGE_EXTENSIONS:
        media_type = "IMAGE"
    elif ext in ALLOWED_VIDEO_EXTENSIONS:
        media_type = "VIDEO"
    elif ext in ALLOWED_AUDIO_EXTENSIONS:
        media_type = "AUDIO"
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file extension: {ext}")
        
    analysis_id = str(uuid.uuid4())
    evidence_id = f"EV-2026-{uuid.uuid4().hex[:6].upper()}"
    saved_filename = f"{analysis_id}{ext}"
    saved_path = UPLOAD_DIR / saved_filename
    
    content = await file.read()
    with open(saved_path, "wb") as f:
        f.write(content)
        
    # Calculate SHA-256 Hash
    sha256_hash = calculate_sha256(str(saved_path))
    
    # 1. Metadata Extraction
    metadata = extract_media_metadata(str(saved_path), media_type)
    
    # 2. Multi-model Forensic Detection Engine
    detector = RealDeepfakeDetector()
    detector_results = detector.analyze(str(saved_path), media_type, metadata)
    
    # 3. Ensemble Engine Aggregation
    ensemble = EnsembleEngine()
    aggregated = ensemble.aggregate(detector_results["detector_scores"], media_type)
    
    # 4. Frame & Heatmap Extraction
    frames_data = extract_and_analyze_frames(
        analysis_id=analysis_id,
        file_path=str(saved_path),
        media_type=media_type,
        is_suspicious_override=detector_results["is_suspicious"]
    )
    
    # 5. Audio Forensics & Lip-sync Analysis
    audio_info = analyze_audio_track(
        file_path=str(saved_path),
        media_type=media_type,
        is_suspicious=detector_results["is_suspicious"]
    )
    
    # Save Analysis to DB
    analysis = Analysis(
        id=analysis_id,
        evidence_id=evidence_id,
        filename=saved_filename,
        original_filename=file.filename,
        media_type=media_type,
        file_size_bytes=len(content),
        duration_seconds=metadata["duration_seconds"],
        resolution=metadata["resolution"],
        codec=metadata["codec"],
        sha256=sha256_hash,
        status="COMPLETED",
        authenticity_score=aggregated["authenticity_score"],
        manipulation_probability=aggregated["manipulation_probability"],
        confidence=aggregated["confidence"],
        risk_level=aggregated["risk_level"],
        likely_technique=detector_results["likely_technique"],
        technique_confidence=detector_results["technique_confidence"],
        detector_scores=detector_results["detector_scores"],
        explanations=detector_results["explanations"],
        metadata_info=metadata,
        audio_info=audio_info,
        multi_face_info=detector_results["multi_face_info"],
        is_demo=False
    )
    db.add(analysis)
    
    # Save Video Frames
    for fd in frames_data:
        frame_obj = VideoFrame(
            analysis_id=analysis_id,
            frame_number=fd["frame_number"],
            timestamp_str=fd["timestamp_str"],
            suspicion_score=fd["suspicion_score"],
            is_suspicious=fd["is_suspicious"],
            image_url=fd["image_url"],
            heatmap_url=fd["heatmap_url"],
            detected_anomalies=fd["detected_anomalies"]
        )
        db.add(frame_obj)
        
    # Save Evidence Vault Record
    evidence = EvidenceRecord(
        id=evidence_id,
        analysis_id=analysis_id,
        sha256=sha256_hash,
        original_filename=file.filename,
        media_type=media_type,
        model_version=detector.name,
        status="Active"
    )
    db.add(evidence)
    
    # Save Audit Log
    audit = AuditLog(
        user_email=current_user.email,
        action="MEDIA_ANALYSIS_COMPLETED",
        details=f"Analyzed {file.filename} ({media_type}). Result: {aggregated['risk_level']} ({aggregated['authenticity_score']}/100)"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/analysis/{id}", response_model=AnalysisResponse)
def get_analysis_by_id(id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        # Check if ID is evidence ID
        analysis = db.query(Analysis).filter(Analysis.evidence_id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.put("/analysis/{id}/notes")
def update_analyst_notes(id: str, body: AnalystNotesUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    analysis.analyst_notes = body.notes
    
    audit = AuditLog(user_email=current_user.email, action="ANALYST_NOTES_UPDATED", details=f"Updated notes for analysis {id}")
    db.add(audit)
    db.commit()
    return {"message": "Analyst notes saved successfully"}

@router.get("/analysis/{id}/report")
def get_pdf_report(id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
        
    analysis_dict = {
        "id": analysis.id,
        "evidence_id": analysis.evidence_id,
        "original_filename": analysis.original_filename,
        "media_type": analysis.media_type,
        "file_size_bytes": analysis.file_size_bytes,
        "duration_seconds": analysis.duration_seconds,
        "resolution": analysis.resolution,
        "codec": analysis.codec,
        "sha256": analysis.sha256,
        "authenticity_score": analysis.authenticity_score,
        "manipulation_probability": analysis.manipulation_probability,
        "confidence": analysis.confidence,
        "risk_level": analysis.risk_level,
        "likely_technique": analysis.likely_technique,
        "technique_confidence": analysis.technique_confidence,
        "detector_scores": analysis.detector_scores or {},
        "explanations": analysis.explanations or [],
        "is_demo": analysis.is_demo
    }
    
    pdf_rel_path = generate_forensic_pdf_report(analysis_dict)
    pdf_full_path = REPORTS_DIR / f"DeepShield_Forensic_Report_{analysis.id}.pdf"
    
    if os.path.exists(pdf_full_path):
        return FileResponse(
            path=str(pdf_full_path),
            filename=f"DeepShield_Forensic_Report_{analysis.evidence_id}.pdf",
            media_type="application/pdf"
        )
    else:
        raise HTTPException(status_code=500, detail="Failed to generate PDF report")
