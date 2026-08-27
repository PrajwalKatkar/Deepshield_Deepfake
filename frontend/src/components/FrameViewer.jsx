import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Flame, AlertCircle, Sparkles } from 'lucide-react';

export default function FrameViewer({ frames, selectedFrameIndex, setSelectedFrameIndex }) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!frames || frames.length === 0) return null;
  const currentFrame = frames[selectedFrameIndex] || frames[0];

  const handlePrev = () => {
    if (selectedFrameIndex > 0) setSelectedFrameIndex(selectedFrameIndex - 1);
  };

  const handleNext = () => {
    if (selectedFrameIndex < frames.length - 1) setSelectedFrameIndex(selectedFrameIndex + 1);
  };

  return (
    <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 shadow-lg">
      {/* Viewer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">FRAME INSPECTION</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              Frame #{currentFrame.frame_number} ({currentFrame.timestamp_str})
            </span>
          </div>
          <h3 className="text-base font-bold font-mono text-slate-100 mt-0.5">
            Suspicion Rating: <span className={currentFrame.is_suspicious ? 'text-red-400' : 'text-emerald-400'}>{currentFrame.suspicion_score}%</span>
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#0A0D14] p-1 rounded-lg border border-[#1C2433]">
          <button
            onClick={() => setShowHeatmap(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              !showHeatmap ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Processed Frame</span>
          </button>
          <button
            onClick={() => setShowHeatmap(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              showHeatmap ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Manipulation Heatmap</span>
          </button>
        </div>
      </div>

      {/* Frame Preview Display Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 relative bg-[#0A0D14] rounded-lg overflow-hidden border border-[#1C2433] min-h-[280px] flex items-center justify-center group">
          <img
            src={showHeatmap && currentFrame.heatmap_url ? currentFrame.heatmap_url : currentFrame.image_url}
            alt={`Frame ${currentFrame.frame_number}`}
            className="max-h-[380px] w-full object-contain"
          />

          {/* Previous / Next Frame Buttons */}
          <button
            onClick={handlePrev}
            disabled={selectedFrameIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#121620]/80 hover:bg-[#121620] text-slate-200 disabled:opacity-30 border border-[#1C2433] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={selectedFrameIndex === frames.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#121620]/80 hover:bg-[#121620] text-slate-200 disabled:opacity-30 border border-[#1C2433] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Mode Tag */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#0E121B]/90 backdrop-blur-md rounded border border-[#1C2433] text-[10px] font-mono text-slate-300">
            {showHeatmap ? 'JET Gradient Model Attribution Heatmap' : 'Facial ROI Bounding Box Overlay'}
          </div>
        </div>

        {/* Frame Anomalies Card */}
        <div className="space-y-4 bg-[#0A0D14]/70 p-4 rounded-lg border border-[#1C2433]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>DETECTED ANOMALIES IN ROI</span>
          </div>

          {currentFrame.detected_anomalies && currentFrame.detected_anomalies.length > 0 ? (
            <ul className="space-y-2">
              {currentFrame.detected_anomalies.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-[#121620] p-2.5 rounded border border-[#1C2433] font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-xs font-mono text-emerald-400 bg-emerald-500/5 rounded border border-emerald-500/20">
              ✓ Zero visual manipulation anomalies identified in this frame region.
            </div>
          )}

          <div className="p-3 bg-[#0E121B] rounded border border-[#1C2433] space-y-1 text-[11px] text-slate-400 font-mono">
            <p className="font-semibold text-slate-300">Forensic Heatmap Guidance:</p>
            <p>Red/Yellow zones indicate high-loss facial boundary gradients evaluated by the ensemble vision model.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
