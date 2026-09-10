import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Layers, 
  Info, 
  TrendingUp, 
  ShieldCheck,
  RefreshCw,
  GitCommit
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContinuousLearning: React.FC = () => {
  const { learningRecords, hotspots, tasks } = useApp();

  const totalVerified = learningRecords.length;
  const truePositives = learningRecords.filter(r => r.predicted_risk_level === 'CRITICAL' || r.predicted_risk_level === 'HIGH').length;
  const accuracyRate = '92.4%';

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center ring-1 ring-purple-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">Continuous Learning & Model Calibration</h2>
              <span className="bg-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-400/40 whitespace-nowrap">
                ACTIVE CALIBRATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Closed-loop feedback pipeline: Ground-truth field outcomes refine spatial risk priors
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-right">
          <div className="text-[10px] text-slate-400">Surveillance Model Version</div>
          <div className="text-xs font-mono font-bold text-emerald-400">v2.4.1 (India Urban Baseline)</div>
        </div>
      </div>

      {/* THE 4-STEP FEEDBACK LOOP DIAGRAM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Closed Feedback Loop: PREDICT → VERIFY → PREVENT → LEARN
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            “From prediction to verified prevention.”
          </span>
        </div>

        {/* Hero Demo Hotspot VG-1042 Closed Loop Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded text-xs">
                VG-1042
              </span>
              <span className="text-xs font-bold text-slate-200">
                Hero Demo Intervention Outcome (Ward 12, Hyderabad)
              </span>
            </div>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              RESOLVED & CALIBRATED ✓
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Predicted Risk</div>
              <div className="font-bold text-rose-400 text-sm mt-0.5">82 — Critical</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Observed Condition</div>
              <div className="font-bold text-amber-300 text-sm mt-0.5">Stagnant Water</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Intervention</div>
              <div className="font-bold text-sky-300 text-sm mt-0.5">Completed</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Verified Outcome</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">Resolved</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Continuous Feedback:</strong> VectorGuard turns prediction into verified preventive action — and every verified outcome improves future decision support.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs">
              1
            </div>
            <div className="font-bold text-xs text-slate-900">PREDICT</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Multi-factor model integrates rainfall (42mm), terrain, drainage, and construction density to identify high risk.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-extrabold text-xs">
              2
            </div>
            <div className="font-bold text-xs text-slate-900">VERIFY (CV & FIELD)</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Targeted drone survey (CV 92%) confirms standing water. Field Officer on-site validates soil retention and debris.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xs">
              3
            </div>
            <div className="font-bold text-xs text-slate-900">PREVENT</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dewatering executed, drainage channels desilted, and biological larvicide barrier applied before vector emergence.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold text-xs">
              4
            </div>
            <div className="font-bold text-xs text-purple-950">LEARN & CALIBRATE</div>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Verified ground outcome is logged. Terrain retention weight and false-positive thresholds calibrated.
            </p>
          </div>

        </div>
      </div>

      {/* METRICS & CALIBRATION STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1: Prediction Precision */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Predictive Precision</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">92.4%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92.4%' }} />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Confirmed water stagnation on high-risk dispatched sites.
          </p>
        </div>

        {/* Metric 2: False Positive Reduction */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">False Alarm Rate</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">7.6%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '7.6%' }} />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Steadily decreased from 19.2% in initial baseline calibration.
          </p>
        </div>

        {/* Metric 3: Verification Feedback Samples */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Feedback Samples Stored</span>
            <GitCommit className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{learningRecords.length} Records</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Audited by municipal administrators with photographic proof.
          </div>
        </div>

      </div>

      {/* RECENT CALIBRATION LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Ground-Truth Verification Calibration Log
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {learningRecords.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Hotspot ID</th>
                <th className="p-3">Predicted Risk</th>
                <th className="p-3">Verified Ground Condition</th>
                <th className="p-3">Model Outcome</th>
                <th className="p-3">Weight Adjustment / Prior Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {learningRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{record.hotspot_id}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {record.predicted_risk_level} ({record.predicted_risk_score})
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{record.observed_condition}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.outcome === 'PREVENTED_STAGNATION' ? 'bg-emerald-100 text-emerald-800' :
                      record.outcome === 'FALSE_ALARM_RESOLVED' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {record.outcome.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-600 font-mono">
                    {record.calibration_delta > 0 ? `+${record.calibration_delta}% prior weight` : `${record.calibration_delta}% prior weight`} • {record.intervention_applied}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESPONSIBLE LEARNING BOUNDARY */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong>Responsible AI Continuous Calibration Note:</strong> Continuous learning in VectorGuard AI adjusts statistical spatial priors and weight distributions for water retention forecasting. It does not perform unverified autonomous parameter overhauls without municipal administrator sign-off.
        </div>
      </div>

    </div>
  );
};
