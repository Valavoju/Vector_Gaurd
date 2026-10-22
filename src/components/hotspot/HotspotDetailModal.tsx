import React, { useCallback, useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Cpu, 
  Eye, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  History, 
  Building, 
  Sparkles,
  Sliders,
  ChevronRight,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskScoreTile } from '../common/RiskBadge';
import { riskStyle } from '../../utils/riskStyles';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { calculateRisk } from '../../data/seedHotspots';
import { RealisticVisualEvidence } from '../verification/RealisticVisualEvidence';
import { DownloadReportButton } from '../common/DownloadReportButton';

export const HotspotDetailModal: React.FC = () => {
  const { 
    selectedHotspotId, 
    setSelectedHotspotId, 
    hotspots, 
    setDispatchModalHotspotId,
    tasks,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CV_EVIDENCE' | 'SIMULATOR'>('OVERVIEW');

  // Interactive weight simulator state
  const [simVisual, setSimVisual] = useState<number>(90);
  const [simRetention, setSimRetention] = useState<number>(82);
  const [simEnv, setSimEnv] = useState<number>(75);
  const [simHist, setSimHist] = useState<number>(70);

  const closeModal = useCallback(() => setSelectedHotspotId(null), [setSelectedHotspotId]);
  useEscapeKey(!!selectedHotspotId, closeModal);

  if (!selectedHotspotId) return null;

  const hotspot = hotspots.find(h => h.hotspot_id === selectedHotspotId);
  if (!hotspot) return null;

  const associatedTask = tasks.find(t => t.hotspot_id === hotspot.hotspot_id);

  // Computed simulation score
  const simResult = calculateRisk(simVisual, simRetention, simEnv, simHist);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto vg-scrim flex items-center justify-center p-3 sm:p-4" onClick={closeModal}>
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-surface animate-pop-in w-full max-w-3xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="vg-hero !rounded-none !shadow-none p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <RiskScoreTile level={hotspot.risk_level} score={hotspot.breeding_risk_score} className="w-11 h-11 text-base" />
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">{hotspot.hotspot_id}</h3>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded text-white ${riskStyle(hotspot.risk_level).tint}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${riskStyle(hotspot.risk_level).fill}`} aria-hidden="true" />
                  {hotspot.risk_level} RISK
                </span>
                
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  hotspot.status === 'RESOLVED' ? 'bg-emerald-600 text-white' :
                  hotspot.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' :
                  hotspot.status === 'AWAITING_VERIFICATION' ? 'bg-amber-500 text-slate-950 font-semibold' :
                  hotspot.status === 'ASSIGNED' ? 'bg-indigo-600 text-white' :
                  'bg-slate-700 text-slate-200'
                }`}>
                  {hotspot.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{hotspot.location}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">{hotspot.city || 'India'}, {hotspot.state || ''} ({hotspot.ward})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadReportButton
              hotspot={hotspot}
              variant="dark"
              buttonId="modal-header-download-report-btn"
            />
            <button
              id="close-hotspot-modal-btn"
              onClick={() => setSelectedHotspotId(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-3 text-xs font-medium overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Risk Prioritization</span>
          </button>

          <button
            id="tab-cv"
            onClick={() => setActiveTab('CV_EVIDENCE')}
            className={`py-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'CV_EVIDENCE' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Surveillance Imagery</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-mono">
              {hotspot.cv_result.confidence}%
            </span>
          </button>

          <button
            id="tab-simulator"
            onClick={() => {
              setSimVisual(hotspot.visual_score);
              setSimRetention(hotspot.water_retention_prediction);
              setSimEnv(hotspot.environmental_score);
              setSimHist(hotspot.historical_risk);
              setActiveTab('SIMULATOR');
            }}
            className={`py-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SIMULATOR' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Formula Simulator</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 text-xs">
          
          {activeTab === 'OVERVIEW' && (
            <>
              {/* AI Explanation Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Risk Engine Prioritization Rationale</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {hotspot.ai_explanation}
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                  Predictive decision support metric (does not diagnose disease or detect mosquitoes)
                </div>
              </div>

              {/* 4 Multi-Factor Breakdown Cards */}
              <div>
                <div className="text-xs font-semibold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Transparent Risk Score Formula Components</span>
                  <span className="font-mono text-slate-500 text-[10px]">
                    (V×0.40) + (R×0.25) + (E×0.20) + (H×0.15)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  {/* Visual Condition */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Visual Score</span>
                      <span className="font-mono text-indigo-700 font-semibold">40%</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{hotspot.visual_score} / 100</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${hotspot.visual_score}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{hotspot.cv_result.detectedCondition}</div>
                  </div>

                  {/* Water Retention */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Retention Pred.</span>
                      <span className="font-mono text-sky-700 font-semibold">25%</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{hotspot.water_retention_prediction} / 100</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-600 h-full rounded-full" style={{ width: `${hotspot.water_retention_prediction}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{hotspot.drainage_condition} drainage</div>
                  </div>

                  {/* Environmental Score */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Env. Suitability</span>
                      <span className="font-mono text-emerald-700 font-semibold">20%</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{hotspot.environmental_score} / 100</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${hotspot.environmental_score}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{hotspot.rainfall}mm • {hotspot.humidity}% hum</div>
                  </div>

                  {/* Historical Risk */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Historical Risk</span>
                      <span className="font-mono text-amber-700 font-semibold">15%</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{hotspot.historical_risk} / 100</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${hotspot.historical_risk}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">Recurrence pattern</div>
                  </div>

                </div>
              </div>

              {/* Environmental & Site Conditions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Meteorological & Physical Profile */}
                <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-card">
                  <h5 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                    <span>Environmental Observations</span>
                  </h5>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Recent Precipitation (48h):</span>
                      <span className="font-semibold text-slate-900">{hotspot.rainfall} mm</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Ambient Temperature:</span>
                      <span className="font-semibold text-slate-900">{hotspot.temperature} °C</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Relative Humidity:</span>
                      <span className="font-semibold text-slate-900">{hotspot.humidity} %</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Construction Activity:</span>
                      <span className="font-semibold text-slate-900">{hotspot.construction_activity}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Drainage Infrastructure:</span>
                      <span className="font-semibold text-amber-700">{hotspot.drainage_condition}</span>
                    </div>
                  </div>
                </div>

                {/* Surveillance & Recommended Protocol */}
                <div className="border border-slate-200 rounded-lg p-3.5 space-y-2.5 bg-card">
                  <h5 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Protocol Recommendation</span>
                  </h5>

                  <div className="space-y-2">
                    <div className="bg-slate-50 rounded p-2 border border-slate-200">
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Imagery Source</div>
                      <div className="font-medium text-slate-900 mt-0.5">
                        {hotspot.imagery_source}
                      </div>
                    </div>

                    <div className="bg-emerald-50/70 rounded p-2 border border-emerald-200">
                      <div className="text-[10px] uppercase font-semibold text-emerald-800">Recommended Action</div>
                      <div className="font-medium text-emerald-950 mt-0.5">
                        {hotspot.recommended_action}
                      </div>
                    </div>

                    {associatedTask && (
                      <div className="bg-slate-100 rounded p-2 border border-slate-200 text-[11px] space-y-0.5">
                        <div className="font-semibold text-slate-900 flex items-center justify-between">
                          <span>Task #{associatedTask.task_id}</span>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">{associatedTask.status}</span>
                        </div>
                        <div className="text-slate-600">
                          Assigned: {associatedTask.assigned_officer} ({associatedTask.assigned_team})
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'CV_EVIDENCE' && (
            <div className="space-y-4">
              <RealisticVisualEvidence 
                hotspot={hotspot} 
                task={associatedTask} 
                showAdditionalAngles={true}
                showMetadataCards={true}
              />
            </div>
          )}

          {activeTab === 'SIMULATOR' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Interactive Risk Formula Simulator</span>
                  <span className="text-xs bg-indigo-600 text-white font-mono px-2 py-0.5 rounded font-medium">
                    Calculated: {simResult.score}/100 ({simResult.level})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Adjust parameter weights to test the multi-criteria risk model in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Visual Condition Slider (40%) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Visual Condition (40%)</span>
                    <span className="font-mono text-indigo-700">{simVisual} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simVisual} 
                    onChange={(e) => setSimVisual(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="text-[10px] text-slate-500">Contribution: {(simVisual * 0.4).toFixed(1)} pts</div>
                </div>

                {/* Water Retention Prediction Slider (25%) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Water Retention Pred. (25%)</span>
                    <span className="font-mono text-sky-700">{simRetention} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simRetention} 
                    onChange={(e) => setSimRetention(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <div className="text-[10px] text-slate-500">Contribution: {(simRetention * 0.25).toFixed(1)} pts</div>
                </div>

                {/* Environmental Suitability Slider (20%) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Environmental Suitability (20%)</span>
                    <span className="font-mono text-emerald-700">{simEnv} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simEnv} 
                    onChange={(e) => setSimEnv(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="text-[10px] text-slate-500">Contribution: {(simEnv * 0.2).toFixed(1)} pts</div>
                </div>

                {/* Historical Risk Slider (15%) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Historical Risk (15%)</span>
                    <span className="font-mono text-amber-700">{simHist} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simHist} 
                    onChange={(e) => setSimHist(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="text-[10px] text-slate-500">Contribution: {(simHist * 0.15).toFixed(1)} pts</div>
                </div>

              </div>

              <div className="bg-slate-100 rounded-lg p-2.5 font-mono text-xs text-center border border-slate-200 text-slate-700">
                Score = ({simVisual} × 0.40) + ({simRetention} × 0.25) + ({simEnv} × 0.20) + ({simHist} × 0.15) = <strong>{simResult.score}</strong> ({simResult.level})
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated: {new Date(hotspot.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="flex items-center gap-2">
            <DownloadReportButton
              hotspot={hotspot}
              variant="outline"
              buttonId="modal-footer-download-report-btn"
            />

            <button
              id="modal-close-bottom-btn"
              onClick={() => setSelectedHotspotId(null)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-card border border-slate-300 hover:bg-slate-100 transition"
            >
              Close
            </button>

            {hotspot.status === 'OPEN' && (
              <button
                id="modal-dispatch-task-btn"
                onClick={() => {
                  setSelectedHotspotId(null);
                  setDispatchModalHotspotId(hotspot.hotspot_id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Intervention</span>
              </button>
            )}

            {hotspot.status === 'RESOLVED' && (
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified & Resolved</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

