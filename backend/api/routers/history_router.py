from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import Analysis
from backend.schemas.schemas import AnalysisResponse

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("", response_model=List[AnalysisResponse])
def get_analysis_history(
    q: Optional[str] = None,
    media_type: Optional[str] = None,
    risk: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Analysis)
    if q:
        query = query.filter(
            (Analysis.original_filename.ilike(f"%{q}%")) |
            (Analysis.evidence_id.ilike(f"%{q}%")) |
            (Analysis.sha256.ilike(f"%{q}%"))
        )
    if media_type and media_type != "ALL":
        query = query.filter(Analysis.media_type == media_type.upper())
    if risk and risk != "ALL":
        query = query.filter(Analysis.risk_level.ilike(f"%{risk}%"))
        
    results = query.order_by(Analysis.created_at.desc()).limit(limit).all()
    return results

@router.delete("/{id}")
def delete_analysis_record(id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Analysis record deleted"}
