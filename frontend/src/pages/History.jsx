import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Search, Filter, Trash2, FileText, Eye } from 'lucide-react';
import { api } from '../services/api';

export default function History({ setCurrentPage, setSelectedAnalysisId }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    fetchHistory();
  }, [mediaFilter, riskFilter]);

  const fetchHistory = () => {
    api.getHistory({ q: search, media_type: mediaFilter, risk: riskFilter })
      .then((res) => setHistory(res.data))
      .catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this forensic analysis record?')) {
      api.deleteHistory(id).then(() => fetchHistory());
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-emerald-400" />
            <span>Forensic Analysis History</span>
          </h2>
          <p className="text-xs text-slate-400">Search, filter, and inspect past deepfake detection sessions</p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-[#121620] border border-[#1C2433] px-3 py-1.5 rounded-lg w-56">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
              placeholder="Search filename/ID..."
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-full placeholder:text-slate-500 font-mono"
            />
          </div>

          {/* Media Type Filter */}
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="bg-[#121620] border border-[#1C2433] text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none font-mono"
          >
            <option value="ALL">All Media</option>
            <option value="VIDEO">Video</option>
            <option value="IMAGE">Image</option>
            <option value="AUDIO">Audio</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#121620] border border-[#1C2433] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0D14] text-slate-400 uppercase text-[10px] border-b border-[#1C2433]">
              <tr>
                <th className="p-3.5">Evidence ID</th>
                <th className="p-3.5">Filename</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5">Technique</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2433]">
              {history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1C2433]/40">
                    <td className="p-3.5 font-bold text-emerald-400">{item.evidence_id}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{item.original_filename}</td>
                    <td className="p-3.5">{item.media_type}</td>
                    <td className="p-3.5 font-bold">{item.authenticity_score} / 100</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.authenticity_score <= 40 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{item.likely_technique}</td>
                    <td className="p-3.5 text-slate-500 text-[10px]">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="p-3.5 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedAnalysisId(item.id);
                          setCurrentPage('result');
                        }}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                      <button
                        onClick={() => window.open(api.getReportUrl(item.id), '_blank')}
                        className="text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" /> Report
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No analysis history records found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
