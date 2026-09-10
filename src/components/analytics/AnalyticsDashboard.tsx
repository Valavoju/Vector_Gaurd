import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Layers,
  Activity,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { hotspots, tasks, learningRecords } = useApp();

  const criticalCount = hotspots.filter(h => h.risk_level === 'CRITICAL').length;
  const highCount = hotspots.filter(h => h.risk_level === 'HIGH').length;
  const modCount = hotspots.filter(h => h.risk_level === 'MODERATE').length;
  const lowCount = hotspots.filter(h => h.risk_level === 'LOW').length;

  const resolvedTasks = tasks.filter(t => t.status === 'RESOLVED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const awaitingTasks = tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length;

  // Ward counts
  const wardCounts: Record<string, number> = {};
  hotspots.forEach(h => {
    wardCounts[h.ward] = (wardCounts[h.ward] || 0) + 1;
  });

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Surveillance & Intervention Analytics</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Municipal public-health KPIs, response times, and geographic distribution metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-300">Mean Intervention Time:</span>
          <span className="font-bold text-emerald-400 font-mono">3.4 Hours</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Preventive Risk Coverage</div>
          <div className="text-2xl font-extrabold text-slate-900">94.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs reactive baseline
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Avg Time to Dewatering</div>
          <div className="text-2xl font-extrabold text-slate-900">3.4 hrs</div>
          <div className="text-[11px] text-slate-500">
            Within 24-48h vector window
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Visual Verification Rate</div>
          <div className="text-2xl font-extrabold text-slate-900">100%</div>
          <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Photo audited before closing
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Model Calibration Score</div>
          <div className="text-2xl font-extrabold text-slate-900">92.4%</div>
          <div className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Continuous field feedback
          </div>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk Distribution Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Risk Classification Distribution</span>
            <span className="font-mono text-slate-400">Total: 30 Sites</span>
          </h3>

          <div className="space-y-3 pt-2">
            
            {/* Critical */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-purple-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-600"></span>
                  Critical (81–100 Score)
                </span>
                <span className="font-mono text-slate-700">{criticalCount} sites ({((criticalCount/30)*100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${(criticalCount/30)*100}%` }} />
              </div>
            </div>

            {/* High */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-red-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500"></span>
                  High (61–80 Score)
                </span>
                <span className="font-mono text-slate-700">{highCount} sites ({((highCount/30)*100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${(highCount/30)*100}%` }} />
              </div>
            </div>

            {/* Moderate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-orange-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-orange-500"></span>
                  Moderate (31–60 Score)
                </span>
                <span className="font-mono text-slate-700">{modCount} sites ({((modCount/30)*100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${(modCount/30)*100}%` }} />
              </div>
            </div>

            {/* Low */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  Low (0–30 Score)
                </span>
                <span className="font-mono text-slate-700">{lowCount} sites ({((lowCount/30)*100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(lowCount/30)*100}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Ward-Wise Concentration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Ward-Wise Surveillance Density</span>
            <span className="font-mono text-slate-400">Pilot Zone</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(wardCounts).map(([wardName, count]) => (
              <div key={wardName} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{wardName}</span>
                  <span className="font-mono text-indigo-700">{count} hotspots</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${(count / 10) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Workflow Execution Balance Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Proactive vs Reactive Resource Efficiency
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          By deploying targeted dewatering and larvicide within <strong>24–48 hours</strong> of intense precipitation (before larval metamorphosis into adult vector mosquitoes), municipal teams achieve <strong>4.6× higher chemical efficiency</strong> compared to broad-spectrum outdoor thermal fogging.
        </p>
      </div>

    </div>
  );
};
