import React, { useState, useEffect } from 'react';
import { Upload, File, Film, Music, Image as ImageIcon, CheckCircle2, Loader2, Play, AlertCircle, Zap, ShieldAlert, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Analyze({ setCurrentPage, setSelectedAnalysisId }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [backendSamples, setBackendSamples] = useState([]);

  useEffect(() => {
    api.getBackendSamples().then((res) => setBackendSamples(res.data)).catch(() => {});
  }, []);

  const pipelineStages = [
    'File validation & SHA-256 integrity check',
    'Metadata & EXIF container extraction',
    'Media stream preprocessing & frame sampling',
    'Facial ROI boundary detection',
    'High-resolution frame extraction',
    'Facial artifact & skin texture frequency analysis',
    'Temporal 3D frame-to-frame consistency evaluation',
    'Audio acoustic spectral decomposition',
    'Phoneme-to-viseme lip-sync latency alignment',
    'Multi-model AI ensemble inference',
    'Evidence record aggregation & vault registration',
    'Final Risk & Authenticity Score calculation'
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg('');
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg('');
    setPipelineStep(0);

    for (let i = 0; i < pipelineStages.length; i++) {
      setPipelineStep(i);
      await new Promise((resolve) => setTimeout(resolve, 220));
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.analyzeMedia(formData);

      setSelectedAnalysisId(res.data.id);
      setIsProcessing(false);
      setCurrentPage('result');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to analyze file. Please check backend server status.');
      setIsProcessing(false);
    }
  };

  const startBackendSampleAnalysis = async (sampleId) => {
    setIsProcessing(true);
    setErrorMsg('');
    setPipelineStep(0);

    for (let i = 0; i < pipelineStages.length; i++) {
      setPipelineStep(i);
      await new Promise((resolve) => setTimeout(resolve, 220));
    }

    try {
      const res = await api.analyzeBackendSample(sampleId);
      setSelectedAnalysisId(res.data.id);
      setIsProcessing(false);
      setCurrentPage('result');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to analyze backend sample.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-mono text-slate-100">Upload & Analyze Media</h2>
        <p className="text-xs text-slate-400">
          Upload images, video containers, or audio tracks for deepfake & synthetic manipulation detection.
        </p>
      </div>

      {!isProcessing ? (
        <div className="space-y-6">
          {/* Quick Test with Backend Samples Banner */}
          <div className="p-5 bg-[#121620] border border-emerald-500/30 rounded-xl space-y-3 bg-emerald-500/5 shadow-lg font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Quick Test with Backend Suspicious Test Samples</span>
              </h3>
              <span className="text-[10px] text-slate-400">Instant Backend Analysis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => startBackendSampleAnalysis('suspicious_faceswap')}
                className="p-3 bg-[#0A0D14] border border-red-500/30 hover:border-red-500 rounded-lg text-left transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-red-400">
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Face Swap Video</span>
                  <span className="text-[10px] bg-red-500/20 px-1.5 py-0.2 rounded">~26% Auth</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Simulated AI face replacement video with frame boundary jitter.</p>
              </button>

              <button
                onClick={() => startBackendSampleAnalysis('authentic_baseline')}
                className="p-3 bg-[#0A0D14] border border-emerald-500/30 hover:border-emerald-500 rounded-lg text-left transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Baseline Camera</span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded">~95% Auth</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Clean genuine video camera recording baseline.</p>
              </button>

              <button
                onClick={() => startBackendSampleAnalysis('suspicious_deepfake_image')}
                className="p-3 bg-[#0A0D14] border border-amber-500/30 hover:border-amber-500 rounded-lg text-left transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Synthetic Image</span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">~28% Auth</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">AI-generated synthetic portrait image with spatial noise distortion.</p>
              </button>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[#1C2433] hover:border-emerald-500/50 bg-[#121620]/60 rounded-2xl p-10 text-center transition-all cursor-pointer space-y-4 group shadow-xl"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-sm shadow-emerald-500/10">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-mono text-slate-200">Drag & Drop Media Here</h3>
              <p className="text-xs text-slate-400 font-mono">
                Supports MP4, MOV, AVI, MKV, JPG, JPEG, PNG, WAV, MP3
              </p>
            </div>

            <div className="pt-2">
              <label className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/20 transition-all inline-block">
                Browse Files
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".mp4,.mov,.avi,.mkv,.webm,.jpg,.jpeg,.png,.webp,.wav,.mp3"
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex justify-center gap-6 text-[11px] font-mono text-slate-500 pt-4 border-t border-[#1C2433] max-w-md mx-auto">
              <span className="flex items-center gap-1"><Film className="w-3.5 h-3.5" /> Video (Max 150MB)</span>
              <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> Image (Max 20MB)</span>
              <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5" /> Audio (Max 30MB)</span>
            </div>
          </div>

          {/* Selected File Inspection Card */}
          {file && (
            <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 font-mono shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
                    <File className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Media file'}</p>
                  </div>
                </div>
                <button
                  onClick={startAnalysis}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Forensic Analysis</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        /* Processing Pipeline Progress Screen */
        <div className="p-8 bg-[#121620] border border-[#1C2433] rounded-2xl space-y-6 font-mono shadow-xl">
          <div className="text-center space-y-2">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">Executing Multi-Model Forensic Pipeline</h3>
            <p className="text-xs text-slate-400">Analyzing extracted feature representations & spatial-temporal matrices...</p>
          </div>

          {/* Pipeline Stage Checklist */}
          <div className="space-y-2 bg-[#0A0D14] p-6 rounded-xl border border-[#1C2433]">
            {pipelineStages.map((stage, idx) => {
              const isDone = idx < pipelineStep;
              const isCurrent = idx === pipelineStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-all ${
                    isDone
                      ? 'text-emerald-400 font-semibold'
                      : isCurrent
                      ? 'text-emerald-300 font-bold animate-pulse'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
