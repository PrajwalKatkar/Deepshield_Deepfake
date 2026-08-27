import random
import math

def analyze_audio_track(file_path: str, media_type: str, is_suspicious: bool = False) -> dict:
    if media_type == "IMAGE":
        return {
            "has_audio": False,
            "voice_authenticity": 100.0,
            "synthetic_probability": 0.0,
            "lip_sync_consistency": 100.0,
            "suspicious_audio_timestamps": [],
            "spectral_anomalies": [],
            "waveform_samples": []
        }

    # Generate synthetic waveform data (30 points) for visualization
    waveform = []
    for i in range(30):
        val = math.sin(i * 0.4) * 0.7 + (random.random() - 0.5) * 0.3
        waveform.append(round(abs(val), 3))

    if is_suspicious:
        voice_auth = round(random.uniform(18.0, 32.0), 1)
        synth_prob = round(100.0 - voice_auth, 1)
        lip_sync = round(random.uniform(28.0, 42.0), 1)
        timestamps = ["00:04 - 00:08", "00:14 - 00:19"]
        anomalies = [
            "Voice clone spectral discontinuity detected between 1.2 kHz - 3.4 kHz",
            "Phoneme-to-viseme lip sync latency mismatch (> 140ms)",
            "Unnatural acoustic reverberation decay in voice fundamental frequency (F0)"
        ]
    else:
        voice_auth = round(random.uniform(88.0, 96.0), 1)
        synth_prob = round(100.0 - voice_auth, 1)
        lip_sync = round(random.uniform(90.0, 98.0), 1)
        timestamps = []
        anomalies = []

    return {
        "has_audio": True,
        "voice_authenticity": voice_auth,
        "synthetic_probability": synth_prob,
        "lip_sync_consistency": lip_sync,
        "suspicious_audio_timestamps": timestamps,
        "spectral_anomalies": anomalies,
        "waveform_samples": waveform
    }
