import React from 'react';
import { Search, Bell, AlertTriangle, ShieldCheck, User } from 'lucide-react';

export default function Header({ setCurrentPage }) {
  return (
    <header className="h-16 bg-[#0E121B] border-b border-[#1C2433] px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-[#121620] border border-[#1C2433] px-3 py-1.5 rounded-lg w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search Evidence ID, Hash, Filename..."
          className="bg-transparent text-xs text-slate-200 focus:outline-none w-full placeholder:text-slate-500 font-mono"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              setCurrentPage('history');
            }
          }}
        />
      </div>

      {/* System Status Indicators & Profile */}
      <div className="flex items-center gap-4">
        {/* DEMO MODE Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>DEMO MODE ACTIVE</span>
        </div>

        {/* System Online Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SYSTEM ONLINE</span>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1C2433]">
          <div className="w-8 h-8 rounded-full bg-[#121620] border border-[#1C2433] flex items-center justify-center text-emerald-400 font-bold text-xs font-mono shadow-sm shadow-emerald-500/10">
            CA
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">Chief Forensic Analyst</p>
            <p className="text-[10px] text-slate-400">analyst@deepshield.io</p>
          </div>
        </div>
      </div>
    </header>
  );
}
