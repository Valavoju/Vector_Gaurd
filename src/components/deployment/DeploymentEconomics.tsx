import React from 'react';
import { 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Users, 
  Cpu, 
  HeartHandshake,
  FileSpreadsheet
} from 'lucide-react';

export const DeploymentEconomics: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Deployment Economics & Municipal Budget Model</h2>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/40">
                PLANNING ESTIMATES
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, cost-effective scaling framework for municipal corporations (Urban Municipalities Baseline)
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-right">
          <div className="text-[10px] text-slate-400">Total City-Scale Annual Opex</div>
          <div className="text-sm font-mono font-extrabold text-emerald-400">₹40 – 65 Lakhs / Year</div>
        </div>
      </div>

      {/* CORE FINANCIAL POSITIONING STATEMENT */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Core Financial & Operational Positioning</span>
        </div>
        <p className="leading-relaxed">
          VectorGuard AI is an <strong>intelligence and dispatch enhancement layer</strong> that leverages and empowers existing municipal vector control staff, ward sanitation teams, and drainage equipment. It does <strong>NOT</strong> require replacing municipal workers, purchasing massive proprietary drone fleets, or overhauling existing public-health infrastructure.
        </p>
      </div>

      {/* THREE-TIER BUDGET TIERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: Prototype */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phase 1: Proof-of-Concept</div>
            <h3 className="text-xl font-extrabold text-slate-900">Prototype Build</h3>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹2 – 3 <span className="text-sm font-semibold text-slate-500">Lakhs</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Initial platform architecture, deterministic multi-factor risk engine, GIS integration, CV pipeline prototype, and seed dataset.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Core Decision-Support Algorithm</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Responsive Admin & Officer UI</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Synthesized CV Training Pipeline</span>
              </li>
            </ul>
          </div>

          <div className="text-[10px] text-slate-400 pt-3 border-t font-mono">
            Scope: Hackathon / Validation Lab
          </div>
        </div>

        {/* Tier 2: 1-Ward Pilot */}
        <div className="bg-white rounded-2xl border-2 border-indigo-500 p-6 shadow-md flex flex-col justify-between space-y-4 relative">
          <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            Recommended Next Step
          </span>

          <div className="space-y-3">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Phase 2: Ground Pilot</div>
            <h3 className="text-xl font-extrabold text-slate-900">1-Ward Field Pilot</h3>
            <div className="text-2xl font-black text-indigo-700 font-mono">
              ₹10 – 15 <span className="text-sm font-semibold text-slate-500">Lakhs</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              3 to 6 months active operational pilot in a single high-risk urban zone validating predictions against ground truth.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Targeted Drone Surveys (On-Demand)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Field Officer Mobile Training & Support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Continuous Learning Calibration Runs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Municipal GIS System Integration</span>
              </li>
            </ul>
          </div>

          <div className="text-[10px] text-indigo-700 font-bold pt-3 border-t font-mono">
            Timeline: 3 – 6 Months Pilot Zone
          </div>
        </div>

        {/* Tier 3: City-Scale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phase 3: Municipal Scale</div>
            <h3 className="text-xl font-extrabold text-slate-900">City-Scale Deployment</h3>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹40 – 65 <span className="text-sm font-semibold text-slate-500">Lakhs / yr</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full municipal rollout across city zones, integrating real-time weather feeds, automated dispatching, and citizen reporting.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zone-wide Satellite & Radar Feeds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-Availability Cloud Infrastructure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 SLA & Field Support Helpline</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quarterly Model Re-tuning & Audits</span>
              </li>
            </ul>
          </div>

          <div className="text-[10px] text-slate-400 pt-3 border-t font-mono">
            Annual Opex for ~150 Wards
          </div>
        </div>

      </div>

      {/* COST COMPONENT BREAKDOWN TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Annual Cost Component Breakdown (City-Scale Pilot)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Cost Component</th>
                <th className="p-3">Operational Purpose</th>
                <th className="p-3">Estimated Share</th>
                <th className="p-3 font-mono">Est. Annual Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-bold text-slate-900">GIS & Satellite Data Feeds</td>
                <td className="p-3">Sentinel-2 / Planet Labs multi-spectral imagery & IMD precipitation radar</td>
                <td className="p-3 font-mono">20%</td>
                <td className="p-3 font-mono font-bold text-slate-800">₹8 – 12 Lakhs</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Targeted Drone Surveys (Level 3)</td>
                <td className="p-3">Contracted on-demand drone micro-surveys over top 5% ambiguous hotspots only</td>
                <td className="p-3 font-mono">30%</td>
                <td className="p-3 font-mono font-bold text-slate-800">₹12 – 18 Lakhs</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Cloud & Computer Vision Infrastructure</td>
                <td className="p-3">GPU inferencing, spatial database hosting, GIS tile server, backup & security</td>
                <td className="p-3 font-mono">25%</td>
                <td className="p-3 font-mono font-bold text-slate-800">₹10 – 15 Lakhs</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Mobile Terminal & Field Maintenance</td>
                <td className="p-3">App maintenance, offline caching updates, field connectivity sims</td>
                <td className="p-3 font-mono">15%</td>
                <td className="p-3 font-mono font-bold text-slate-800">₹6 – 10 Lakhs</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Training, Capacity Building & SLA</td>
                <td className="p-3">Officer onboarding, quarterly AI audit reports, 24/7 technical hotline</td>
                <td className="p-3 font-mono">10%</td>
                <td className="p-3 font-mono font-bold text-slate-800">₹4 – 10 Lakhs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PHASED ROLLOUT ROADMAP */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Phased Municipal Implementation Strategy
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 text-center text-xs">
          
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="text-sky-400 font-bold font-mono">STEP 1</span>
            <div className="font-bold text-white">One Ward</div>
            <div className="text-[10px] text-slate-400">Deploy in Ward 12</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="text-sky-400 font-bold font-mono">STEP 2</span>
            <div className="font-bold text-white">Validate</div>
            <div className="text-[10px] text-slate-400">Ground truth check</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="text-sky-400 font-bold font-mono">STEP 3</span>
            <div className="font-bold text-white">Measure</div>
            <div className="text-[10px] text-slate-400">Time to dewater</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="text-sky-400 font-bold font-mono">STEP 4</span>
            <div className="font-bold text-white">Calibrate</div>
            <div className="text-[10px] text-slate-400">Tune CV & priors</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="text-sky-400 font-bold font-mono">STEP 5</span>
            <div className="font-bold text-white">Zone Scale</div>
            <div className="text-[10px] text-slate-400">Multi-Ward Zone</div>
          </div>

          <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/50 space-y-1">
            <span className="text-emerald-400 font-bold font-mono">STEP 6</span>
            <div className="font-bold text-emerald-300">City Scale</div>
            <div className="text-[10px] text-emerald-200">Full Municipality</div>
          </div>

        </div>
      </div>

    </div>
  );
};
