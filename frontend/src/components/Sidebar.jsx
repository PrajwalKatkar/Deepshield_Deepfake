import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  History, 
  Archive, 
  FileText, 
  Activity, 
  Cpu, 
  Settings, 
  GitCompare,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, analystMode, setAnalystMode }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Media', icon: Search, badge: 'New' },
    { id: 'compare', label: 'Compare Videos', icon: GitCompare },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'vault', label: 'Evidence Vault', icon: Archive },
    { id: 'threat', label: 'Threat Intelligence', icon: Activity },
    { id: 'models', label: 'Model Info', icon: Cpu },
    { id: 'settings', label: 'Settings & Audit', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0E121B] border-r border-[#1C2433] flex flex-col justify-between select-none">
      <div>
        {/* Brand Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-[#1C2433]">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-wide font-mono">DEEPSHIELD</h1>
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono font-semibold">Matrix SOC Forensics</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121620]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Analyst Mode Toggle */}
      <div className="p-4 border-t border-[#1C2433] bg-[#0A0D14]/70">
        <div className="flex items-center justify-between bg-[#121620] p-3 rounded-lg border border-[#1C2433]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Analyst Mode</p>
              <p className="text-[10px] text-slate-400">{analystMode ? 'Advanced Forensics' : 'Public Mode'}</p>
            </div>
          </div>
          <button
            onClick={() => setAnalystMode(!analystMode)}
            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
              analystMode ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                analystMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
