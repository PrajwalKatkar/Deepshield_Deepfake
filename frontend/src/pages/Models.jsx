import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Layers, Database, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function Models() {
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    api.getModelsInfo().then((res) => setModelData(res.data)).catch(() => {});
  }, []);

  const ensemble = modelData?.active_ensemble || {
    name: 'DeepShield Forensic Ensemble',
    version: '1.0-demo',
    mode: 'DEMO MODE',
    supported_media: ['IMAGE', 'VIDEO', 'AUDIO'],
    status: 'ACTIVE',
    metrics: {
      accuracy: '96.4%',
      precision: '95.8%',
      recall: '97.1%',
      f1_score: '96.4%',
      dataset_benchmarks: 'FaceForensics++, Celeb-DF v2, DFDC'
    }
  };

  const individualModels = modelData?.individual_models || [
    { name: 'Facial Edge & Artifact Detector', type: 'CNN / Vision Transformer', status: 'ACTIVE', accuracy: '96.8%', dataset: 'FaceForensics++ (c20)' },
    { name: 'Temporal 3D-ResNet Consistency Model', type: '3D-CNN Sequence Classifier', status: 'ACTIVE', accuracy: '94.2%', dataset: 'Celeb-DF v2' },
    { name: 'Acoustic Spectrogram Voice Clone Detector', type: 'Wav2Vec2 / SpecNet', status: 'ACTIVE', accuracy: '95.1%', dataset: 'ASVspoof 2021' },
    { name: 'Viseme Phoneme Lip-Sync Alignment Engine', type: 'Cross-Modal Transformer', status: 'ACTIVE', accuracy: '92.6%', dataset: 'LRS3-TED / DFDC' }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Model Architecture & Research Registry</span>
        </h2>
        <p className="text-xs text-slate-400">Deep learning model metadata, dataset alignment, and performance evaluation</p>
      </div>

      {/* Active Ensemble Card */}
      <div className="p-6 bg-[#121620] border border-[#1C2433] rounded-xl space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-100">{ensemble.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                v{ensemble.version}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {ensemble.mode}
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Domain Weighted Ensemble Aggregation Engine</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>STATUS: {ensemble.status}</span>
          </div>
        </div>

        {/* Evaluation Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433]">
            <p className="text-[10px] text-slate-400">ACCURACY</p>
            <p className="text-xl font-bold text-emerald-400">{ensemble.metrics.accuracy}</p>
          </div>
          <div className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433]">
            <p className="text-[10px] text-slate-400">PRECISION</p>
            <p className="text-xl font-bold text-emerald-400">{ensemble.metrics.precision}</p>
          </div>
          <div className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433]">
            <p className="text-[10px] text-slate-400">RECALL</p>
            <p className="text-xl font-bold text-emerald-400">{ensemble.metrics.recall}</p>
          </div>
          <div className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433]">
            <p className="text-[10px] text-slate-400">F1 SCORE</p>
            <p className="text-xl font-bold text-emerald-400">{ensemble.metrics.f1_score}</p>
          </div>
        </div>

        <div className="p-3 bg-[#0A0D14] rounded-lg border border-[#1C2433] text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Research Dataset Benchmarks:</span>
          </span>
          <span className="font-semibold text-slate-200">{ensemble.metrics.dataset_benchmarks}</span>
        </div>
      </div>

      {/* Individual Detector Submodules */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 uppercase">Individual Detection Submodules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {individualModels.map((m, idx) => (
            <div key={idx} className="p-4 bg-[#121620] border border-[#1C2433] rounded-xl space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">{m.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Architecture: {m.type}</p>
              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-[#1C2433]">
                <span>Accuracy: <strong className="text-emerald-400">{m.accuracy}</strong></span>
                <span>Dataset: <strong className="text-slate-300">{m.dataset}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
