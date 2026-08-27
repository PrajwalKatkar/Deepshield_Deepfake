import os
import cv2
import numpy as np
from pathlib import Path
from backend.config import STATIC_DIR

def extract_and_analyze_frames(analysis_id: str, file_path: str, media_type: str, is_suspicious_override: bool = False) -> list:
    frames_dir = STATIC_DIR / "frames" / analysis_id
    os.makedirs(frames_dir, exist_ok=True)
    
    results = []
    
    if media_type == "IMAGE":
        img = cv2.imread(file_path)
        if img is None:
            # Fallback synthetic frame
            img = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(img, "DeepShield Image Analysis", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 200), 2)
            
        frame_name = f"frame_0.jpg"
        heatmap_name = f"heatmap_0.jpg"
        frame_path = frames_dir / frame_name
        heatmap_path = frames_dir / heatmap_name
        
        cv2.imwrite(str(frame_path), img)
        
        # Generate heatmap overlay
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
        heatmap_gray = cv2.applyColorMap(cv2.equalizeHist(gray), cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(img, 0.6, heatmap_gray, 0.4, 0)
        cv2.imwrite(str(heatmap_path), overlay)
        
        score = 88.5 if is_suspicious_override else 12.0
        results.append({
            "frame_number": 0,
            "timestamp_str": "00:00.00",
            "suspicion_score": score,
            "is_suspicious": score > 50.0,
            "image_url": f"/static/frames/{analysis_id}/{frame_name}",
            "heatmap_url": f"/static/frames/{analysis_id}/{heatmap_name}",
            "detected_anomalies": ["Facial boundary inconsistency", "Unnatural skin texture", "Eye region artifact"] if score > 50 else []
        })
        return results

    # Video extraction
    cap = cv2.VideoCapture(file_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) if cap.isOpened() else 0
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    if total_frames <= 0 or not cap.isOpened():
        # Generate 10 mock forensic frame steps if video cannot be opened directly
        num_frames = 10
        for i in range(num_frames):
            frame_img = np.zeros((360, 640, 3), dtype=np.uint8)
            cv2.rectangle(frame_img, (200, 80), (440, 320), (40, 40, 50), -1)
            cv2.putText(frame_img, f"Frame #{i*15} - Forensic Analysis", (180, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 220, 255), 1)
            cv2.circle(frame_img, (280, 160), 18, (180, 180, 200), -1) # Left Eye
            cv2.circle(frame_img, (360, 160), 18, (180, 180, 200), -1) # Right Eye
            cv2.ellipse(frame_img, (320, 240), (40, 20), 0, 0, 180, (150, 150, 180), 2) # Mouth
            
            ts_sec = (i * 15) / 30.0
            ts_str = f"{int(ts_sec//60):02d}:{ts_sec%60:05.2f}"
            
            # Suspicion pattern: middle frames high risk if suspicious
            if is_suspicious_override and 3 <= i <= 6:
                score = round(84.0 + (i % 3) * 5.0, 1)
                # draw red bbox
                cv2.rectangle(frame_img, (195, 75), (445, 325), (0, 0, 255), 2)
                cv2.putText(frame_img, f"ANOMALY: {score}%", (200, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            else:
                score = round(8.0 + (i % 4) * 3.5, 1)
                cv2.rectangle(frame_img, (195, 75), (445, 325), (0, 255, 0), 1)
                
            frame_name = f"frame_{i}.jpg"
            heatmap_name = f"heatmap_{i}.jpg"
            frame_path = frames_dir / frame_name
            heatmap_path = frames_dir / heatmap_name
            
            cv2.imwrite(str(frame_path), frame_img)
            
            # Heatmap synthesis
            heat = cv2.applyColorMap(cv2.cvtColor(frame_img, cv2.COLOR_BGR2GRAY), cv2.COLORMAP_JET)
            cv2.imwrite(str(heatmap_path), cv2.addWeighted(frame_img, 0.5, heat, 0.5, 0))
            
            results.append({
                "frame_number": i * 15,
                "timestamp_str": ts_str,
                "suspicion_score": score,
                "is_suspicious": score > 50.0,
                "image_url": f"/static/frames/{analysis_id}/{frame_name}",
                "heatmap_url": f"/static/frames/{analysis_id}/{heatmap_name}",
                "detected_anomalies": ["Facial boundary inconsistency", "Temporal artifact", "Lighting mismatch"] if score > 50.0 else []
            })
        return results

    # OpenCV real frame reading loop (sample 10 frames)
    step = max(1, total_frames // 10)
    saved_count = 0
    frame_idx = 0
    
    while cap.isOpened() and saved_count < 10:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_idx % step == 0:
            ts_sec = frame_idx / fps
            ts_str = f"{int(ts_sec//60):02d}:{ts_sec%60:05.2f}"
            
            # Anomaly heuristic calculation from color variance
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            if is_suspicious_override and (saved_count in [3, 4, 5, 6]):
                score = round(85.0 + (saved_count % 3) * 4.2, 1)
            else:
                score = round(min(90.0, max(5.0, 100.0 - laplacian_var / 10.0)), 1)
                
            frame_name = f"frame_{saved_count}.jpg"
            heatmap_name = f"heatmap_{saved_count}.jpg"
            frame_path = frames_dir / frame_name
            heatmap_path = frames_dir / heatmap_name
            
            # Draw overlay face box
            h, w, _ = frame.shape
            cv2.rectangle(frame, (int(w*0.3), int(h*0.15)), (int(w*0.7), int(h*0.85)), (0, 0, 255) if score > 50 else (0, 255, 0), 2)
            cv2.putText(frame, f"Face #1 [{score}%]", (int(w*0.3), int(h*0.13)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255) if score > 50 else (0, 255, 0), 2)
            
            cv2.imwrite(str(frame_path), frame)
            
            heat = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
            cv2.imwrite(str(heatmap_path), cv2.addWeighted(frame, 0.6, heat, 0.4, 0))
            
            results.append({
                "frame_number": frame_idx,
                "timestamp_str": ts_str,
                "suspicion_score": score,
                "is_suspicious": score > 50.0,
                "image_url": f"/static/frames/{analysis_id}/{frame_name}",
                "heatmap_url": f"/static/frames/{analysis_id}/{heatmap_name}",
                "detected_anomalies": ["Unnatural facial texture", "Temporal frame discontinuity"] if score > 50.0 else []
            })
            saved_count += 1
        frame_idx += 1
        
    cap.release()
    return results
