import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Send, 
  ArrowLeft, 
  Navigation, 
  Building2, 
  History, 
  User, 
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Check,
  FileCheck,
  Layers,
  Eye,
  RefreshCw,
  LocateFixed,
  Radio,
  Crosshair,
  Compass,
  Satellite
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskRecord, HotspotRecord, ExifGeoMetadata, DeviceGpsAnchor } from '../../types';
import { DEMO_EVIDENCE_IMAGES } from '../../data/evidenceImages';
import { RealtimeGpsIndicator } from './RealtimeGpsIndicator';
import { ExifVerificationBadge } from './ExifVerificationBadge';
import { 
  extractExifFromBinary, 
  generatePhotoExifMetadata, 
  applyExifWatermarkToImage,
  fetchDeviceGpsAnchor 
} from '../../utils/exifGeoEngine';

export const FieldOfficerApp: React.FC = () => {
  const { 
    currentUser, 
    tasks, 
    hotspots, 
    activeTaskId, 
    setActiveTaskId, 
    startInspection, 
    submitIntervention, 
    activeView, 
    setActiveView 
  } = useApp();

  // Active task state
  const selectedTask = tasks.find(t => t.task_id === activeTaskId) || tasks[0];
  const relatedHotspot = selectedTask ? hotspots.find(h => h.hotspot_id === selectedTask.hotspot_id) : null;

  const siteLat = relatedHotspot?.latitude ?? (selectedTask ? 17.4156 : 17.4156);
  const siteLng = relatedHotspot?.longitude ?? (selectedTask ? 78.4350 : 78.4350);
  const taskLocationName = selectedTask?.location || relatedHotspot?.location || 'Ward 12, Hyderabad';

  // Field Evidence State
  const [beforeImage, setBeforeImage] = useState<string>(
    selectedTask?.before_evidence_url || DEMO_EVIDENCE_IMAGES.vg1042_before
  );
  const [beforeRawImage, setBeforeRawImage] = useState<string>(
    DEMO_EVIDENCE_IMAGES.vg1042_before
  );
  const [beforeExif, setBeforeExif] = useState<ExifGeoMetadata | undefined>(
    selectedTask?.before_exif_metadata || generatePhotoExifMetadata({ siteLat, siteLng })
  );
  const [beforeUploaded, setBeforeUploaded] = useState<boolean>(
    Boolean(selectedTask?.before_evidence_url)
  );

  const [afterImage, setAfterImage] = useState<string>(
    selectedTask?.after_evidence_url || DEMO_EVIDENCE_IMAGES.vg1042_after
  );
  const [afterRawImage, setAfterRawImage] = useState<string>(
    DEMO_EVIDENCE_IMAGES.vg1042_after
  );
  const [afterExif, setAfterExif] = useState<ExifGeoMetadata | undefined>(
    selectedTask?.after_exif_metadata || generatePhotoExifMetadata({ siteLat, siteLng })
  );
  const [afterUploaded, setAfterUploaded] = useState<boolean>(
    Boolean(selectedTask?.after_evidence_url)
  );

  const [isProcessingBefore, setIsProcessingBefore] = useState<boolean>(false);
  const [isProcessingAfter, setIsProcessingAfter] = useState<boolean>(false);

  const [checklist, setChecklist] = useState({
    remove_standing_water: selectedTask?.intervention_checklist?.remove_standing_water ?? true,
    clear_debris: selectedTask?.intervention_checklist?.clear_debris ?? true,
    restore_drainage: selectedTask?.intervention_checklist?.restore_drainage ?? true,
    treat_retention_area: selectedTask?.intervention_checklist?.treat_retention_area ?? true,
    remove_containers: selectedTask?.intervention_checklist?.remove_containers ?? true,
    other_preventive_action: selectedTask?.intervention_checklist?.other_preventive_action ?? false
  });

  const [officerNotes, setOfficerNotes] = useState<string>(
    selectedTask?.officer_notes || 
    'Pumped out standing water from excavated construction pit (~120 sq.m). Cleared accumulated plastic and masonry debris. Applied biological larvicide barrier (Bti / Temephos granules) around perimeter drainage sumps.'
  );

  // Device GPS Secondary Validation Anchor State
  const [deviceGpsAnchor, setDeviceGpsAnchor] = useState<DeviceGpsAnchor | undefined>(
    selectedTask?.device_live_gps
  );
  const [isAcquiringGps, setIsAcquiringGps] = useState<boolean>(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  const handleGetCurrentPosition = async () => {
    setIsAcquiringGps(true);
    try {
      const anchor = await fetchDeviceGpsAnchor({
        siteLat,
        siteLng,
        photoExifLat: afterExif?.extractedLat || beforeExif?.extractedLat,
        photoExifLng: afterExif?.extractedLng || beforeExif?.extractedLng,
        toleranceMeters: 50
      });
      setDeviceGpsAnchor(anchor);
      setGpsNotification(`Device GPS Lock: ${anchor.latitude.toFixed(6)}° N, ${anchor.longitude.toFixed(6)}° E`);
      setTimeout(() => setGpsNotification(null), 5000);
    } catch (err) {
      console.error('Failed to acquire device GPS coordinates:', err);
    } finally {
      setIsAcquiringGps(false);
    }
  };

  useEffect(() => {
    if (selectedTask?.device_live_gps) {
      setDeviceGpsAnchor(selectedTask.device_live_gps);
    } else {
      handleGetCurrentPosition();
    }
  }, [selectedTask?.task_id, siteLat, siteLng]);

  useEffect(() => {
    const initWatermarking = async () => {
      if (!selectedTask?.before_evidence_url && DEMO_EVIDENCE_IMAGES.vg1042_before) {
        const meta = generatePhotoExifMetadata({ siteLat, siteLng });
        setBeforeExif(meta);
        try {
          const stamped = await applyExifWatermarkToImage(DEMO_EVIDENCE_IMAGES.vg1042_before, meta, {
            hotspotId: selectedTask?.hotspot_id || 'VG-1042',
            taskId: selectedTask?.task_id,
            location: taskLocationName,
            ward: selectedTask?.ward || relatedHotspot?.ward || 'Ward 12',
            city: relatedHotspot?.city || 'Hyderabad',
            officerName: currentUser.name,
            label: 'BEFORE INTERVENTION'
          });
          setBeforeImage(stamped);
        } catch {
          // fallback
        }
      }

      if (!selectedTask?.after_evidence_url && DEMO_EVIDENCE_IMAGES.vg1042_after) {
        const meta = generatePhotoExifMetadata({ siteLat, siteLng });
        setAfterExif(meta);
        try {
          const stamped = await applyExifWatermarkToImage(DEMO_EVIDENCE_IMAGES.vg1042_after, meta, {
            hotspotId: selectedTask?.hotspot_id || 'VG-1042',
            taskId: selectedTask?.task_id,
            location: taskLocationName,
            ward: selectedTask?.ward || relatedHotspot?.ward || 'Ward 12',
            city: relatedHotspot?.city || 'Hyderabad',
            officerName: currentUser.name,
            label: 'AFTER INTERVENTION'
          });
          setAfterImage(stamped);
        } catch {
          // fallback
        }
      }
    };

    initWatermarking();
  }, [selectedTask?.task_id, siteLat, siteLng]);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartInspection = () => {
    if (!selectedTask) return;
    startInspection(selectedTask.task_id);
    setActiveView('ACTIVE_INSPECTION');
  };

  const handleSubmitForVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    submitIntervention({
      taskId: selectedTask.task_id,
      beforeEvidenceUrl: beforeImage,
      beforeExifMetadata: beforeExif,
      afterEvidenceUrl: afterImage,
      afterExifMetadata: afterExif,
      deviceGpsAnchor: deviceGpsAnchor,
      checklist,
      officerNotes
    });

    setActiveView('MY_TASKS');
  };

  const processImageWithExif = async (
    rawSrc: string,
    target: 'before' | 'after',
    options?: { parsedExif?: { lat?: number; lng?: number; cameraModel?: string }; forceMismatch?: boolean }
  ) => {
    if (target === 'before') setIsProcessingBefore(true);
    else setIsProcessingAfter(true);

    try {
      const meta = generatePhotoExifMetadata({
        siteLat,
        siteLng,
        parsedExif: options?.parsedExif,
        forceMismatch: options?.forceMismatch
      });

      const watermarkedUrl = await applyExifWatermarkToImage(rawSrc, meta, {
        hotspotId: selectedTask?.hotspot_id || 'VG-1042',
        taskId: selectedTask?.task_id,
        location: taskLocationName,
        ward: selectedTask?.ward || relatedHotspot?.ward || 'Ward 12',
        city: relatedHotspot?.city || 'Hyderabad',
        officerName: currentUser.name,
        label: target === 'before' ? 'BEFORE INTERVENTION' : 'AFTER INTERVENTION'
      });

      if (target === 'before') {
        setBeforeImage(watermarkedUrl);
        setBeforeRawImage(rawSrc);
        setBeforeExif(meta);
        setBeforeUploaded(true);
      } else {
        setAfterImage(watermarkedUrl);
        setAfterRawImage(rawSrc);
        setAfterExif(meta);
        setAfterUploaded(true);
      }
    } catch (err) {
      console.error('Failed to process image EXIF:', err);
    } finally {
      if (target === 'before') setIsProcessingBefore(false);
      else setIsProcessingAfter(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const parsedExif = extractExifFromBinary(arrayBuffer);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawSrc = event.target.result as string;
          await processImageWithExif(rawSrc, target, { parsedExif });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 font-sans text-slate-900 select-none">
      
      {/* Mobile Terminal Top Banner */}
      <div className="bg-card rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-300/60 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">Field Operations Terminal</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.2 rounded font-mono border border-emerald-200 whitespace-nowrap">
                GPS LOCK ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Officer {currentUser.name} • {currentUser.team}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>EXIF Geo-Verification</span>
          </span>
        </div>
      </div>

      {/* Real-time GNSS RTK Status Card */}
      <RealtimeGpsIndicator 
        activeTask={selectedTask} 
        relatedHotspot={relatedHotspot} 
        deviceGpsAnchor={deviceGpsAnchor}
        onGetPosition={handleGetCurrentPosition}
        isAcquiring={isAcquiringGps}
      />

      {/* GPS Notification Toast Banner */}
      {gpsNotification && (
        <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-2 rounded-lg shadow-md flex items-center justify-between font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <LocateFixed className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{gpsNotification}</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
            ANCHOR SYNCED
          </span>
        </div>
      )}

      {/* VIEW 1: MY ASSIGNED TASKS */}
      {(activeView === 'MY_TASKS' || activeView === 'FIELD_OFFICER_PORTAL') && (
        <div className="space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-cyan-600" />
              <span>Assigned Remediation Tasks ({tasks.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500">Rapid Response Unit</span>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => {
              const isSelected = task.task_id === selectedTask?.task_id;
              const isHero = task.hotspot_id === 'VG-1042';

              return (
                <div 
                  key={task.task_id}
                  className={`bg-card rounded-xl p-4 border transition shadow-sm ${
                    isSelected 
                      ? 'border-cyan-500/80 ring-1 ring-cyan-500/30' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-slate-900 text-sm">{task.task_id}</span>
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-xs border border-slate-200">
                          {task.hotspot_id}
                        </span>
                        {isHero && (
                          <span className="bg-amber-400 text-[#1a1300] font-black text-[10px] px-1.5 py-0.2 rounded">
                            HERO SITE
                          </span>
                        )}
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                          task.priority === 'Critical' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : task.priority === 'High' 
                              ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span>{task.location}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-normal">{task.ward}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.status === 'ASSIGNED' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : task.status === 'IN_PROGRESS' 
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
                          : task.status === 'AWAITING_VERIFICATION' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 bg-slate-50 rounded-md text-xs space-y-1 border border-slate-200/80 font-sans">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span>Action: {task.recommended_action}</span>
                    </div>
                    <div className="text-slate-500 text-[10px] flex items-center justify-between pt-0.5 tabular-nums">
                      <span>Assigned by: {task.assigned_by}</span>
                      <span className="text-slate-700">Deadline: {task.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-[10px] text-slate-500">
                      Officer: <strong>{task.assigned_officer}</strong>
                    </div>

                    {task.status === 'ASSIGNED' && (
                      <button
                        id={`start-inspection-btn-${task.task_id}`}
                        onClick={() => {
                          setActiveTaskId(task.task_id);
                          handleStartInspection();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-xs transition tracking-wide"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>START INSPECTION (STEP 10)</span>
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => {
                          setActiveTaskId(task.task_id);
                          setActiveView('ACTIVE_INSPECTION');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-xs transition tracking-wide"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>CONTINUE EVIDENCE (STEP 11)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE INSPECTION & EXIF EVIDENCE WORKFLOW */}
      {activeView === 'ACTIVE_INSPECTION' && selectedTask && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <button
              onClick={() => setActiveView('MY_TASKS')}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Assigned Tasks</span>
            </button>
            <span className="text-xs font-mono text-cyan-600 font-bold">
              Task: {selectedTask.task_id} ({selectedTask.hotspot_id})
            </span>
          </div>

          {/* Site Geo Target Header */}
          <div className="bg-card rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  {selectedTask.hotspot_id}: {taskLocationName}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Target Coords: {siteLat.toFixed(5)}° N, {siteLng.toFixed(5)}° E • {selectedTask.ward}
                </p>
              </div>
              <span className="bg-red-50 text-red-700 font-mono text-xs font-bold px-2 py-0.5 rounded border border-red-200">
                CRITICAL TARGET
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitForVerification} className="space-y-4">
            
            {/* Step A: Before Intervention Evidence */}
            <div className="bg-card rounded-xl p-4 border border-slate-200 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span className="font-bold text-slate-900 text-xs uppercase">
                    BEFORE INTERVENTION (EVIDENCE CAPTURE)
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">WATERMARK APPLIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={beforeImage} alt="Before Intervention" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex flex-col justify-between">
                  <ExifVerificationBadge 
                    metadata={beforeExif}
                    targetSiteLat={siteLat}
                    targetSiteLng={siteLng}
                    taskLocationName={taskLocationName}
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition">
                      <Camera className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Retake / Upload Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'before')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Step B: Preventive Remediation Checklist */}
            <div className="bg-card rounded-xl p-4 border border-slate-200 space-y-2.5 font-sans text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <span className="font-bold text-slate-900 text-xs uppercase">
                  REMEDIATION ACTIONS EXECUTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(checklist).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleChecklistItem(key as keyof typeof checklist)}
                    className={`p-2 rounded border text-left flex items-center gap-2 transition ${
                      value 
                        ? 'bg-emerald-50/40 border-emerald-300/60 text-emerald-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {value ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                    <span className="text-[11px] font-sans capitalize">{key.replace(/_/g, ' ')}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Field Officer Inspection Log Notes</label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Step C: After Intervention Evidence */}
            <div className="bg-card rounded-xl p-4 border border-slate-200 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span className="font-bold text-slate-900 text-xs uppercase">
                    AFTER INTERVENTION (POST-REMEDIATION PROOF)
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">WATERMARK APPLIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={afterImage} alt="After Intervention" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex flex-col justify-between">
                  <ExifVerificationBadge 
                    metadata={afterExif}
                    targetSiteLat={siteLat}
                    targetSiteLng={siteLng}
                    taskLocationName={taskLocationName}
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition">
                      <Camera className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Retake / Upload Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'after')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Submission Button */}
            <div className="pt-2">
              <button
                id="submit-verification-btn"
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition font-mono uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT FOR CONTROL ROOM VERIFICATION (STEP 12)</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* VIEW 3: INTERVENTION HISTORY */}
      {activeView === 'HISTORY' && (
        <div className="space-y-3 font-sans text-xs">
          <div className="pb-1 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Field Intervention History
            </h3>
          </div>

          <div className="bg-card rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[11px]">
              <span className="font-bold text-slate-900">TSK-6591 (VG-1042)</span>
              <span className="text-emerald-600 font-bold">VERIFIED & APPROVED</span>
            </div>
            <p className="text-slate-500 font-sans text-xs">
              Remediated stagnant water retention pit. Bti larvicide barrier applied. Cleared by Dr. Neha Sharma.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
