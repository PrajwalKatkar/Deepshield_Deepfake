import React from 'react';
import { Volume2, Mic, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function AudioWaveform({ audioInfo }) {
  if (!audioInfo || !audioInfo.has_audio) {
    return (
      <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 text-center text-xs font-mono text-slate-400">
        No active audio stream detected in container.
      </div>
    );
  }

  const { voice_authenticity, synthetic_probability, lip_sync_consistency, suspicious_audio_timestamps, spectral_anomalies, waveform_samples } = audioInfo;
  const isHighRisk = synthetic_probability > 50 || lip_sync_consistency < 50;

  return (
    <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wide">
            Audio Deepfake & Lip-Sync Forensics
          </h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
            isHighRisk
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isHighRisk ? 'HIGH ANOMALY DETECTED' : 'Acoustically Authentic'}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#0A0D14] p-3 rounded-lg border border-[#1C2433]">
          <p className="text-[10px] text-slate-400">VOICE AUTHENTICITY</p>
          <p className={`text-xl font-bold ${voice_authenticity > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
            {voice_authenticity}%
          </p>
        </div>
        <div className="bg-[#0A0D14] p-3 rounded-lg border border-[#1C2433]">
          <p className="text-[10px] text-slate-400">SYNTHETIC PROBABILITY</p>
          <p className={`text-xl font-bold ${synthetic_probability > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
            {synthetic_probability}%
          </p>
        </div>
        <div className="bg-[#0A0D14] p-3 rounded-lg border border-[#1C2433]">
          <p className="text-[10px] text-slate-400">LIP-SYNC CONSISTENCY</p>
          <p className={`text-xl font-bold ${lip_sync_consistency > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
            {lip_sync_consistency}%
          </p>
        </div>
      </div>

      {/* Synthetic Waveform Graphic */}
      <div className="bg-[#0A0D14] p-4 rounded-lg border border-[#1C2433] space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>Acoustic Frequency Spectrogram Signal</span>
          <span>0.00s — 18.50s</span>
        </div>
        <div className="h-16 flex items-center justify-between gap-1 px-2 py-1 bg-[#121620] rounded border border-[#1C2433]">
          {waveform_samples && waveform_samples.length > 0 ? (
            waveform_samples.map((val, idx) => (
              <div
                key={idx}
                className={`w-full rounded-sm transition-all ${
                  isHighRisk && idx >= 8 && idx <= 15 ? 'bg-red-500' : 'bg-emerald-400'
                }`}
                style={{ height: `${Math.max(10, val * 100)}%` }}
                title={`Sample #${idx}: ${(val * 100).toFixed(1)}% amplitude`}
              />
            ))
          ) : (
            <div className="w-full text-center text-xs text-slate-500">Generating audio waveform...</div>
          )}
        </div>
      </div>

      {/* Suspicious Timestamps */}
      {suspicious_audio_timestamps && suspicious_audio_timestamps.length > 0 && (
        <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/20 space-y-1">
          <p className="text-xs font-mono font-semibold text-red-400 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" /> Suspicious Voice Clone Timestamps:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {suspicious_audio_timestamps.map((ts, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-xs font-mono bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                {ts}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
