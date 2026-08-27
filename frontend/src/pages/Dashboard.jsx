import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { ShieldCheck, ShieldAlert, FileText, Search, Activity, ArrowUpRight, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({ setCurrentPage, setSelectedAnalysisId }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.getThreatIntel().then((res) => setStats(res.data)).catch(() => {});
    api.getHistory({ limit: 5 }).then((res) => setHistory(res.data)).catch(() => {});
  }, []);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#8B5CF6'];

  const defaultStats = stats || {
    total_analyzed: 4832,
    authentic_files: 3120,
    suspicious_files: 1712,
    deepfakes_detected: 1712,
    average_confidence: '94.2%',
    techniques_breakdown: [
      { name: 'Face Swap', percentage: 42 },
      { name: 'AI Generated', percentage: 27 },
      { name: 'Face Reenactment', percentage: 18 },
      { name: 'Voice Clone', percentage: 8 },
      { name: 'Other', percentage: 5 }
    ],
    activity_over_time: [
      { date: 'Mon', authentic: 420, suspicious: 180 },
      { date: 'Tue', authentic: 510, suspicious: 240 },
      { date: 'Wed', authentic: 480, suspicious: 310 },
      { date: 'Thu', authentic: 610, suspicious: 290 },
      { date: 'Fri', authentic: 580, suspicious: 410 },
      { date: 'Sat', authentic: 320, suspicious: 160 },
      { date: 'Sun', authentic: 200, suspicious: 122 }
    ]
  };

  const pieData = [
    { name: 'Authentic', value: defaultStats.authentic_files },
    { name: 'Manipulated / Deepfake', value: defaultStats.suspicious_files }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#121620] border border-[#1C2433] rounded-xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100">Cyber Forensic Overview</h2>
          <p className="text-xs text-slate-400">DeepShield Real-Time AI Media Integrity & Telemetry</p>
        </div>
        <button
          onClick={() => setCurrentPage('analyze')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all w-fit"
        >
          <Search className="w-4 h-4" />
          <span>New Forensic Analysis</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <div className="p-4 bg-[#121620] border border-[#1C2433] rounded-xl space-y-1 shadow-md">
          <p className="text-[10px] text-slate-400 uppercase">Total Files Analyzed</p>
          <p className="text-2xl font-bold text-slate-100">{defaultStats.total_analyzed.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-[#121620] border border-emerald-500/30 rounded-xl space-y-1 bg-emerald-500/5 shadow-md">
          <p className="text-[10px] text-emerald-400 uppercase flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Authentic Files
          </p>
          <p className="text-2xl font-bold text-emerald-400">{defaultStats.authentic_files.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-[#121620] border border-red-500/30 rounded-xl space-y-1 bg-red-500/5 shadow-md">
          <p className="text-[10px] text-red-400 uppercase flex items-center gap-1 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Suspicious Media
          </p>
          <p className="text-2xl font-bold text-red-400">{defaultStats.suspicious_files.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-[#121620] border border-[#1C2433] rounded-xl space-y-1 shadow-md">
          <p className="text-[10px] text-slate-400 uppercase">Deepfakes Detected</p>
          <p className="text-2xl font-bold text-amber-400">{defaultStats.deepfakes_detected.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-[#121620] border border-[#1C2433] rounded-xl space-y-1 shadow-md">
          <p className="text-[10px] text-slate-400 uppercase">Avg Model Confidence</p>
          <p className="text-2xl font-bold text-emerald-400">{defaultStats.average_confidence}</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real vs Manipulated Distribution */}
        <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
          <h3 className="text-xs font-mono font-semibold uppercase text-slate-300">
            Real vs Manipulated Ratio
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#1C2433', color: '#FFF', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Real ({defaultStats.authentic_files})
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Deepfake ({defaultStats.suspicious_files})
            </span>
          </div>
        </div>

        {/* Activity Over Time */}
        <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 lg:col-span-2 shadow-lg">
          <h3 className="text-xs font-mono font-semibold uppercase text-slate-300">
            Forensic Activity & Telemetry Trend
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultStats.activity_over_time}>
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#1C2433', color: '#FFF', fontSize: '12px' }} />
                <Area type="monotone" dataKey="authentic" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                <Area type="monotone" dataKey="suspicious" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deepfake Techniques Breakdown */}
      <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <h3 className="text-xs font-mono font-semibold uppercase text-slate-300">
          Detected Deepfake Techniques Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {defaultStats.techniques_breakdown.map((t, idx) => (
            <div key={idx} className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433] space-y-1">
              <p className="text-[11px] font-mono text-slate-400">{t.name}</p>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-lg font-bold text-slate-100">{t.percentage}%</span>
                <div className="w-12 h-1 bg-[#121620] rounded-full overflow-hidden border border-[#1C2433]">
                  <div className="h-full bg-emerald-400" style={{ width: `${t.percentage}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="p-5 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 font-mono shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase text-slate-300">Recent Forensic Analyses</h3>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A0D14] text-slate-400 uppercase text-[10px] border-b border-[#1C2433]">
                <tr>
                  <th className="p-3">Evidence ID</th>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2433]">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1C2433]/40">
                    <td className="p-3 text-emerald-400 font-bold">{item.evidence_id}</td>
                    <td className="p-3 text-slate-200 font-semibold">{item.original_filename}</td>
                    <td className="p-3">{item.media_type}</td>
                    <td className="p-3 font-bold">{item.authenticity_score}/100</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.authenticity_score <= 40 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedAnalysisId(item.id);
                          setCurrentPage('result');
                        }}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No recent analysis records in session database.</p>
        )}
      </div>
    </div>
  );
}
