import React, { useEffect, useState } from 'react';
import { Download, Copy, Check, FileText, ArrowLeft, Shield, Cpu, Lock, Save, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import Timeline from '../components/Timeline';
import FrameViewer from '../components/FrameViewer';
import MultiFaceSelector from '../components/MultiFaceSelector';
import AudioWaveform from '../components/AudioWaveform';
import ExplainableAIPanel from '../components/ExplainableAIPanel';

export default function Result({ selectedAnalysisId, setCurrentPage, analystMode }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (!selectedAnalysisId) {
      api.getHistory({ limit: 1 }).then((res) => {
        if (res.data && res.data.length > 0) {
          fetchDetails(res.data[0].id);
        } else {
          setLoading(false);
        }
      });
      return;
    }
    fetchDetails(selectedAnalysisId);
  }, [selectedAnalysisId]);

  const fetchDetails = (id) => {
    setLoading(true);
    api.getAnalysisById(id)
      .then((res) => {
        setAnalysis(res.data);
        setNotes(res.data.analyst_notes || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const copySha256 = () => {
    if (analysis?.sha256) {
      navigator.clipboard.writeText(analysis.sha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const saveNotes = () => {
    if (!analysis?.id) return;
    setSavingNotes(true);
    api.updateNotes(analysis.id, notes)
      .then(() => {
        setSavingNotes(false);
      })
      .catch(() => setSavingNotes(false));
  };

  const downloadPdfReport = () => {
    if (!analysis?.id) return;
    window.open(api.getReportUrl(analysis.id), '_blank');
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4 font-mono">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading Forensic Evidence Artifacts...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-12 text-center space-y-4 font-mono">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <p className="text-sm font-bold text-slate-200">No Analysis Record Selected</p>
        <button
          onClick={() => setCurrentPage('analyze')}
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded text-xs"
        >
          Upload Media First
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#121620] border border-[#1C2433] rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('history')}
            className="p-2 rounded bg-[#0A0D14] border border-[#1C2433] text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">{analysis.evidence_id}</span>
              <span className="text-[10px] font-mono px-2 py-0.2 bg-[#0E121B] text-slate-400 rounded border border-[#1C2433]">
                {analysis.media_type}
              </span>
              {analysis.is_demo && (
                <span className="text-[10px] font-mono px-2 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-semibold">
                  DEMO MODE
                </span>
              )}
            </div>
            <h2 className="text-base font-bold font-mono text-slate-100">{analysis.original_filename}</h2>
          </div>
        </div>

        {/* Generate Forensic Report Action */}
        <button
          onClick={downloadPdfReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Generate Forensic PDF Report</span>
        </button>
      </div>

      {/* Main Authenticity Score Card */}
      <ScoreCard
        authenticityScore={analysis.authenticity_score}
        manipulationProbability={analysis.manipulation_probability}
        riskLevel={analysis.risk_level}
        confidence={analysis.confidence}
      />

      {/* Multi-Model Scores Grid */}
      <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase">
          Multi-Model Forensic Detector Scores
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
          {Object.entries(analysis.detector_scores || {}).map(([key, score]) => (
            <div key={key} className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433] space-y-1">
              <p className="text-[10px] text-slate-400 uppercase">{key.replace('_', ' ')}</p>
              <div className="flex items-baseline justify-between">
                <span className={`text-lg font-bold ${score < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {score}%
                </span>
                <span className="text-[9px] text-slate-500">Auth</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Timeline & Frame Inspection */}
      {analysis.frames && analysis.frames.length > 0 && (
        <>
          <Timeline
            frames={analysis.frames}
            selectedFrameIndex={selectedFrameIndex}
            setSelectedFrameIndex={setSelectedFrameIndex}
          />
          <FrameViewer
            frames={analysis.frames}
            selectedFrameIndex={selectedFrameIndex}
            setSelectedFrameIndex={setSelectedFrameIndex}
          />
        </>
      )}

      {/* Multi-Face & Audio Forensics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultiFaceSelector faces={analysis.multi_face_info} />
        <AudioWaveform audioInfo={analysis.audio_info} />
      </div>

      {/* Explainable AI & Technical Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExplainableAIPanel
          explanations={analysis.explanations}
          likelyTechnique={analysis.likely_technique}
          techniqueConfidence={analysis.technique_confidence}
        />

        {/* Metadata & File Integrity */}
        <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 font-mono shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>File Integrity & Container Metadata</span>
          </h3>

          {/* SHA-256 Hash Card */}
          <div className="bg-[#0A0D14] p-3 rounded-lg border border-[#1C2433] space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>SHA-256 CHECKSUM</span>
              <button
                onClick={copySha256}
                className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 font-mono break-all font-semibold">{analysis.sha256}</p>
          </div>

          {/* Metadata Table */}
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-[#1C2433]">
              <span className="text-slate-400">Resolution:</span>
              <span className="font-bold">{analysis.resolution}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C2433]">
              <span className="text-slate-400">Codec / Format:</span>
              <span>{analysis.codec}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C2433]">
              <span className="text-slate-400">Duration:</span>
              <span>{analysis.duration_seconds}s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C2433]">
              <span className="text-slate-400">Software Signature:</span>
              <span>{analysis.metadata_info?.creation_software || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Notes Box (Analyst Mode) */}
      {analystMode && (
        <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-3 font-mono shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 uppercase">Analyst Investigation Notes</h3>
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type forensic analyst notes, chain-of-custody logs, or verification details..."
            rows={4}
            className="w-full bg-[#0A0D14] border border-[#1C2433] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      )}
    </div>
  );
}
