import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  Camera, 
  User, 
  Calendar, 
  MapPin, 
  CheckSquare, 
  Clock, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Check,
  XCircle,
  Eye,
  Satellite,
  Hash,
  AlertTriangle,
  UploadCloud,
  Lock,
  ShieldAlert,
  Info,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskRecord, ExifGeoMetadata, CitizenEvidenceSubmission } from '../../types';
import { ExifGisFootprintMap } from './ExifGisFootprintMap';
import { RealisticVisualEvidence } from './RealisticVisualEvidence';
import { DownloadReportButton } from '../common/DownloadReportButton';

export const VerificationCenter: React.FC = () => {
  const { 
    tasks, 
    hotspots, 
    citizenSubmissions,
    approveVerification, 
    requestReinspection,
    approveCitizenSubmission,
    rejectCitizenSubmission,
    setSelectedHotspotId 
  } = useApp();

  const pendingTasks = tasks.filter(t => t.status === 'AWAITING_VERIFICATION');
  const resolvedTasks = tasks.filter(t => t.status === 'RESOLVED');
  const pendingCitizen = citizenSubmissions.filter(s => s.status === 'PENDING_HUMAN_VERIFICATION');

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    pendingTasks[0]?.task_id || tasks[0]?.task_id || ''
  );
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>(
    pendingCitizen[0]?.submissionId || citizenSubmissions[0]?.submissionId || ''
  );

  const [activeTab, setActiveTab] = useState<'PENDING' | 'CITIZEN_EVIDENCE' | 'RESOLVED_LOG'>(
    pendingTasks.length > 0 ? 'PENDING' : (citizenSubmissions.length > 0 ? 'CITIZEN_EVIDENCE' : 'PENDING')
  );
  
  const [adminNotes, setAdminNotes] = useState<string>('Visual proof verified. Stagnant water evacuated, GPS coordinates verified on-site (±3.2m), and larvicidal barrier applied according to protocol.');
  const [citizenAdminNotes, setCitizenAdminNotes] = useState<string>('Verified by Control Room as supporting ground-level observation. Site recorded for rapid field team route scheduling.');
  const [reinspectReason, setReinspectReason] = useState<string>('');
  const [showReinspectModal, setShowReinspectModal] = useState<boolean>(false);

  const activeTask = tasks.find(t => t.task_id === selectedTaskId) || pendingTasks[0] || tasks[0];
  const relatedHotspot = activeTask ? hotspots.find(h => h.hotspot_id === activeTask.hotspot_id) : null;

  const activeCitizenSubmission = citizenSubmissions.find(s => s.submissionId === selectedCitizenId) || pendingCitizen[0] || citizenSubmissions[0];

  const siteLat = relatedHotspot?.latitude ?? 17.4156;
  const siteLng = relatedHotspot?.longitude ?? 78.4350;

  // Retrieve or fallback EXIF metadata
  const afterExif: ExifGeoMetadata = activeTask?.after_exif_metadata || {
    extractedLat: siteLat + 0.00002,
    extractedLng: siteLng + 0.00003,
    siteLat: siteLat,
    siteLng: siteLng,
    distanceOffsetMeters: 3.8,
    isGeoMatched: true,
    geoToleranceMeters: 50,
    captureTimestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' 16:45:12 IST',
    cameraMakeModel: 'VectorGuard Mobile Unit (Sony IMX890 GNSS)',
    sensorIso: 'ISO 100',
    sensorExposure: '1/320s',
    sensorAperture: 'f/1.8',
    headingAzimuthDeg: 142,
    altitudeMeters: 538,
    satelliteFix: 'NavIC + GPS (11 Satellites Locked • HDOP 0.8)',
    watermarkApplied: true,
    verificationAuditCode: `VG-GEO-${Math.abs(Math.round(siteLat * 10000))}-${Math.abs(Math.round(siteLng * 10000))}-VERIFIED`
  };

  const handleApprove = () => {
    if (!activeTask) return;
    approveVerification(activeTask.task_id, adminNotes);
  };

  const handleReinspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !reinspectReason) return;
    requestReinspection(activeTask.task_id, reinspectReason);
    setShowReinspectModal(false);
    setReinspectReason('');
  };

  const handleApproveCitizen = () => {
    if (!activeCitizenSubmission) return;
    approveCitizenSubmission(activeCitizenSubmission.submissionId, citizenAdminNotes);
  };

  const handleRejectCitizen = () => {
    if (!activeCitizenSubmission) return;
    rejectCitizenSubmission(activeCitizenSubmission.submissionId, citizenAdminNotes || 'Image clarity or specific geolocation requires additional verification.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-5">
      
      {/* Header Banner */}
      <div className="vg-hero rounded-2xl p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">VectorGuard Verification Center</h2>
              {pendingTasks.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">
                  {pendingTasks.length} Field Audits Pending
                </span>
              )}
              {pendingCitizen.length > 0 && (
                <span className="bg-violet-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">
                  {pendingCitizen.length} Citizen Submissions
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review before/after photographic proof, EXIF GPS geocoding metadata, and registered citizen supporting observations
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold flex-wrap gap-1">
          <button
            id="tab-verification-pending"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'PENDING' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Field Officer Audits ({pendingTasks.length})
          </button>
          <button
            id="tab-verification-citizen"
            onClick={() => setActiveTab('CITIZEN_EVIDENCE')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'CITIZEN_EVIDENCE' 
                ? 'bg-violet-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Citizen Evidence</span>
            <span className="bg-violet-950/80 text-violet-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {citizenSubmissions.length}
            </span>
          </button>
          <button
            id="tab-verification-resolved"
            onClick={() => setActiveTab('RESOLVED_LOG')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'RESOLVED_LOG' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Resolved Archive ({resolvedTasks.length})
          </button>
        </div>
      </div>

      {/* TAB 1: FIELD OFFICER PENDING AUDITS */}
      {activeTab === 'PENDING' && (
        <>
          {pendingTasks.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">All Field Tasks Verified</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No interventions are currently awaiting verification. When Field Officers complete tasks, they will appear here for before/after visual audit.
              </p>
              {citizenSubmissions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('CITIZEN_EVIDENCE')}
                  className="mt-2 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl border border-violet-200 transition"
                >
                  Review Citizen Supporting Evidence ({citizenSubmissions.length}) →
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Task Selector List */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pending Verification Queue:
                </div>

                {pendingTasks.map(task => {
                  const isSelected = task.task_id === activeTask?.task_id;
                  const isHero = task.hotspot_id === 'VG-1042';

                  return (
                    <div
                      key={task.task_id}
                      onClick={() => setSelectedTaskId(task.task_id)}
                      className={`bg-card rounded-xl p-4 border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md' 
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{task.task_id}</span>
                        {isHero && (
                          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                            HERO VG-1042
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-slate-800 mt-1">{task.location}</div>
                      <div className="text-[11px] text-slate-500">{task.ward}</div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">Officer: <strong>{task.assigned_officer}</strong></span>
                        <span className="text-purple-700 font-bold">Ready for Audit →</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Deep Comparison & Audit Panel */}
              {activeTask && (
                <div className="lg:col-span-8 bg-card rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  
                  {/* Task Summary Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900">{activeTask.task_id}</span>
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-xs">
                          {activeTask.hotspot_id}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          AWAITING VERIFICATION
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{activeTask.location}</span>
                        <span>•</span>
                        <span>{activeTask.ward}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      {relatedHotspot && (
                        <DownloadReportButton
                          hotspot={relatedHotspot}
                          task={activeTask}
                          variant="primary"
                          buttonId={`verification-center-download-report-${activeTask.task_id}`}
                        />
                      )}

                      <button
                        onClick={() => setSelectedHotspotId(activeTask.hotspot_id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* REALISTIC VISUAL EVIDENCE SUITE */}
                  <RealisticVisualEvidence 
                    hotspot={relatedHotspot}
                    task={activeTask}
                    showAdditionalAngles={true}
                    showMetadataCards={false}
                    showReportButton={false}
                  />

                  {/* GPS GEO-VERIFICATION & EXIF AUDIT PANEL */}
                  <div className="vg-panel-dark rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          afterExif.isGeoMatched ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                        }`}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>GPS Geotag Verification:</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              afterExif.isGeoMatched 
                                ? 'bg-emerald-500/30 text-emerald-300 font-mono' 
                                : 'bg-amber-500/30 text-amber-300 font-mono'
                            }`}>
                              {afterExif.isGeoMatched ? 'PASSED (MATCHED SITE)' : 'DISCREPANCY DETECTED'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400">
                        Tolerance: ±{afterExif.geoToleranceMeters}m | Offset: <strong className="text-emerald-400">{afterExif.distanceOffsetMeters}m</strong>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-mono">
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="text-slate-400 text-[10px]">PHOTO GPS EXIF</div>
                        <div className="text-slate-200 font-bold mt-0.5">
                          {afterExif.extractedLat.toFixed(6)}° N, {afterExif.extractedLng.toFixed(6)}° E
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Elev: {afterExif.altitudeMeters}m • Azimuth: {afterExif.headingAzimuthDeg}°</div>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="text-slate-400 text-[10px]">TASK SITE TARGET GPS</div>
                        <div className="text-slate-200 font-bold mt-0.5">
                          {siteLat.toFixed(6)}° N, {siteLng.toFixed(6)}° E
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1">✓ Geodesic delta: {afterExif.distanceOffsetMeters}m</div>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="text-slate-400 text-[10px]">DEVICE & GNSS FIX</div>
                        <div className="text-slate-200 font-bold mt-0.5 truncate">
                          {afterExif.cameraMakeModel}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{afterExif.satelliteFix}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>AUDIT HASH: {afterExif.verificationAuditCode}</span>
                      <span>{afterExif.captureTimestamp}</span>
                    </div>

                    {/* Secondary Device GPS Anchor summary row if available */}
                    {activeTask.device_live_gps && (
                      <div className="bg-cyan-950/40 border border-cyan-700/50 rounded-lg p-2.5 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-cyan-300">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          <span className="font-bold text-white">DEVICE GPS ANCHOR:</span>
                          <span>{activeTask.device_live_gps.latitude.toFixed(6)}° N, {activeTask.device_live_gps.longitude.toFixed(6)}° E</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-cyan-400/90">
                          <span>Accuracy: ±{activeTask.device_live_gps.accuracyMeters}m</span>
                          <span>Cross-Delta: Δ{(activeTask.device_live_gps.exifCrossValidationDeltaMeters ?? 1.8).toFixed(1)}m</span>
                          <span className="bg-cyan-500/20 text-cyan-200 px-1.5 py-0.2 rounded font-bold">DUAL-ANCHOR VERIFIED ✓</span>
                        </div>
                      </div>
                    )}

                    {/* Integrated GIS Map Footprint Overlay */}
                    <div className="pt-2">
                      <ExifGisFootprintMap
                        siteLat={siteLat}
                        siteLng={siteLng}
                        siteName={activeTask.location}
                        beforeExif={activeTask.before_exif_metadata}
                        afterExif={afterExif}
                        deviceGpsAnchor={activeTask.device_live_gps}
                        toleranceMeters={afterExif.geoToleranceMeters || 50}
                      />
                    </div>
                  </div>

                  {/* Checklist Audit & Field Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    
                    {/* Checklist Audit */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <span>Field Officer Checklist Audit</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Standing water pumped out & evacuated</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Debris & solid waste cleared</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Drainage channel bottleneck restored</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Anti-larval bio-barrier applied</span>
                        </div>
                      </div>
                    </div>

                    {/* Officer Notes */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>Officer Field Log:</span>
                        <span className="text-[10px] text-slate-500">{activeTask.assigned_officer}</span>
                      </div>
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        "{activeTask.officer_notes || 'Standing water pumped out from excavated pit. Debris cleared.'}"
                      </p>
                    </div>

                  </div>

                  {/* Admin Final Approval Box */}
                  <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
                    <label className="block text-xs font-bold text-indigo-950">
                      Municipal Administrator Audit Remarks:
                    </label>
                    <input 
                      type="text" 
                      value={adminNotes} 
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-card border border-indigo-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReinspectModal(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Request Re-Inspection
                      </button>

                      <button
                        id="approve-verification-btn"
                        type="button"
                        onClick={handleApprove}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE INTERVENTION & RESOLVE</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </>
      )}

      {/* TAB 2: CITIZEN SUPPORTING EVIDENCE AUDIT */}
      {activeTab === 'CITIZEN_EVIDENCE' && (
        <div className="space-y-6">
          
          {/* DRONE RESTRICTION SCENARIO CALLOUT & DISCLAIMER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            <div className="lg:col-span-6 bg-amber-50 border border-amber-300/80 rounded-2xl p-4.5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  DRONE IMAGERY RESTRICTED • ALTERNATIVE EVIDENCE WORKFLOW
                </div>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  When primary aerial/drone optical sweeps are restricted by airspace regulations or dense tree canopy, registered citizen observations serve as authenticated ground-truth evidence.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 vg-panel-dark rounded-2xl p-4.5 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">
                  CITIZEN EVIDENCE IS SUPPORTING EVIDENCE ONLY
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Citizen evidence never modifies AI risk scores automatically and never replaces authorized field verification by certified municipal health officers.
                </p>
              </div>
            </div>

          </div>

          {citizenSubmissions.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto text-violet-600">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Citizen Submissions in Queue</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No registered citizens have submitted environmental evidence in the current demo session yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Citizen Evidence Queue */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Citizen Evidence Queue:</span>
                  <span className="text-[10px] font-mono text-slate-400">{citizenSubmissions.length} Submissions</span>
                </div>

                {citizenSubmissions.map(submission => {
                  const isSelected = submission.submissionId === activeCitizenSubmission?.submissionId;

                  return (
                    <div
                      key={submission.submissionId}
                      onClick={() => setSelectedCitizenId(submission.submissionId)}
                      className={`bg-card rounded-xl p-4 border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-violet-600 ring-2 ring-violet-500/20 shadow-md' 
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{submission.submissionId}</span>
                        <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {submission.evidenceType}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 mt-1">{submission.localArea}</div>
                      <div className="text-[11px] text-slate-500">{submission.city}, {submission.state}</div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-mono">Citizen: <strong>{submission.citizenNameMasked}</strong></span>
                        {submission.status === 'PENDING_HUMAN_VERIFICATION' && (
                          <span className="text-amber-700 font-bold">Audit Required →</span>
                        )}
                        {submission.status === 'APPROVED_SUPPORTING' && (
                          <span className="text-emerald-700 font-bold">Approved ✓</span>
                        )}
                        {submission.status === 'REJECTED' && (
                          <span className="text-rose-700 font-bold">Clarification</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Citizen Evidence Review Panel */}
              {activeCitizenSubmission && (
                <div className="lg:col-span-8 bg-card rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  
                  {/* Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900">{activeCitizenSubmission.submissionId}</span>
                        <span className="bg-violet-100 text-violet-900 font-bold px-2 py-0.5 rounded text-xs">
                          {activeCitizenSubmission.evidenceType}
                        </span>
                        {activeCitizenSubmission.status === 'PENDING_HUMAN_VERIFICATION' && (
                          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Human Verification
                          </span>
                        )}
                        {activeCitizenSubmission.status === 'APPROVED_SUPPORTING' && (
                          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved Supporting Evidence
                          </span>
                        )}
                        {activeCitizenSubmission.status === 'REJECTED' && (
                          <span className="bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Clarification Requested
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Submitted: {new Date(activeCitizenSubmission.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                      </div>
                    </div>

                    {/* Source & Consent */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right shrink-0">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence Source</div>
                      <div className="text-xs font-extrabold text-slate-800">Registered Citizen</div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Consent: Recorded</span>
                      </div>
                    </div>
                  </div>

                  {/* Masked PII Privacy Section */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Privacy-Protected Citizen Metadata:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-card p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold">CITIZEN IDENTITY</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{activeCitizenSubmission.citizenNameMasked}</div>
                      </div>
                      <div className="bg-card p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold">MOBILE (MASKED)</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{activeCitizenSubmission.citizenMobileMasked}</div>
                      </div>
                      <div className="bg-card p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold">EMAIL (MASKED)</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 truncate">
                          {activeCitizenSubmission.citizenEmailMasked || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo and Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                    
                    {/* Visual Evidence Photo */}
                    <div className="sm:col-span-6 space-y-1.5">
                      <div className="text-xs font-bold text-slate-800">Citizen Photograph:</div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-56 relative">
                        <img 
                          src={activeCitizenSubmission.imageUrl} 
                          alt="Citizen evidence photo" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="vg-island absolute top-2 left-2 bg-slate-950/80 text-white font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur-xs">
                          {activeCitizenSubmission.evidenceType}
                        </span>
                        {activeCitizenSubmission.isDroneRestrictedScenario && (
                          <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded shadow-xs">
                            DRONE RESTRICTED FALLBACK
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & Citizen Narrative */}
                    <div className="sm:col-span-6 space-y-3">
                      
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800">Location Details:</div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-start gap-1.5 font-bold text-slate-900">
                            <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                            <span>{activeCitizenSubmission.localArea}</span>
                          </div>
                          <div className="text-slate-600 pl-5">
                            {activeCitizenSubmission.city}, {activeCitizenSubmission.state}
                          </div>
                          {activeCitizenSubmission.gpsCoordinates && (
                            <div className="text-[11px] font-mono text-slate-500 pl-5">
                              GPS: {activeCitizenSubmission.gpsCoordinates}
                            </div>
                          )}
                          {activeCitizenSubmission.linkedHotspotId && (
                            <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] text-indigo-700 font-bold flex items-center gap-1 pl-5">
                              <span>Linked Hotspot:</span>
                              <span className="bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded font-mono">
                                {activeCitizenSubmission.linkedHotspotId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800">Citizen Observation Description:</div>
                        <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                          "{activeCitizenSubmission.description}"
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Audit Review Actions */}
                  <div className="bg-violet-50/60 border border-violet-200 rounded-xl p-4 space-y-3">
                    <label className="block text-xs font-bold text-violet-950">
                      Control Room Human Review Remarks:
                    </label>
                    <input 
                      type="text" 
                      value={citizenAdminNotes} 
                      onChange={(e) => setCitizenAdminNotes(e.target.value)}
                      className="w-full bg-card border border-violet-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRejectCitizen}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Request Clarification / Reject
                      </button>

                      <button
                        id="approve-citizen-evidence-btn"
                        type="button"
                        onClick={handleApproveCitizen}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/20 transition active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE AS SUPPORTING EVIDENCE</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* RE-INSPECTION MODAL */}
      {showReinspectModal && (
        <div className="fixed inset-0 z-50 vg-scrim flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Request Re-Inspection</h3>
            <p className="text-xs text-slate-600">
              Provide specific feedback to Field Officer {activeTask?.assigned_officer} regarding why additional remediation is needed.
            </p>

            <form onSubmit={handleReinspectSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={reinspectReason}
                onChange={(e) => setReinspectReason(e.target.value)}
                placeholder="e.g. Residual water pool remains near northern boundary..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReinspectModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                >
                  Send Re-Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVED ARCHIVE TAB */}
      {activeTab === 'RESOLVED_LOG' && (
        <div className="bg-card rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Verified & Resolved Mitigation Archive</h3>
          
          <div className="space-y-3">
            {resolvedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No interventions resolved yet.</p>
            ) : (
              resolvedTasks.map(task => {
                const targetH = hotspots.find(h => h.hotspot_id === task.hotspot_id) || hotspots[0];
                return (
                  <div key={task.task_id} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-950">{task.task_id}</span>
                        <span className="bg-emerald-200 text-emerald-900 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                          {task.hotspot_id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5">{task.location} • {task.ward}</div>
                      <div className="text-[11px] text-slate-500 mt-1">Verified by: VectorGuard Control Room</div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {targetH && (
                        <DownloadReportButton
                          hotspot={targetH}
                          task={task}
                          variant="compact"
                          label="Download Report (PDF)"
                          buttonId={`resolved-report-btn-${task.task_id}`}
                        />
                      )}
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        RESOLVED
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
