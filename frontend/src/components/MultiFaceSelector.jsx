import React, { useState } from 'react';
import { Users, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MultiFaceSelector({ faces }) {
  const [selectedFaceId, setSelectedFaceId] = useState(1);

  if (!faces || faces.length === 0) return null;

  return (
    <div className="bg-[#121620] border border-[#1C2433] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200 font-mono uppercase tracking-wide">
          Multi-Face Detection Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {faces.map((face) => {
          const isSelected = selectedFaceId === face.person_id;
          return (
            <button
              key={face.person_id}
              onClick={() => setSelectedFaceId(face.person_id)}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#1C2433]/60 border-emerald-500 ring-1 ring-emerald-500/30'
                  : 'bg-[#0A0D14] border-[#1C2433] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono font-semibold text-slate-200">{face.name}</span>
                </div>
                {face.is_manipulated ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Manipulation Prob:</span>
                  <span className={`font-bold ${face.is_manipulated ? 'text-red-400' : 'text-emerald-400'}`}>
                    {face.manipulation_probability}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#0A0D14] rounded-full overflow-hidden border border-[#1C2433]">
                  <div
                    className={`h-full ${face.is_manipulated ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${face.manipulation_probability}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
