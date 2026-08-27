import React, { useEffect, useState } from 'react';
import { Settings, Shield, Lock, FileText, UserCheck } from 'lucide-react';
import { api } from '../services/api';

export default function AuditSettings({ analystMode, setAnalystMode }) {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    api.getAuditLogs().then((res) => setAuditLogs(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Platform Settings & Security Audit Logs</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">Role-based access control, security controls, and action logs</p>
      </div>

      {/* Access Role & Mode Configuration */}
      <div className="p-6 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-200 uppercase flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Interface Mode</span>
        </h3>

        <div className="flex items-center justify-between p-4 bg-[#0A0D14] rounded-lg border border-[#1C2433]">
          <div>
            <p className="text-sm font-bold text-slate-200">Forensic Analyst Interface Mode</p>
            <p className="text-xs text-slate-400">Enables frame viewers, pixel heatmaps, analyst notes, and raw EXIF metadata.</p>
          </div>
          <button
            onClick={() => setAnalystMode(!analystMode)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              analystMode ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {analystMode ? 'ANALYST MODE ACTIVE' : 'PUBLIC MODE'}
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-200 uppercase flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>System Action Audit Logs</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0D14] text-slate-400 uppercase text-[10px] border-b border-[#1C2433]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User Email</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2433]">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1C2433]/40">
                    <td className="p-3 text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-slate-200">{log.user_email}</td>
                    <td className="p-3 text-emerald-400 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-400">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">No audit logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
