# 🛡️ DeepShield — Deepfake & Synthetic Media Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4.svg)](https://tailwindcss.com/)
[![OpenCV](https://img.shields.io/badge/Computer_Vision-OpenCV_4-5C3EE8.svg)](https://opencv.org/)

**DeepShield** is an enterprise-grade AI digital forensics and cybersecurity platform designed to analyze images, video containers, and audio streams for deepfakes, face manipulation, neural synthesis, voice cloning, temporal inconsistencies, and container metadata anomalies.

---

## ✨ Key Features

- **🛡️ Authenticity Score Gauge & Risk Banner**: Evaluates media on a 0–100 scale (*Highly Suspicious, Suspicious, Uncertain, Probably Authentic, Highly Authentic*).
- **🔬 Multi-Model Forensic Ensemble Engine**: Aggregates Facial ROI Edge Detectors, 3D-CNN Temporal Sequence Models, Acoustic Spectrogram Voice Clone Detectors, Lip-Sync Alignment Engines, and Container Metadata Integrity.
- **🎞️ Interactive Video Frame Timeline**: Frame-by-frame scrubber with color-coded suspicious markers (green/red) and reel thumbnails.
- **🔥 Suspicious Frame & Heatmap Overlay Viewer**: Toggle between processed original frames and JET colormap attribution heatmaps highlighting facial ROI anomalies.
- **👥 Multi-Face Detection**: Evaluates individual manipulation probabilities for multiple detected persons in a single video.
- **🔊 Audio & Lip-Sync Forensics**: Spectral voice cloning probability, viseme-to-phoneme latency alignment, waveform visualizers, and suspicious timestamp markers.
- **📄 Evidence-Grade PDF Report Generator**: Powered by ReportLab, producing official forensic reports with SHA-256 integrity checksums, score tables, explainable AI findings, and legal disclaimers.
- **⚔️ Side-by-Side Video Comparison Mode**: Compares a known original baseline against a suspected video with score delta metrics and verdict summaries.
- **📦 Secure Evidence Vault**: Cryptographically verifiable evidence table storing Evidence IDs (`EV-2026-XXXXXX`), SHA-256 hashes, model versions, and timestamps.
- **💡 Explainable AI Panel**: Itemized *"Why this media was flagged"* evidence findings with technical methodology breakdowns.

---

## 🛠️ System Architecture

```text
deepshield/
├── backend/
│   ├── api/routers/        # REST API endpoints (auth, analyze, history, evidence, compare, threat, models, audit, samples)
│   ├── auth/               # JWT authentication & passlib sha256_crypt security
│   ├── database/           # SQLAlchemy models & SQLite database session management
│   ├── detectors/          # Ensemble engine & BaseDetector interface (DemoDetector & RealDeepfakeDetector)
│   ├── forensic/           # OpenCV frame extraction, jet heatmaps, EXIF extractor, SHA-256, audio forensics
│   ├── reports/            # ReportLab PDF report generator
│   ├── main.py             # FastAPI entrypoint (http://127.0.0.1:8000)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI components (Sidebar, Header, ScoreCard, Timeline, FrameViewer, MultiFace, AudioWaveform, ExplainableAI)
│   │   ├── pages/          # Full pages (Landing, Dashboard, Analyze, Result, Compare, EvidenceVault, History, ThreatIntel, Models, AuditSettings)
│   │   ├── services/       # Axios API client
│   │   └── App.jsx
│   ├── vite.config.js      # React Vite dev server (http://localhost:3000)
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **VS Code** (recommended)

---

### Step 1: Clone or Open in VS Code

Open terminal and navigate to the project folder:
```bash
code C:\Users\ppkat\.gemini\antigravity\scratch\deepshield
```

---

### Step 2: Setup & Run Backend (FastAPI)

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt email-validator

# Launch backend server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API Docs will be available at:* **http://127.0.0.1:8000/docs**

---

### Step 3: Setup & Run Frontend (React + Vite)

Open a new terminal tab:
```bash
cd frontend

# Install Node dependencies
npm install

# Launch React dev server
npm run dev
```
*Web Application will be available at:* **http://localhost:3000/**

---

## 🐙 How to Push to GitHub

Run these commands in your VS Code terminal to push to your GitHub repository:

```bash
# 1. Navigate to the project root directory
cd C:\Users\ppkat\.gemini\antigravity\scratch\deepshield

# 2. Initialize git repository
git init

# 3. Add all project files
git add .

# 4. Create initial commit
git commit -m "Initial commit: DeepShield Deepfake & Synthetic Media Detection Platform"

# 5. Link your GitHub repository (Replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/deepshield.git

# 6. Set main branch and push
git branch -M main
git push -u origin main
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
