import React from 'react';
import { AlertCircle, CheckCircle, HelpCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ScoreCard({ authenticityScore, manipulationProbability, riskLevel, confidence }) {
  const getRiskColor = (score) => {
    if (score <= 20) return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };
    if (score <= 40) return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertCircle };
    if (score <= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', icon: HelpCircle };
    if (score <= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: CheckCircle };
    return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: ShieldCheck };
  };

  const config = getRiskColor(authenticityScore);
  const RiskIcon = config.icon;

  return (
    <div className={`p-6 rounded-xl bg-[#121620] border ${config.border} flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg`}>
      {/* Background Accent Gradient */}
      <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full ${config.bg} blur-3xl pointer-events-none`} />

      {/* Main Authenticity Score Gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#1C2433]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={config.text}
              strokeDasharray={`${authenticityScore}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-bold font-mono ${config.text}`}>{authenticityScore}</span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">AUTHENTICITY SCORE</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0E121B] text-slate-300 border border-[#1C2433]">
              {confidence} Confidence
            </span>
          </div>
          <h2 className={`text-2xl font-bold font-mono tracking-tight flex items-center gap-2 ${config.text}`}>
            <RiskIcon className="w-6 h-6" />
            <span>{riskLevel.toUpperCase()}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {authenticityScore <= 50 ? 'High likelihood of synthetic AI alteration or face swapping.' : 'Media presents genuine sensor & acoustic properties.'}
          </p>
        </div>
      </div>

      {/* Metrics Column */}
      <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#1C2433] pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
        <div className="text-center">
          <p className="text-[10px] uppercase font-mono text-slate-400">Manipulation Probability</p>
          <p className="text-xl font-bold font-mono text-slate-100">{manipulationProbability}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase font-mono text-slate-400">Risk Assessment</p>
          <p className={`text-sm font-bold font-mono uppercase ${config.text}`}>{riskLevel}</p>
        </div>
      </div>
    </div>
  );
}
