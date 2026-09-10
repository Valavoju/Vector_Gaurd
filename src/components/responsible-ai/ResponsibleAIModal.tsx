import React from 'react';
import { 
  ShieldAlert, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  HeartHandshake,
  Leaf
} from 'lucide-react';

export const ResponsibleAIModal: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-1 ring-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Responsible AI, Privacy & Product Boundaries</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ethical governance, surveillance boundaries, and public-health decision support principles
            </p>
          </div>
        </div>
      </div>

      {/* CORE BOUNDARIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Boundary 1: Privacy & Civil Liberties */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
            <EyeOff className="w-4 h-4" />
            <span>Strict Privacy & Anonymization Standards</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            VectorGuard AI employs strict automated redaction and filtering on all imagery streams:
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Facial Recognition:</strong> Vision models filter and blur faces, pedestrian figures, and license plates automatically.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>No Residential Surveillance:</strong> Drone and street imagery is strictly restricted to outdoor public topography, storm drains, and open construction plots.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Data Minimization:</strong> Raw video feeds are discarded immediately after inference; only segmented bounding metadata is archived.</span>
            </li>
          </ul>
        </div>

        {/* Boundary 2: Decision Support vs Medical Diagnosis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
            <Scale className="w-4 h-4" />
            <span>Decision Support — Not Medical Diagnosis</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Clear product taxonomy and technical scope constraints:
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Environmental Predictions Only:</strong> The platform predicts water stagnation and environmental breeding conditions. It does <em>not</em> detect individual mosquitoes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>No Clinical Diagnostics:</strong> The platform does not diagnose dengue, malaria, chikungunya, or patient health conditions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Human-in-the-Loop Audit:</strong> All task dispatches and resolutions require human municipal officer review.</span>
            </li>
          </ul>
        </div>

        {/* Boundary 3: Environmental Sustainability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <Leaf className="w-4 h-4" />
            <span>Ecological & Chemical Stewardship</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Transitioning municipal corporations from indiscriminate chemical fogging to targeted preventive mitigation:
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Priority is physical dewatering and channel desilting before chemical application.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>When necessary, biological larvicides (e.g. <em>Bacillus thuringiensis israelensis</em> / Bti) are recommended over toxic broad-spectrum adulticides.</span>
            </li>
          </ul>
        </div>

        {/* Boundary 4: Bias & Equity in Municipal Resource Dispatch */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
            <HeartHandshake className="w-4 h-4" />
            <span>Equitable Public-Health Coverage</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Algorithms are normalized against ward socioeconomic indicators to ensure low-income colonies and informal settlements receive equal surveillance priority based purely on physical water accumulation risk.
          </p>
        </div>

      </div>

    </div>
  );
};
