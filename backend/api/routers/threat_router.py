from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import Analysis

router = APIRouter(prefix="/api/threat-intel", tags=["Threat Intelligence"])

@router.get("")
def get_threat_intel_stats(db: Session = Depends(get_db)):
    total = db.query(Analysis).count()
    if total == 0:
        # Initial benchmark metrics
        total = 4832
        authentic = 3120
        suspicious = 1712
        techniques = [
            {"name": "Face Swap", "percentage": 42},
            {"name": "AI Generated (Diffusion/GAN)", "percentage": 27},
            {"name": "Face Reenactment", "percentage": 18},
            {"name": "Voice Cloning (Audio)", "percentage": 8},
            {"name": "Other / Neural Rendering", "percentage": 5}
        ]
        activity_over_time = [
            {"date": "Mon", "authentic": 420, "suspicious": 180},
            {"date": "Tue", "authentic": 510, "suspicious": 240},
            {"date": "Wed", "authentic": 480, "suspicious": 310},
            {"date": "Thu", "authentic": 610, "suspicious": 290},
            {"date": "Fri", "authentic": 580, "suspicious": 410},
            {"date": "Sat", "authentic": 320, "suspicious": 160},
            {"date": "Sun", "authentic": 200, "suspicious": 122}
        ]
    else:
        suspicious = db.query(Analysis).filter(Analysis.authenticity_score <= 50.0).count()
        authentic = total - suspicious
        techniques = [
            {"name": "Face Swap", "percentage": 45},
            {"name": "Face Reenactment", "percentage": 25},
            {"name": "Voice Clone", "percentage": 15},
            {"name": "AI Generated", "percentage": 15}
        ]
        activity_over_time = [
            {"date": "Recent", "authentic": authentic, "suspicious": suspicious}
        ]

    return {
        "total_analyzed": total,
        "authentic_files": authentic,
        "suspicious_files": suspicious,
        "deepfakes_detected": suspicious,
        "average_confidence": "94.2%",
        "techniques_breakdown": techniques,
        "activity_over_time": activity_over_time,
        "is_demo_feed": True,
        "feed_source": "DeepShield Global Threat Telemetry (Demo Feed)"
    }
