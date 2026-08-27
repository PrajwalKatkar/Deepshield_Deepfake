import React from 'react';
import { Film, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Timeline({ frames, selectedFrameIndex, setSelectedFrameIndex }) {
  if (!frames || frames.length === 0) return null;

  return (
    <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wide">
            Video Frame-by-Frame Timeline
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Nominal Region
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Suspicious Region
          </span>
        </div>
      </div>

      {/* Frame Scrubber Bar */}
      <div className="relative pt-2 pb-6">
        <div className="h-3 w-full bg-[#0A0D14] rounded-full flex overflow-hidden border border-[#1C2433]">
          {frames.map((frame, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFrameIndex(idx)}
              className={`h-full flex-1 cursor-pointer transition-all ${
                frame.is_suspicious ? 'bg-red-500 hover:bg-red-400' : 'bg-emerald-500 hover:bg-emerald-400'
              } ${selectedFrameIndex === idx ? 'ring-2 ring-white z-10' : 'opacity-80'}`}
              title={`Frame #${frame.frame_number} (${frame.timestamp_str}) - Suspicion: ${frame.suspicion_score}%`}
            />
          ))}
        </div>

        {/* Selected Frame Indicator Arrow */}
        {selectedFrameIndex !== null && (
          <div
            className="absolute bottom-0 transform -translate-x-1/2 flex flex-col items-center transition-all"
            style={{ left: `${((selectedFrameIndex + 0.5) / frames.length) * 100}%` }}
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
              {frames[selectedFrameIndex]?.timestamp_str}
            </span>
          </div>
        )}
      </div>

      {/* Frame Thumbnail Reel */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
        {frames.map((frame, idx) => {
          const isSelected = selectedFrameIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedFrameIndex(idx)}
              className={`flex-shrink-0 w-24 rounded-lg overflow-hidden border transition-all text-left relative group ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'border-[#1C2433] hover:border-slate-600'
              }`}
            >
              <div className="h-14 bg-[#0A0D14] relative overflow-hidden">
                <img
                  src={frame.image_url}
                  alt={`Frame ${frame.frame_number}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span
                  className={`absolute top-1 right-1 px-1 py-0.2 text-[9px] font-mono font-bold rounded ${
                    frame.is_suspicious ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {frame.suspicion_score}%
                </span>
              </div>
              <div className="p-1.5 bg-[#0E121B] flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>#{frame.frame_number}</span>
                <span>{frame.timestamp_str}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
