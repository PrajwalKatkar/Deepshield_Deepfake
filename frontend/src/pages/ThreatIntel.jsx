import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Radio, Globe, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../services/api';

export default function ThreatIntel() {
  const [intel, setIntel] = useState(null);

  useEffect(() => {
    api.getThreatIntel().then((res) => setIntel(res.data)).catch(() => {});
  }, []);

  const defaultIntel = intel || {
    total_analyzed: 4832,
    authentic_files: 3120,
    suspicious_files: 1712,
    techniques_breakdown: [
      { name: 'Face Swap', percentage: 42 },
      { name: 'AI Generated', percentage: 27 },
      { name: 'Face Reenactment', percentage: 18 },
      { name: 'Voice Clone', percentage: 8 },
      { name: 'Other', percentage: 5 }
    ],
    feed_source: 'DeepShield Global Threat Telemetry (Demo Feed)',
    is_demo_feed: true
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Threat Intelligence Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400">Aggregate telemetry on global deepfake manipulation vectors</p>
        </div>

        {/* Demo Feed Label */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{defaultIntel.feed_source}</span>
        </div>
      </div>

      {/* Overview Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-2 shadow-md">
          <p className="text-[10px] text-slate-400 uppercase">Global Analyzed Volume</p>
          <p className="text-3xl font-bold text-slate-100">{defaultIntel.total_analyzed.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-[#121620] border border-emerald-500/30 rounded-xl space-y-2 bg-emerald-500/5 shadow-md">
          <p className="text-[10px] text-emerald-400 uppercase font-semibold">Authentic Benchmark Media</p>
          <p className="text-3xl font-bold text-emerald-400">{defaultIntel.authentic_files.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-[#121620] border border-red-500/30 rounded-xl space-y-2 bg-red-500/5 shadow-md">
          <p className="text-[10px] text-red-400 uppercase font-semibold">Deepfake Threats Intercepted</p>
          <p className="text-3xl font-bold text-red-400">{defaultIntel.suspicious_files.toLocaleString()}</p>
        </div>
      </div>

      {/* Technique Distribution Bar Chart */}
      <div className="p-6 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-200 uppercase">
          Manipulation Vectors Distribution (%)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defaultIntel.techniques_breakdown}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#1C2433', color: '#FFF', fontSize: '12px' }} />
              <Bar dataKey="percentage" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
