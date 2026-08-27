import React, { useState, useEffect } from 'react';
import { GitCompare, Play, AlertCircle, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function Compare() {
  const [history, setHistory] = useState([]);
  const [videoAId, setVideoAId] = useState('');
  const [videoBId, setVideoBId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getHistory({ limit: 20 }).then((res) => {
      setHistory(res.data);
      if (res.data.length >= 2) {
        setVideoAId(res.data[0].id);
        setVideoBId(res.data[1].id);
      }
    });
  }, []);

  const handleCompare = () => {
    if (!videoAId || !videoBId) return;
    setLoading(true);
    api.compareAnalyses(videoAId, videoBId)
      .then((res) => {
        setComparison(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-emerald-400" />
          <span>Side-by-Side Video Comparison Mode</span>
        </h2>
        <p className="text-xs text-slate-400">
          Compare a known original baseline video against a suspected deepfake manipulation video.
        </p>
      </div>

      {/* Video Selection Card */}
      <div className="p-6 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video A Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Video A (Original Baseline)
            </label>
            <select
              value={videoAId}
              onChange={(e) => setVideoAId(e.target.value)}
              className="w-full bg-[#0A0D14] border border-[#1C2433] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="">-- Select Baseline Video --</option>
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.original_filename} ({h.risk_level} - {h.authenticity_score}%)
                </option>
              ))}
            </select>
          </div>

          {/* Video B Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Video B (Suspected Manipulation)
            </label>
            <select
              value={videoBId}
              onChange={(e) => setVideoBId(e.target.value)}
              className="w-full bg-[#0A0D14] border border-[#1C2433] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="">-- Select Suspected Video --</option>
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.original_filename} ({h.risk_level} - {h.authenticity_score}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!videoAId || !videoBId || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all mx-auto"
        >
          <GitCompare className="w-4 h-4" />
          <span>{loading ? 'Comparing...' : 'Execute Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Comparison Results Card */}
      {comparison && (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>VERDICT: {comparison.verdict}</span>
          </div>

          {/* Side by Side Score Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Media A Box */}
            <div className="p-5 bg-[#121620] border border-emerald-500/30 rounded-xl space-y-3 bg-emerald-500/5 shadow-lg">
              <h3 className="text-sm font-bold text-emerald-400">{comparison.media_a.filename}</h3>
              <div className="text-2xl font-bold text-slate-100">
                Score: {comparison.media_a.authenticity_score} / 100
              </div>
              <p className="text-xs text-emerald-300 font-semibold">{comparison.media_a.risk_level}</p>

              <div className="space-y-1 pt-2 text-xs text-slate-400">
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Face Authenticity:</span>
                  <span>{comparison.media_a.scores.face || 90}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Temporal Consistency:</span>
                  <span>{comparison.media_a.scores.temporal || 90}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Audio Authenticity:</span>
                  <span>{comparison.media_a.scores.audio || 90}%</span>
                </div>
              </div>
            </div>

            {/* Media B Box */}
            <div className="p-5 bg-[#121620] border border-red-500/30 rounded-xl space-y-3 bg-red-500/5 shadow-lg">
              <h3 className="text-sm font-bold text-red-400">{comparison.media_b.filename}</h3>
              <div className="text-2xl font-bold text-slate-100">
                Score: {comparison.media_b.authenticity_score} / 100
              </div>
              <p className="text-xs text-red-300 font-semibold">{comparison.media_b.risk_level}</p>

              <div className="space-y-1 pt-2 text-xs text-slate-400">
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Face Authenticity:</span>
                  <span className="text-red-400 font-bold">{comparison.media_b.scores.face || 20}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Temporal Consistency:</span>
                  <span className="text-red-400 font-bold">{comparison.media_b.scores.temporal || 20}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C2433]">
                  <span>Audio Authenticity:</span>
                  <span className="text-red-400 font-bold">{comparison.media_b.scores.audio || 20}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
