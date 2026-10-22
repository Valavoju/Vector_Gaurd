import React, { useState } from 'react';
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
import { RiskLevel } from '../../types';
import { RISK_ORDER, RISK_STYLES } from '../../utils/riskStyles';

interface TipState {
  x: number;
  y: number;
  title: string;
  detail: string;
}

const ChartTooltip: React.FC<{ tip: TipState | null }> = ({ tip }) =>
  tip ? (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full -mt-2 px-2.5 py-1.5 rounded-lg bg-surface border border-slate-200 shadow-lg text-[11px] whitespace-nowrap animate-pop-in"
      style={{ left: tip.x, top: tip.y - 6 }}
    >
      <div className="font-bold text-slate-900">{tip.title}</div>
      <div className="text-slate-600 tabular-nums">{tip.detail}</div>
    </div>
  ) : null;

export const AnalyticsDashboard: React.FC = () => {
  const { hotspots, tasks, learningRecords } = useApp();

  const criticalCount = hotspots.filter(h => h.risk_level === 'CRITICAL').length;
  const highCount = hotspots.filter(h => h.risk_level === 'HIGH').length;
  const modCount = hotspots.filter(h => h.risk_level === 'MODERATE').length;
  const lowCount = hotspots.filter(h => h.risk_level === 'LOW').length;

  const resolvedTasks = tasks.filter(t => t.status === 'RESOLVED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const awaitingTasks = tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length;

  const totalSites = hotspots.length;
  const pct = (count: number) => (totalSites ? (count / totalSites) * 100 : 0);
  const riskLevels = RISK_ORDER.map(key => ({
    key,
    label: RISK_STYLES[key].label,
    range: RISK_STYLES[key].range,
    fill: RISK_STYLES[key].fill,
    count: { CRITICAL: criticalCount, HIGH: highCount, MODERATE: modCount, LOW: lowCount }[key],
  }));

  // Hover/focus tooltip shared by both charts (enhances; every value is also printed).
  const [tip, setTip] = useState<TipState | null>(null);
  const showTip = (e: React.SyntheticEvent<HTMLElement>, title: string, detail: string) => {
    const card = e.currentTarget.closest('.relative') as HTMLElement | null;
    if (!card) return;
    const a = e.currentTarget.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    setTip({ x: a.left - c.left + a.width / 2, y: a.top - c.top, title, detail });
  };
  const hideTip = () => setTip(null);

  // City concentration (each ward holds a single seed site, so wards are too granular to compare).
  const cityMap = new Map<string, { city: string; state: string; total: number; levels: Record<RiskLevel, number> }>();
  hotspots.forEach(h => {
    const row = cityMap.get(h.city) ?? { city: h.city, state: h.state, total: 0, levels: { CRITICAL: 0, HIGH: 0, MODERATE: 0, LOW: 0 } };
    row.total += 1;
    row.levels[h.risk_level] += 1;
    cityMap.set(h.city, row);
  });
  const cityCount = cityMap.size;
  const cityRows = [...cityMap.values()]
    .sort((a, b) => b.total - a.total || b.levels.CRITICAL - a.levels.CRITICAL)
    .slice(0, 10);
  const maxCityTotal = Math.max(1, ...cityRows.map(r => r.total));

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header */}
      <div className="vg-hero rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
        
        <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Preventive Risk Coverage</div>
          <div className="text-2xl font-extrabold text-slate-900">94.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs reactive baseline
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Avg Time to Dewatering</div>
          <div className="text-2xl font-extrabold text-slate-900">3.4 hrs</div>
          <div className="text-[11px] text-slate-500">
            Within 24-48h vector window
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium">Visual Verification Rate</div>
          <div className="text-2xl font-extrabold text-slate-900">100%</div>
          <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Photo audited before closing
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
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
        <div className="relative bg-card rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5" onMouseLeave={hideTip}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Risk classification distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Share of {totalSites} monitored sites by breeding-risk level</p>
            </div>
          </div>

          {/* Part-to-whole: one stacked bar, 2px surface gaps between segments */}
          <div className="flex h-4 w-full gap-[2px]" role="img" aria-label="Share of sites by risk level">
            {riskLevels.filter(l => l.count > 0).map(level => (
              <div
                key={level.key}
                tabIndex={0}
                aria-label={`${level.label}: ${level.count} sites, ${pct(level.count).toFixed(0)}%`}
                className={`${level.fill} h-full first:rounded-l-[4px] last:rounded-r-[4px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:brightness-110 transition-[filter]`}
                style={{ width: `${pct(level.count)}%` }}
                onMouseEnter={e => showTip(e, level.label, `${level.count} sites · ${pct(level.count).toFixed(1)}%`)}
                onFocus={e => showTip(e, level.label, `${level.count} sites · ${pct(level.count).toFixed(1)}%`)}
                onBlur={hideTip}
              />
            ))}
          </div>

          {/* Legend + per-level rows (doubles as the table view) */}
          <div className="space-y-3.5">
            {riskLevels.map(level => (
              <div key={level.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${level.fill}`} aria-hidden="true"></span>
                    {level.label} <span className="text-slate-400 font-medium">{level.range}</span>
                  </span>
                  <span className="text-slate-700 tabular-nums">
                    {level.count} <span className="text-slate-400 font-medium">· {pct(level.count).toFixed(0)}%</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-[4px] overflow-hidden">
                  <div className={`${level.fill} h-full rounded-r-[4px] transition-all duration-700`} style={{ width: `${pct(level.count)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <ChartTooltip tip={tip} />
        </div>

        {/* City-wise concentration */}
        <div className="relative bg-card rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4" onMouseLeave={hideTip}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Surveillance density by city</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top {cityRows.length} of {cityCount} cities by hotspot count, split by risk level</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-semibold text-slate-600">
            {riskLevels.map(level => (
              <span key={level.key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${level.fill}`} aria-hidden="true" /> {level.label}
              </span>
            ))}
          </div>

          <div className="space-y-2.5 pt-1">
            {cityRows.map(row => (
              <div key={row.city} className="grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-3">
                <div className="text-xs font-semibold text-slate-800 truncate" title={`${row.city}, ${row.state}`}>
                  {row.city} <span className="text-slate-400 font-medium">· {row.state}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-3 gap-[2px] min-w-0" style={{ width: `calc((100% - 2rem) * ${row.total / maxCityTotal})` }}>
                    {riskLevels.filter(level => row.levels[level.key] > 0).map(level => (
                      <div
                        key={level.key}
                        tabIndex={0}
                        aria-label={`${row.city}: ${row.levels[level.key]} ${level.label.toLowerCase()}`}
                        className={`${level.fill} h-full last:rounded-r-[4px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:brightness-110 transition-[filter]`}
                        style={{ flexGrow: row.levels[level.key], flexBasis: 0 }}
                        onMouseEnter={e => showTip(e, `${row.city} · ${level.label}`, `${row.levels[level.key]} of ${row.total} hotspots`)}
                        onFocus={e => showTip(e, `${row.city} · ${level.label}`, `${row.levels[level.key]} of ${row.total} hotspots`)}
                        onBlur={hideTip}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">{row.total}</span>
                </div>
              </div>
            ))}
          </div>
          <ChartTooltip tip={tip} />
        </div>

      </div>

      {/* Workflow Execution Balance Strip */}
      <div className="vg-panel-dark rounded-2xl p-6 shadow-xl space-y-3">
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
