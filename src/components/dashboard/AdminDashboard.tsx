import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  Cpu, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  ChevronRight,
  Droplets,
  CloudRain,
  Radio,
  FileCheck,
  Send,
  Eye,
  Compass,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    hotspots, 
    tasks, 
    setActiveView, 
    setSelectedHotspotId, 
    setDispatchModalHotspotId 
  } = useApp();

  const criticalHotspots = hotspots.filter(h => h.risk_level === 'CRITICAL');
  const highHotspots = hotspots.filter(h => h.risk_level === 'HIGH');
  const pendingVerificationCount = tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length;
  const resolvedCount = hotspots.filter(h => h.status === 'RESOLVED').length;
  const activeTasksCount = tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;

  // Top 5 priority hotspots ranked by predictive breeding risk score
  const topPriorityHotspots = [...hotspots]
    .sort((a, b) => b.breeding_risk_score - a.breeding_risk_score)
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-4">
      
      {/* 1. PAGE TITLE & OPERATIONAL STATUS (Compact Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>VectorGuard AI Control Room</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded font-mono whitespace-nowrap">
              India National Pilot Dataset
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor predicted vector-risk locations and coordinate preventive intervention.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="launch-gis-map-top-btn"
            onClick={() => setActiveView('RISK_MAP')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>Launch GIS Map</span>
          </button>
        </div>
      </div>

      {/* 2. CORE OPERATIONAL LIFECYCLE (Compact 4 Equal Cards) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Core Operational Lifecycle
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Predict → Verify → Prevent → Learn
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          
          {/* 01 PREDICT */}
          <button 
            id="lifecycle-predict-btn"
            onClick={() => setActiveView('RISK_MAP')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 text-left transition group flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-700 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-mono font-bold">01</span>
                PREDICT
              </span>
              <span className="font-mono text-slate-400 text-[11px] group-hover:text-blue-600 transition">Map →</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">30 Hotspots</div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Risk prioritization</p>
            </div>
          </button>

          {/* 02 VERIFY */}
          <button 
            id="lifecycle-verify-btn"
            onClick={() => setActiveView('HOTSPOTS')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 text-left transition group flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] font-mono font-bold">02</span>
                VERIFY
              </span>
              <span className="font-mono text-slate-400 text-[11px] group-hover:text-sky-600 transition">Imagery →</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">92% Confirmed</div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Targeted imagery + CV</p>
            </div>
          </button>

          {/* 03 PREVENT */}
          <button 
            id="lifecycle-prevent-btn"
            onClick={() => setActiveView('TASKS')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 text-left transition group flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-mono font-bold">03</span>
                PREVENT
              </span>
              <span className="font-mono text-slate-400 text-[11px] group-hover:text-emerald-600 transition">Tasks →</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{tasks.length} Dispatches</div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Targeted intervention</p>
            </div>
          </button>

          {/* 04 LEARN */}
          <button 
            id="lifecycle-learn-btn"
            onClick={() => setActiveView('LEARNING')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 text-left transition group flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-700 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-mono font-bold">04</span>
                LEARN
              </span>
              <span className="font-mono text-slate-400 text-[11px] group-hover:text-purple-600 transition">Audit →</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Model Calibration</div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Verified outcomes</p>
            </div>
          </button>

        </div>
      </div>

      {/* 3. KEY OPERATIONAL KPIs (5 Equal Cards, Height ~105-115px) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Critical Risk */}
        <div 
          onClick={() => setActiveView('RISK_MAP')}
          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-[105px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Critical Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{criticalHotspots.length}</div>
            <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
              Score 81–100 • Immediate
            </div>
          </div>
        </div>

        {/* High Risk */}
        <div 
          onClick={() => setActiveView('RISK_MAP')}
          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-[105px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>High Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{highHotspots.length}</div>
            <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
              Score 61–80 • Priority
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div 
          onClick={() => setActiveView('TASKS')}
          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-[105px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Tasks</span>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{tasks.length}</div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
              {activeTasksCount} In Progress
            </div>
          </div>
        </div>

        {/* Pending Verification */}
        <div 
          onClick={() => setActiveView('VERIFICATION')}
          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-[105px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Verification</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${pendingVerificationCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingVerificationCount}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
              {pendingVerificationCount > 0 ? 'Audit Required' : 'Up to date'}
            </div>
          </div>
        </div>

        {/* Resolved Sites */}
        <div 
          onClick={() => setActiveView('VERIFICATION')}
          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-[105px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Resolved Sites</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">{resolvedCount}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              100% Verified Proof
            </div>
          </div>
        </div>

      </div>

      {/* 4. MAIN CONTENT GRID (Suggested 68% / 32% Ratio, Top-Aligned) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        
        {/* Left Column (68% - 8 cols): Priority Action Queue */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>PRIORITY ACTION QUEUE</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ranked by predictive risk score
              </p>
            </div>

            <button
              id="view-all-hotspots-btn"
              onClick={() => setActiveView('HOTSPOTS')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
            >
              <span>View All 30</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topPriorityHotspots.map(hotspot => {
              const isHero = hotspot.hotspot_id === 'VG-1042';

              return (
                <div 
                  key={hotspot.hotspot_id}
                  className={`p-3 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isHero ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white shrink-0 ${
                      hotspot.risk_level === 'CRITICAL' ? 'bg-purple-600' : 'bg-rose-500'
                    }`}>
                      <span>{hotspot.breeding_risk_score}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 font-mono">{hotspot.hotspot_id}</span>
                        {isHero && (
                          <span className="bg-amber-400 text-slate-950 font-bold text-[9px] px-1.5 py-0.2 rounded">
                            DEMO TARGET
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                          {hotspot.city}, {hotspot.state}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {hotspot.site_type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 font-medium truncate mt-0.5">{hotspot.location}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{hotspot.ward}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-mono">{hotspot.rainfall}mm rain</span>
                        <span>•</span>
                        <span>{hotspot.drainage_condition} drainage</span>
                        <span>•</span>
                        <span className="text-slate-600">{hotspot.construction_activity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      hotspot.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      hotspot.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      hotspot.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-800' :
                      hotspot.status === 'AWAITING_VERIFICATION' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {hotspot.status.replace('_', ' ')}
                    </span>

                    <button
                      id={`inspect-btn-${hotspot.hotspot_id}`}
                      onClick={() => setSelectedHotspotId(hotspot.hotspot_id)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
                    >
                      Inspect
                    </button>

                    {hotspot.status === 'OPEN' && (
                      <button
                        id={`dispatch-btn-${hotspot.hotspot_id}`}
                        onClick={() => setDispatchModalHotspotId(hotspot.hotspot_id)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
                      >
                        Dispatch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (32% - 4 cols): Pilot Telemetry & Operational Feeds */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Pilot Telemetry Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>PILOT TELEMETRY</span>
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Dataset Scope</span>
                <span className="font-bold text-slate-800">India Demonstration</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Surveillance Sites</span>
                <span className="font-bold text-slate-800 font-mono">30 Seed Sites</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Geographic Coverage</span>
                <span className="font-bold text-slate-800">21 Cities • 15 States</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Surveillance Inputs
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">Weather Inputs</div>
                  <div className="text-slate-500 text-[10px]">Precipitation & temp</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">GIS Inputs</div>
                  <div className="text-slate-500 text-[10px]">Depressions & slope</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">Historical Inputs</div>
                  <div className="text-slate-500 text-[10px]">Past stagnation records</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">Targeted Imagery</div>
                  <div className="text-slate-500 text-[10px]">Drone CV inference</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('RISK_MAP')}
              className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition text-center flex items-center justify-center gap-1.5 shadow-xs mt-2"
            >
              <span>Open GIS Risk Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Operational Surveillance Feed Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-slate-100">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Surveillance Feed</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Precipitation Spike: Ward 12</span>
                  <span className="text-[10px] font-mono text-slate-400">12m ago</span>
                </div>
                <div className="text-slate-500">42mm rainfall recorded. Soil saturation at 84%.</div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Drone CV Inference Complete</span>
                  <span className="text-[10px] font-mono text-slate-400">25m ago</span>
                </div>
                <div className="text-slate-500">Excavation pit stagnation verified (92% confidence).</div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Field Team 3 Deployed</span>
                  <span className="text-[10px] font-mono text-slate-400">41m ago</span>
                </div>
                <div className="text-slate-500">GPS locked ±3m in Banjara Hills sector.</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. PROACTIVE VS REACTIVE RESOURCE EFFICIENCY STRIP */}
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Proactive vs Reactive Efficiency</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            Targeted dewatering and larviciding deployed within <strong>24–48 hours</strong> of precipitation spikes achieves <strong>4.6× higher chemical efficiency</strong> compared to broad-spectrum outdoor thermal fogging.
          </p>
        </div>
        <button
          onClick={() => setActiveView('ANALYTICS')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold whitespace-nowrap transition"
        >
          View Analytics →
        </button>
      </div>

    </div>
  );
};
