import React, { useEffect, useState } from 'react';
import { Archive, Search, Copy, Check, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function EvidenceVault({ setCurrentPage, setSelectedAnalysisId }) {
  const [evidenceList, setEvidenceList] = useState([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    fetchVault();
  }, []);

  const fetchVault = () => {
    api.getEvidenceVault({ q: search }).then((res) => setEvidenceList(res.data)).catch(() => {});
  };

  const copyHash = (sha256, id) => {
    navigator.clipboard.writeText(sha256);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Archive className="w-5 h-5 text-emerald-400" />
            <span>Secure Evidence Vault</span>
          </h2>
          <p className="text-xs text-slate-400">Cryptographically verifiable evidence management interface</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#121620] border border-[#1C2433] px-3 py-1.5 rounded-lg w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchVault()}
            placeholder="Search Evidence ID or SHA-256..."
            className="bg-transparent text-xs text-slate-200 focus:outline-none w-full placeholder:text-slate-500 font-mono"
          />
        </div>
      </div>

      {/* Evidence Records Table */}
      <div className="bg-[#121620] border border-[#1C2433] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0D14] text-slate-400 uppercase text-[10px] border-b border-[#1C2433]">
              <tr>
                <th className="p-3.5">Evidence ID</th>
                <th className="p-3.5">Original Filename</th>
                <th className="p-3.5">SHA-256 Hash</th>
                <th className="p-3.5">Model Version</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2433]">
              {evidenceList.length > 0 ? (
                evidenceList.map((item) => (
                  <tr key={item.evidence_id} className="hover:bg-[#1C2433]/40">
                    <td className="p-3.5 font-bold text-emerald-400">{item.evidence_id}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{item.original_filename}</td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>{item.sha256.substring(0, 16)}...</span>
                        <button
                          onClick={() => copyHash(item.sha256, item.evidence_id)}
                          className="text-slate-500 hover:text-emerald-400"
                        >
                          {copiedId === item.evidence_id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400">{item.model_version}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.authenticity_score <= 40 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => {
                          setSelectedAnalysisId(item.analysis_id);
                          setCurrentPage('result');
                        }}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>View Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No evidence vault records found matching query.
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
