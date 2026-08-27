import os
import cv2
import numpy as np
from pathlib import Path
from backend.config import UPLOAD_DIR

def generate_backend_sample_video(sample_type: str = "suspicious_faceswap") -> str:
    samples_dir = UPLOAD_DIR / "test_samples"
    os.makedirs(samples_dir, exist_ok=True)
    
    filename = f"{sample_type}_video.mp4"
    file_path = samples_dir / filename
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(str(file_path), fourcc, 30.0, (640, 480))
    
    is_fake = "suspicious" in sample_type or "fake" in sample_type
    
    for i in range(120): # 4 seconds at 30fps
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # Grid lines
        for y in range(0, 480, 40):
            cv2.line(frame, (0, y), (640, y), (15, 20, 30), 1)
            
        if is_fake:
            jitter_x = int(np.sin(i * 0.4) * 10)
            jitter_y = int(np.cos(i * 0.4) * 8)
            cv2.rectangle(frame, (200 + jitter_x, 100 + jitter_y), (440 + jitter_x, 340 + jitter_y), (0, 0, 255), 2)
            cv2.putText(frame, "DEEPSHIELD BACKEND SAMPLE: SUSPICIOUS FACE SWAP", (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 255), 2)
            cv2.putText(frame, f"Frame #{i} - Temporal Discontinuity Spike", (170, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
            
            cv2.circle(frame, (280 + jitter_x, 180 + jitter_y), 20, (180, 180, 220), -1)
            cv2.circle(frame, (360 + jitter_x, 180 + jitter_y), 20, (180, 180, 220), -1)
            cv2.ellipse(frame, (320 + jitter_x, 260 + jitter_y), (45, 25), 0, 0, 180, (100, 100, 255), 3)
        else:
            cv2.rectangle(frame, (200, 100), (440, 340), (0, 255, 0), 1)
            cv2.putText(frame, "DEEPSHIELD BACKEND SAMPLE: AUTHENTIC BASELINE", (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 0), 2)
            cv2.putText(frame, f"Frame #{i} - Smooth Continuous Motion", (180, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 1)
            
            cv2.circle(frame, (280, 180), 20, (200, 200, 200), -1)
            cv2.circle(frame, (360, 180), 20, (200, 200, 200), -1)
            cv2.ellipse(frame, (320, 260), (40, 20), 0, 0, 180, (200, 200, 200), 2)
            
        out.write(frame)
        
    out.release()
    return str(file_path)
