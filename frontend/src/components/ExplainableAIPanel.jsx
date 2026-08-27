import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileText, AlertCircle, ShieldAlert } from 'lucide-react';

export default function ExplainableAIPanel({ explanations, likelyTechnique, techniqueConfidence }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wide">
            Explainable AI Forensic Findings
          </h3>
        </div>
        {likelyTechnique && likelyTechnique !== 'None Detected' && (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Likely Technique: {likelyTechnique} ({techniqueConfidence}%)
          </span>
        )}
      </div>

      {/* Flagged Reasons List */}
      <div className="space-y-3 font-mono">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          WHY THIS MEDIA WAS FLAGGED ({explanations ? explanations.length : 0} EVIDENCE ARTIFACTS)
        </h4>

        {explanations && explanations.length > 0 ? (
          <div className="space-y-2">
            {explanations.map((item, idx) => (
              <div key={idx} className="bg-[#0A0D14] p-3 rounded-lg border border-[#1C2433] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#1C2433] flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                      {idx + 1}
                    </span>
                    {item.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    item.confidence === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.confidence} Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 text-center font-semibold">
            ✓ No suspicious neural artifacts or frame anomalies identified.
          </div>
        )}
      </div>

      {/* Expandable Technical AI Section */}
      <div className="pt-2 border-t border-[#1C2433]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 py-1"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>How the AI reached this conclusion</span>
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mt-3 p-4 bg-[#0A0D14] rounded-lg border border-[#1C2433] text-xs font-mono text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-200">1. Feature Extraction:</strong> Uploaded frames undergo face landmark tracking, spatial frequency decomposition (FFT), optical flow vector field calculation, and acoustic spectral estimation.
            </p>
            <p>
              <strong className="text-slate-200">2. Multi-Model Inference:</strong> High-dimensional embeddings are analyzed in parallel by facial boundary autoencoders, 3D-CNN temporal sequence classifiers, and voice synthesis detectors.
            </p>
            <p>
              <strong className="text-slate-200">3. Ensemble Weighted Fusion:</strong> Predictions are weighted across spatial, temporal, acoustic, and container metadata domains to produce a normalized 0–100 Authenticity Score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
