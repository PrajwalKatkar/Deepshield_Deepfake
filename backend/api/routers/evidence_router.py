from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import EvidenceRecord, Analysis

router = APIRouter(prefix="/api/evidence", tags=["Evidence Vault"])

@router.get("")
def get_evidence_vault(
    q: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(EvidenceRecord)
    if q:
        query = query.filter(
            (EvidenceRecord.id.ilike(f"%{q}%")) |
            (EvidenceRecord.sha256.ilike(f"%{q}%")) |
            (EvidenceRecord.original_filename.ilike(f"%{q}%"))
        )
    records = query.order_by(EvidenceRecord.uploaded_at.desc()).limit(limit).all()
    
    output = []
    for r in records:
        analysis = db.query(Analysis).filter(Analysis.id == r.analysis_id).first()
        output.append({
            "evidence_id": r.id,
            "analysis_id": r.analysis_id,
            "sha256": r.sha256,
            "original_filename": r.original_filename,
            "media_type": r.media_type,
            "model_version": r.model_version,
            "status": r.status,
            "uploaded_at": r.uploaded_at,
            "risk_level": analysis.risk_level if analysis else "Unknown",
            "authenticity_score": analysis.authenticity_score if analysis else 0.0
        })
    return output
