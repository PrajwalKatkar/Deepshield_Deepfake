from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import Analysis
from backend.schemas.schemas import ComparisonRequest

router = APIRouter(prefix="/api/compare", tags=["Comparison Mode"])

@router.post("")
def compare_analyses(body: ComparisonRequest, db: Session = Depends(get_db)):
    media_a = db.query(Analysis).filter(Analysis.id == body.video_a_id).first()
    if not media_a:
        media_a = db.query(Analysis).filter(Analysis.evidence_id == body.video_a_id).first()
        
    media_b = db.query(Analysis).filter(Analysis.id == body.video_b_id).first()
    if not media_b:
        media_b = db.query(Analysis).filter(Analysis.evidence_id == body.video_b_id).first()
        
    if not media_a or not media_b:
        raise HTTPException(status_code=404, detail="One or both media items for comparison were not found")
        
    scores_a = media_a.detector_scores or {}
    scores_b = media_b.detector_scores or {}
    
    deltas = {
        "face": round(scores_a.get("face", 0) - scores_b.get("face", 0), 1),
        "temporal": round(scores_a.get("temporal", 0) - scores_b.get("temporal", 0), 1),
        "audio": round(scores_a.get("audio", 0) - scores_b.get("audio", 0), 1),
        "lip_sync": round(scores_a.get("lip_sync", 0) - scores_b.get("lip_sync", 0), 1),
        "overall": round(media_a.authenticity_score - media_b.authenticity_score, 1)
    }
    
    return {
        "media_a": {
            "id": media_a.id,
            "filename": media_a.original_filename,
            "authenticity_score": media_a.authenticity_score,
            "manipulation_probability": media_a.manipulation_probability,
            "risk_level": media_a.risk_level,
            "scores": scores_a,
            "sha256": media_a.sha256
        },
        "media_b": {
            "id": media_b.id,
            "filename": media_b.original_filename,
            "authenticity_score": media_b.authenticity_score,
            "manipulation_probability": media_b.manipulation_probability,
            "risk_level": media_b.risk_level,
            "scores": scores_b,
            "sha256": media_b.sha256
        },
        "deltas": deltas,
        "verdict": f"Media B shows {abs(deltas['overall'])}% higher manipulation anomaly than Media A." if deltas['overall'] > 0 else "Media A and B show comparable authentic profiles."
    }
