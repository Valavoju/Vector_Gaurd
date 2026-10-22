import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  MapPin, 
  Send, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpDown,
  Download,
  Camera,
  Cpu,
  Scan,
  ShieldCheck,
  Plane,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge, RiskScoreTile } from '../common/RiskBadge';
import { riskStyle } from '../../utils/riskStyles';
import { HotspotRecord, RiskLevel, HotspotStatus } from '../../types';
import { DEMO_EVIDENCE_IMAGES } from '../../data/evidenceImages';
import { DownloadReportButton } from '../common/DownloadReportButton';

export const HotspotsDirectory: React.FC = () => {
  const { 
    hotspots, 
    setSelectedHotspotId, 
    setDispatchModalHotspotId,
    setActiveView,
    demoStep,
    setDemoStep
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'SURVEILLANCE_EVIDENCE'>('DIRECTORY');
  const [selectedDroneHotspotId, setSelectedDroneHotspotId] = useState<string>('VG-1042');
  const [cvOverlayActive, setCvOverlayActive] = useState<boolean>(true);

  // Synchronize tab with demo steps 8 and 9
  useEffect(() => {
    if (demoStep === 8 || demoStep === 9 || demoStep === 11) {
      setActiveTab('SURVEILLANCE_EVIDENCE');
      setSelectedDroneHotspotId('VG-1042');
      if (demoStep === 8) {
        setCvOverlayActive(false);
      } else {
        setCvOverlayActive(true);
      }
    }
  }, [demoStep]);

  const [search, setSearch] = useState<string>('');
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'ID'>('SCORE_DESC');

  const wards = Array.from(new Set(hotspots.map(h => h.ward))).sort();

  const filtered = hotspots.filter(h => {
    const matchesSearch = 
      h.hotspot_id.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()) ||
      h.locality.toLowerCase().includes(search.toLowerCase()) ||
      h.ward.toLowerCase().includes(search.toLowerCase());

    const matchesWard = wardFilter === 'ALL' || h.ward === wardFilter;
    const matchesRisk = riskFilter === 'ALL' || h.risk_level === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;

    return matchesSearch && matchesWard && matchesRisk && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'SCORE_DESC') return b.breeding_risk_score - a.breeding_risk_score;
    if (sortBy === 'SCORE_ASC') return a.breeding_risk_score - b.breeding_risk_score;
    return a.hotspot_id.localeCompare(b.hotspot_id);
  });

  const heroHotspot = hotspots.find(h => h.hotspot_id === selectedDroneHotspotId) || hotspots[0];

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Hotspots Intelligence & Surveillance Evidence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Representative surveillance locations across India pilot cities • DEMO / PILOT DATA — ILLUSTRATIVE
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              id="tab-directory-list"
              onClick={() => setActiveTab('DIRECTORY')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'DIRECTORY' ? 'bg-card text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surveillance Directory
            </button>
            <button
              id="tab-surveillance-evidence"
              onClick={() => setActiveTab('SURVEILLANCE_EVIDENCE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'SURVEILLANCE_EVIDENCE' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Targeted Drone & CV Evidence</span>
            </button>
          </div>

          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hotspots, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "vectorguard_hotspots_export.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-card border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {activeTab === 'SURVEILLANCE_EVIDENCE' ? (
        /* TARGETED DRONE & COMPUTER VISION EVIDENCE VIEW (Steps 8 & 9) */
        <div className="space-y-4">
          
          {/* Top Context Alert */}
          <div className="vg-hero rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30 shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700">
                    STAGE 2: VERIFY — TARGETED IMAGERY
                  </span>
                  <span className="text-xs font-mono text-slate-400">Flight: DRN-HYD-1042</span>
                  <span className="text-xs font-bold text-amber-400">GSD: 1.2 cm/pixel</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Targeted Aerial Drone Survey & Computer Vision Detection
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Targeted imagery is obtained only where multi-signal prediction indicates critical water retention. VectorGuard does not conduct blanket city flights.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <DownloadReportButton
                hotspot={heroHotspot}
                variant="primary"
                buttonId="drone-view-download-report-btn"
                label="Download Verification Report"
              />

              <button
                id="toggle-cv-overlay-btn"
                onClick={() => setCvOverlayActive(!cvOverlayActive)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  cvOverlayActive 
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' 
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>{cvOverlayActive ? 'CV AI Detection: ACTIVE' : 'CV AI Detection: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Main Visual Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: High-Resolution Viewport (7 cols) */}
            <div className="lg:col-span-7 bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">
                    Targeted Aerial Image — {heroHotspot.hotspot_id} ({heroHotspot.location})
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Altitude: 45m AGL • 48MP Sensor</span>
              </div>

              {/* Drone Viewport Container */}
              <div className="vg-island relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 flex items-center justify-center">
                <img 
                  src={DEMO_EVIDENCE_IMAGES.vg1042_before} 
                  alt="Targeted Drone Aerial Capture"
                  className="w-full h-full object-cover"
                />

                {/* CV Bounding Boxes Overlay */}
                {cvOverlayActive && (
                  <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    
                    {/* Top Right Detection Tag */}
                    <div className="self-end bg-cyan-950/90 border border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-lg flex items-center gap-2 backdrop-blur-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>STAGNANT WATER DETECTED: 92% CONFIDENCE</span>
                    </div>

                    {/* Center Water Retention Polygon Box */}
                    <div className="w-3/4 h-1/2 mx-auto border-2 border-dashed border-cyan-400 bg-cyan-500/15 rounded-lg relative flex items-center justify-center shadow-2xl">
                      <div className="absolute top-2 left-2 bg-cyan-900/90 text-cyan-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-500">
                        SURFACE: EXCAVATION PIT WATER RETENTION (~120 m²)
                      </div>
                      <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                        DEBRIS & BLOCKED DRAINAGE DETECTED (84%)
                      </div>
                    </div>

                    {/* Bottom Disclaimer */}
                    <div className="self-start bg-slate-900/90 border border-slate-700 text-slate-300 px-3 py-1 rounded text-[10px] font-mono backdrop-blur-xs">
                      GNSS Footprint: 17.4156° N, 78.4350° E • Timestamp: Recent Targeted Flight
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Imagery Source: <strong className="text-slate-800">Targeted Multirotor Drone</strong></span>
                <span>Survey ID: <strong className="text-slate-800 font-mono">DRN-HYD-1042</strong></span>
                <span>Confidence: <strong className="text-cyan-700 font-mono font-bold">92.4%</strong></span>
              </div>
            </div>

            {/* Right: Computer Vision & Sensor Metrics (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* CV Detection Card */}
              <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-600" />
                    <span>Computer Vision Verification Output</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                    STAGE: VERIFY
                  </span>
                </div>

                <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Observed Condition:</span>
                    <span className="font-extrabold text-cyan-900 font-mono">STAGNANT WATER DETECTED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Model Confidence:</span>
                    <span className="font-extrabold text-cyan-900 font-mono">92%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Surface Features:</span>
                    <span className="text-slate-900 font-medium">Excavation pit, debris obstruction, pooled runoff</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Estimated Area:</span>
                    <span className="text-slate-900 font-mono font-medium">~120 sq. meters</span>
                  </div>
                </div>

                {/* Important Methodology Note */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Responsible AI Protocol:</strong> Computer vision verifies environmental water retention and breeding-risk indicators only. It does not identify mosquitoes or diagnose disease.
                  </p>
                </div>
              </div>

              {/* Recommended Preventive Actions Card */}
              <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Prescriptive Action Queue (Step 11)</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    STAGE: PREVENT
                  </span>
                </div>

                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>1. Remove standing water:</strong> Mobile pump suction required.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>2. Clear debris:</strong> Clear excavation trench drainage obstructers.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>3. Apply larvicide barrier:</strong> Bio-friendly Bti agent application.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>4. Recurrence monitoring:</strong> Ward 12 72-hour recheck schedule.</span>
                  </li>
                </ul>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    id="navigate-to-verification-btn"
                    onClick={() => {
                      setActiveView('VERIFICATION');
                      if (demoStep < 10) setDemoStep(10);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
                  >
                    <span>Proceed to Human Verification (Step 10)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="navigate-to-tasks-btn"
                    onClick={() => {
                      setActiveView('TASKS');
                      if (demoStep < 12) setDemoStep(12);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold vg-btn-primary transition"
                  >
                    Dispatch Task
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* DIRECTORY TABLE VIEW */
        <>
          {/* Filter Controls Bar */}
          <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hotspots..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Ward Select */}
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="ALL">All Wards ({hotspots.length})</option>
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>

              {/* Risk Level */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical (81–100)</option>
                <option value="HIGH">High (61–80)</option>
                <option value="MODERATE">Moderate (31–60)</option>
                <option value="LOW">Low (0–30)</option>
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="SCORE_DESC">Sort: Highest Risk First</option>
                <option value="SCORE_ASC">Sort: Lowest Risk First</option>
                <option value="ID">Sort: Hotspot ID</option>
              </select>

            </div>
          </div>

          {/* Directory Content: Desktop Table & Mobile Cards */}
          <div className="bg-card rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3.5">Hotspot ID</th>
                    <th className="p-3.5">Location & Ward</th>
                    <th className="p-3.5">Breeding Risk Score</th>
                    <th className="p-3.5">Environmental Conditions</th>
                    <th className="p-3.5">CV Detection</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map(hotspot => {
                    const isHero = hotspot.hotspot_id === 'VG-1042';

                    return (
                      <tr key={hotspot.hotspot_id} className={`hover:bg-slate-50 transition ${isHero ? 'bg-amber-50/30' : ''}`}>
                        
                        {/* Hotspot ID */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-extrabold text-slate-900">{hotspot.hotspot_id}</span>
                            {isHero && (
                              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1 py-0.2 rounded">
                                HERO
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{hotspot.site_type}</div>
                        </td>

                        {/* Location */}
                        <td className="p-3.5 max-w-xs">
                          <div className="font-semibold text-slate-800 line-clamp-1">{hotspot.location}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {hotspot.city || 'India'}, {hotspot.state || ''} <span className="text-slate-400 font-normal">({hotspot.ward})</span>
                          </div>
                        </td>

                        {/* Risk Score */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <RiskScoreTile level={hotspot.risk_level} score={hotspot.breeding_risk_score} className="w-8 h-8 text-xs" />
                            <div>
                              <div className="text-[10px] font-black uppercase text-slate-800">
                                {riskStyle(hotspot.risk_level).label}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Retention: {hotspot.water_retention_prediction}%
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Environmental */}
                        <td className="p-3.5 text-[11px]">
                          <div>{hotspot.rainfall}mm rain • {hotspot.humidity}% hum</div>
                          <div className="text-slate-400">{hotspot.drainage_condition} drainage</div>
                        </td>

                        {/* CV Detection */}
                        <td className="p-3.5 text-[11px]">
                          <div className="font-medium text-slate-800">{hotspot.cv_result.detectedCondition}</div>
                          <div className="text-[10px] text-indigo-600 font-mono">
                            {hotspot.cv_result.confidence}% conf • {hotspot.imagery_source}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            hotspot.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                            hotspot.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            hotspot.status === 'AWAITING_VERIFICATION' ? 'bg-purple-100 text-purple-800' :
                            hotspot.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {hotspot.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <DownloadReportButton
                            hotspot={hotspot}
                            variant="compact"
                            label="PDF Report"
                            buttonId={`table-report-btn-${hotspot.hotspot_id}`}
                          />

                          <button
                            onClick={() => setSelectedHotspotId(hotspot.hotspot_id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          >
                            Inspect
                          </button>

                          {hotspot.status === 'OPEN' && (
                            <button
                              onClick={() => setDispatchModalHotspotId(hotspot.hotspot_id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                            >
                              Dispatch
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map(hotspot => {
                const isHero = hotspot.hotspot_id === 'VG-1042';

                return (
                  <div key={hotspot.hotspot_id} className={`p-4 space-y-3 ${isHero ? 'bg-amber-50/40' : 'bg-card'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <RiskScoreTile level={hotspot.risk_level} score={hotspot.breeding_risk_score} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-extrabold text-slate-900 text-xs">{hotspot.hotspot_id}</span>
                            {isHero && (
                              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1 py-0.2 rounded">
                                HERO
                              </span>
                            )}
                            <RiskBadge level={hotspot.risk_level} />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{hotspot.site_type}</div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        hotspot.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        hotspot.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        hotspot.status === 'AWAITING_VERIFICATION' ? 'bg-purple-100 text-purple-800' :
                        hotspot.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {hotspot.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">{hotspot.location}</div>
                      <div className="text-[11px] text-slate-500">
                        {hotspot.city || 'India'}, {hotspot.state || ''} ({hotspot.ward})
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Environmental:</span>
                        <span className="font-medium text-slate-800">{hotspot.rainfall}mm rain • {hotspot.drainage_condition} drainage</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>CV Detection:</span>
                        <span className="font-medium text-indigo-700">{hotspot.cv_result.detectedCondition} ({hotspot.cv_result.confidence}%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                      <DownloadReportButton
                        hotspot={hotspot}
                        variant="compact"
                        label="PDF Report"
                        buttonId={`mobile-report-btn-${hotspot.hotspot_id}`}
                      />

                      <button
                        onClick={() => setSelectedHotspotId(hotspot.hotspot_id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        Inspect
                      </button>

                      {hotspot.status === 'OPEN' && (
                        <button
                          onClick={() => setDispatchModalHotspotId(hotspot.hotspot_id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
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
        </>
      )}

    </div>
  );
};
