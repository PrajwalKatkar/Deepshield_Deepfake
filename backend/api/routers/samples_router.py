import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.config import UPLOAD_DIR
from backend.database.database import get_db
from backend.database.models import User, Analysis, VideoFrame, EvidenceRecord, AuditLog
from backend.schemas.schemas import AnalysisResponse
from backend.auth.auth import get_current_user
from backend.forensic.hash_utils import calculate_sha256
from backend.forensic.metadata_extractor import extract_media_metadata
from backend.forensic.frame_extractor import extract_and_analyze_frames
from backend.forensic.audio_forensics import analyze_audio_track
from backend.forensic.sample_generator import generate_backend_sample_video
from backend.detectors.demo_detector import DemoDetector
from backend.detectors.ensemble import EnsembleEngine

router = APIRouter(prefix="/api/samples", tags=["Backend Test Samples"])

@router.get("")
def list_backend_samples():
    """
    Returns list of pre-configured backend test samples available for instant analysis.
    """
    return [
        {
            "id": "suspicious_faceswap",
            "name": "Suspicious Deepfake Face Swap Video",
            "filename": "suspicious_faceswap_video.mp4",
            "media_type": "VIDEO",
            "description": "Simulated AI face replacement video featuring boundary optical flow jitter & temporal landmarks distortion.",
            "expected_risk": "Highly Suspicious (Score ~26%)"
        },
        {
            "id": "authentic_baseline",
            "name": "Authentic Baseline Camera Video",
            "filename": "authentic_baseline_video.mp4",
            "media_type": "VIDEO",
            "description": "Clean camera baseline video exhibiting natural motion vectors & continuous sensor noise profile.",
            "expected_risk": "Highly Authentic (Score ~95%)"
        },
        {
            "id": "suspicious_deepfake_image",
            "name": "Suspicious Synthetic AI Portrait",
            "filename": "suspicious_deepfake_image.jpg",
            "media_type": "IMAGE",
            "description": "AI-generated synthetic image with high-frequency spatial texture anomalies.",
            "expected_risk": "Suspicious (Score ~28%)"
        }
    ]

@router.post("/analyze-sample/{sample_id}", response_model=AnalysisResponse)
def analyze_backend_sample(
    sample_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Instantly runs backend forensic analysis pipeline on a selected backend test sample.
    """
    if sample_id in ["suspicious_faceswap", "authentic_baseline"]:
        file_path = generate_backend_sample_video(sample_id)
        filename = os.path.basename(file_path)
        media_type = "VIDEO"
    elif sample_id == "suspicious_deepfake_image":
        samples_dir = UPLOAD_DIR / "test_samples"
        os.makedirs(samples_dir, exist_ok=True)
        file_path = str(samples_dir / "suspicious_deepfake_image.jpg")
        if not os.path.exists(file_path):
            import cv2, numpy as np
            img = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.rectangle(img, (180, 80), (460, 360), (0, 0, 255), 2)
            cv2.putText(img, "SUSPICIOUS SYNTHETIC DEEPFAKE IMAGE", (70, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.imwrite(file_path, img)
        filename = "suspicious_deepfake_image.jpg"
        media_type = "IMAGE"
    else:
        raise HTTPException(status_code=404, detail="Requested backend test sample not found")

    analysis_id = str(uuid.uuid4())
    evidence_id = f"EV-2026-{uuid.uuid4().hex[:6].upper()}"
    file_size = os.path.getsize(file_path)
    sha256_hash = calculate_sha256(file_path)

    metadata = extract_media_metadata(file_path, media_type)
    detector = DemoDetector()
    detector_results = detector.analyze(filename, media_type, metadata)

    ensemble = EnsembleEngine()
    aggregated = ensemble.aggregate(detector_results["detector_scores"], media_type)

    frames_data = extract_and_analyze_frames(
        analysis_id=analysis_id,
        file_path=file_path,
        media_type=media_type,
        is_suspicious_override=detector_results["is_suspicious"]
    )

    audio_info = analyze_audio_track(
        file_path=file_path,
        media_type=media_type,
        is_suspicious=detector_results["is_suspicious"]
    )

    analysis = Analysis(
        id=analysis_id,
        evidence_id=evidence_id,
        filename=filename,
        original_filename=filename,
        media_type=media_type,
        file_size_bytes=file_size,
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
        is_demo=True
    )
    db.add(analysis)

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

    evidence = EvidenceRecord(
        id=evidence_id,
        analysis_id=analysis_id,
        sha256=sha256_hash,
        original_filename=filename,
        media_type=media_type,
        model_version=detector.name,
        status="Active"
    )
    db.add(evidence)

    audit = AuditLog(
        user_email=current_user.email,
        action="BACKEND_SAMPLE_ANALYZED",
        details=f"Ran backend sample test for {filename}. Result: {aggregated['risk_level']} ({aggregated['authenticity_score']}/100)"
    )
    db.add(audit)

    db.commit()
    db.refresh(analysis)
    return analysis
