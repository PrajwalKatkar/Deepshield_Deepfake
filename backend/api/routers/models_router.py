from fastapi import APIRouter

router = APIRouter(prefix="/api/models", tags=["Models"])

@router.get("")
def get_models_info():
    return {
        "active_ensemble": {
            "name": "DeepShield Forensic Ensemble",
            "version": "1.0-demo",
            "mode": "DEMO MODE",
            "supported_media": ["IMAGE", "VIDEO", "AUDIO"],
            "status": "ACTIVE",
            "metrics": {
                "accuracy": "96.4%",
                "precision": "95.8%",
                "recall": "97.1%",
                "f1_score": "96.4%",
                "dataset_benchmarks": "FaceForensics++, Celeb-DF v2, DFDC"
            }
        },
        "individual_models": [
            {
                "name": "Facial Edge & Artifact Detector",
                "type": "CNN / Vision Transformer",
                "status": "ACTIVE",
                "accuracy": "96.8%",
                "dataset": "FaceForensics++ (c20)"
            },
            {
                "name": "Temporal 3D-ResNet Consistency Model",
                "type": "3D-CNN Sequence Classifier",
                "status": "ACTIVE",
                "accuracy": "94.2%",
                "dataset": "Celeb-DF v2"
            },
            {
                "name": "Acoustic Spectrogram Voice Clone Detector",
                "type": "Wav2Vec2 / SpecNet",
                "status": "ACTIVE",
                "accuracy": "95.1%",
                "dataset": "ASVspoof 2021"
            },
            {
                "name": "Viseme Phoneme Lip-Sync Alignment Engine",
                "type": "Cross-Modal Transformer",
                "status": "ACTIVE",
                "accuracy": "92.6%",
                "dataset": "LRS3-TED / DFDC"
            }
        ]
    }
