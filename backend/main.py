from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import STATIC_DIR, REPORTS_DIR
from backend.database.database import engine, Base
from backend.api.routers import (
    auth_router,
    analyze_router,
    history_router,
    evidence_router,
    compare_router,
    threat_router,
    models_router,
    audit_router,
    samples_router
)

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DeepShield AI Forensic Platform API",
    description="REST API for DeepShield Deepfake & Synthetic Media Detection Platform",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file directories for frames and PDF reports
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(auth_router.router)
app.include_router(analyze_router.router)
app.include_router(history_router.router)
app.include_router(evidence_router.router)
app.include_router(compare_router.router)
app.include_router(threat_router.router)
app.include_router(models_router.router)
app.include_router(audit_router.router)
app.include_router(samples_router.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "DeepShield AI Forensic Platform",
        "version": "1.0.0",
        "demo_mode": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
