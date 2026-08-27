import React from 'react';
import { Shield, Search, ArrowRight, Eye, Cpu, FileCheck, Layers, Lock, BarChart3 } from 'lucide-react';

export default function Landing({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-between select-none">
      {/* Hero Section Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-[#1C2433] bg-[#0E121B]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-100 tracking-wide font-mono">DEEPSHIELD</h1>
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono font-semibold">Matrix SOC Forensics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-2 rounded hover:bg-[#121620] transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('analyze')}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Analyze Media</span>
          </button>
        </div>
      </header>

      {/* Main Hero Banner */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>MATRIX SOC AI DIGITAL FORENSICS & DEEPFAKE DETECTION</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-mono tracking-tight text-white leading-tight">
            DETECT WHAT'S REAL.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              AI-POWERED SYNTHETIC MEDIA ANALYSIS
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed font-sans">
            Analyze images, videos, and audio streams for signs of AI manipulation, face replacement, neural synthesis, voice cloning, and temporal anomalies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('analyze')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
            >
              <span>Analyze Media Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121620] hover:bg-[#1C2433] border border-[#1C2433] text-slate-200 font-mono text-sm transition-all"
            >
              <span>Explore Platform</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#121620] border border-[#1C2433] space-y-3 shadow-lg">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 w-fit">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">Multi-Model Vision Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect facial boundary discrepancies, skin texture frequency anomalies, temporal optical flow spikes, and eye reflection artifacts across video frames.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#121620] border border-[#1C2433] space-y-3 shadow-lg">
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">Audio & Lip-Sync Forensics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine voice acoustic spectral energy distribution to detect voice cloning, and verify phoneme-to-viseme mouth synchrony latency.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#121620] border border-[#1C2433] space-y-3 shadow-lg">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 w-fit">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">Forensic PDF Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate official, evidence-grade PDF forensic reports complete with SHA-256 integrity hash verification, explainable AI findings, and timelines.
            </p>
          </div>
        </div>

        {/* Workflow Strip */}
        <div className="p-8 rounded-2xl bg-[#121620] border border-[#1C2433] space-y-4 text-center shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">CORE FORENSIC WORKFLOW</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300">
            <span className="px-3 py-1.5 rounded bg-[#0A0D14] border border-[#1C2433]">1. UPLOAD MEDIA</span>
            <span className="text-emerald-400">→</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0D14] border border-[#1C2433]">2. PRE-PROCESSING</span>
            <span className="text-emerald-400">→</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0D14] border border-[#1C2433]">3. ENSEMBLE AI INFERENCE</span>
            <span className="text-emerald-400">→</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0D14] border border-[#1C2433]">4. FORENSIC REPORT</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-[#1C2433] bg-[#0E121B] text-center text-xs font-mono text-slate-500">
        DeepShield AI Media Forensics Platform &copy; 2026. Designed for Cybersecurity Professionals & Digital Investigators.
      </footer>
    </div>
  );
}
