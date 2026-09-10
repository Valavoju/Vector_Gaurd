import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  X, 
  RotateCcw,
  Building2,
  Smartphone,
  Maximize2,
  Minimize2,
  MoveHorizontal,
  Lightbulb,
  CheckCircle2,
  Layers,
  MapPin,
  Camera,
  Cpu,
  ShieldCheck,
  ClipboardList,
  FileCheck,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_EVIDENCE_IMAGES } from '../../data/evidenceImages';

export interface WalkthroughStep {
  step: number;
  title: string;
  stageBadge: 'PREDICT' | 'VERIFY' | 'PREVENT' | 'LEARN';
  stageNumber: '01' | '02' | '03' | '04';
  role: 'ADMIN' | 'FIELD_OFFICER';
  view: string;
  headline: string;
  description: string;
  keyPoints: { label: string; value: string }[];
  methodologyNote?: string;
  actionButtonText: string;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  // STEP 01 — CONTROL ROOM
  {
    step: 1,
    title: 'STEP 01 — CONTROL ROOM',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'DASHBOARD',
    headline: 'VectorGuard AI Control Room',
    description: 'Centralized municipal command center for predictive vector-risk monitoring and preventive intervention coordination.',
    keyPoints: [
      { label: 'OPERATIONS', value: 'Predictive Water-Retention Monitoring' },
      { label: 'DISPATCH', value: 'Rapid Response Unit Operations' },
      { label: 'VERIFICATION', value: 'Multi-Sensor Ground Truth & GPS Audit' },
      { label: 'GOVERNANCE', value: 'Continuous Feedback & Model Calibration' }
    ],
    actionButtonText: 'Launch National GIS Map →'
  },
  // STEP 02 — NATIONAL GIS MAP
  {
    step: 2,
    title: 'STEP 02 — NATIONAL GIS MAP',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: 'India-Wide Risk Overview',
    description: 'VectorGuard maps predicted risk across 30 illustrative surveillance hotspots spanning multiple Indian states, cities, and wards.',
    keyPoints: [
      { label: 'HOTSPOTS', value: '30 Illustrative Sites' },
      { label: 'GEOGRAPHY', value: '19 States, 21 Municipalities' },
      { label: 'COVERAGE', value: 'North, South, East, West & Central' },
      { label: 'DATASET', value: 'Demo / Pilot Data — Illustrative' }
    ],
    actionButtonText: 'Explore Prediction Signals →'
  },
  // STEP 03 — PREDICT MULTI-SIGNAL FUSION
  {
    step: 3,
    title: 'STEP 03 — PREDICT',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: 'Predictive Multi-Signal Fusion',
    description: 'AI combines spatial, weather, and historical signals to predict locations where water is likely to be retained before vectors breed.',
    keyPoints: [
      { label: 'WEATHER INPUTS', value: 'Rainfall (42mm), Temp, Humidity' },
      { label: 'SPATIAL / GIS', value: 'Elevation, Sump Drainage Obstruction' },
      { label: 'HISTORICAL RISK', value: 'Seasonal Stagnation Patterns' },
      { label: 'ENVIRONMENTAL', value: 'Excavation Trench & Construction Pit' }
    ],
    actionButtonText: 'Prioritize Hotspots →'
  },
  // STEP 04 — PRIORITIZE
  {
    step: 4,
    title: 'STEP 04 — PRIORITIZE',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: 'Risk Classification & Ranking',
    description: 'Locations are dynamically classified and ranked so municipal resources focus immediately on the highest-priority sites.',
    keyPoints: [
      { label: 'CRITICAL (81–100)', value: '7 Sites (Immediate Action)' },
      { label: 'HIGH (61–80)', value: '8 Sites (24h Window)' },
      { label: 'MODERATE (31–60)', value: '9 Sites (Scheduled)' },
      { label: 'LOW (0–30)', value: '6 Sites (Monitoring)' }
    ],
    actionButtonText: 'Select Hero Hotspot VG-1042 →'
  },
  // STEP 05 — HERO HOTSPOT VG-1042
  {
    step: 5,
    title: 'STEP 05 — HERO HOTSPOT',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: 'Hero Hotspot: VG-1042',
    description: 'Ward 12, Banjara Hills / Jubilee Hills, Hyderabad, Telangana — Construction Site — 82 / 100 — CRITICAL priority.',
    keyPoints: [
      { label: 'HOTSPOT ID', value: 'VG-1042' },
      { label: 'LOCATION', value: 'Ward 12, Hyderabad, Telangana' },
      { label: 'SITE TYPE', value: 'Construction Excavation Pit' },
      { label: 'BREEDING RISK', value: '82 / 100 (CRITICAL)' }
    ],
    actionButtonText: 'View AI Explanation →'
  },
  // STEP 06 — AI RISK EXPLANATION
  {
    step: 6,
    title: 'STEP 06 — AI EXPLANATION',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: 'AI Causal Risk Explanation',
    description: 'VectorGuard explains why this site is prioritized: 42 mm recent rainfall, poor foundation drainage, active excavation pit, and historical stagnation.',
    keyPoints: [
      { label: 'RAINFALL', value: '42 mm (Recent monsoonal surge)' },
      { label: 'DRAINAGE', value: 'Poor (Foundation sump obstruction)' },
      { label: 'CONSTRUCTION', value: 'Active Excavation Pit' },
      { label: 'HISTORICAL', value: 'Known seasonal water retention' }
    ],
    actionButtonText: 'Inspect Risk Score Formula →'
  },
  // STEP 07 — RISK SCORE FORMULA
  {
    step: 7,
    title: 'STEP 07 — RISK SCORE',
    stageBadge: 'PREDICT',
    stageNumber: '01',
    role: 'ADMIN',
    view: 'RISK_MAP',
    headline: '82 / 100 Weighted Score Breakdown',
    description: 'Transparent multi-modal index: 40% Visual Condition (90) + 25% Water Retention (82) + 20% Environmental (75) + 15% Historical (70) = Final 82.',
    keyPoints: [
      { label: 'VISUAL CONDITION (40%)', value: 'Score: 90 / 100' },
      { label: 'WATER RETENTION (25%)', value: 'Score: 82 / 100' },
      { label: 'ENVIRONMENTAL (20%)', value: 'Score: 75 / 100' },
      { label: 'HISTORICAL RISK (15%)', value: 'Score: 70 / 100' }
    ],
    methodologyNote: 'Decision-support score only — not a medical diagnosis.',
    actionButtonText: 'Examine Drone Evidence →'
  },
  // STEP 08 — TARGETED DRONE IMAGERY
  {
    step: 8,
    title: 'STEP 08 — TARGETED DRONE',
    stageBadge: 'VERIFY',
    stageNumber: '02',
    role: 'ADMIN',
    view: 'HOTSPOTS',
    headline: 'Targeted Drone Imagery',
    description: 'Targeted imagery is obtained only where additional verification is required. VectorGuard does not conduct blanket city-wide drone flights.',
    keyPoints: [
      { label: 'SURVEY TYPE', value: 'Targeted Drone Flight' },
      { label: 'FLIGHT ID', value: 'DRN-HYD-1042' },
      { label: 'RESOLUTION', value: 'Sub-centimeter GSD (1.2 cm/px)' },
      { label: 'REASON', value: 'High-priority visual ground check' }
    ],
    actionButtonText: 'Run Computer Vision Detection →'
  },
  // STEP 09 — COMPUTER VISION VERIFICATION
  {
    step: 9,
    title: 'STEP 09 — COMPUTER VISION',
    stageBadge: 'VERIFY',
    stageNumber: '02',
    role: 'ADMIN',
    view: 'HOTSPOTS',
    headline: 'CV Verification: STAGNANT WATER',
    description: 'Computer vision verifies environmental conditions, not mosquitoes. Detected: Stagnant water pool with 92% confidence.',
    keyPoints: [
      { label: 'DETECTION', value: 'STAGNANT WATER (92% Conf.)' },
      { label: 'TAGS', value: 'Standing water, Debris, Pit' },
      { label: 'SURFACE TYPE', value: 'Excavation trench foundation' },
      { label: 'AREA ESTIMATE', value: '~120 sq. meters' }
    ],
    actionButtonText: 'Verify in Control Room →'
  },
  // STEP 10 — HUMAN VERIFICATION
  {
    step: 10,
    title: 'STEP 10 — HUMAN VERIFICATION',
    stageBadge: 'VERIFY',
    stageNumber: '02',
    role: 'ADMIN',
    view: 'VERIFICATION',
    headline: 'Municipal Human Verification',
    description: 'Control Room Admin audits the predicted risk against targeted drone evidence. Status: PENDING HUMAN REVIEW.',
    keyPoints: [
      { label: 'PREDICTED RISK', value: '82 — Critical' },
      { label: 'OBSERVED CONDITION', value: 'Stagnant Water (92%)' },
      { label: 'EVIDENCE SOURCE', value: 'Targeted Drone Imagery' },
      { label: 'STATUS', value: 'PENDING HUMAN REVIEW' }
    ],
    actionButtonText: 'Review Preventive Actions →'
  },
  // STEP 11 — PREVENTIVE ACTION
  {
    step: 11,
    title: 'STEP 11 — PREVENTIVE ACTION',
    stageBadge: 'PREVENT',
    stageNumber: '03',
    role: 'ADMIN',
    view: 'HOTSPOTS',
    headline: 'Prescriptive Remediation Protocol',
    description: 'Verified intelligence converts into concrete preventive protocol: Remove standing water, clear debris, and improve drainage.',
    keyPoints: [
      { label: 'ACTION 1', value: 'Remove standing water (suction pump)' },
      { label: 'ACTION 2', value: 'Clear debris from drainage channel' },
      { label: 'ACTION 3', value: 'Apply larvicide barrier (Bti agent)' },
      { label: 'MONITORING', value: '72h recurrence check' }
    ],
    actionButtonText: 'Dispatch Field Task →'
  },
  // STEP 12 — TASK DISPATCH
  {
    step: 12,
    title: 'STEP 12 — TASK DISPATCH',
    stageBadge: 'PREVENT',
    stageNumber: '03',
    role: 'ADMIN',
    view: 'TASKS',
    headline: 'Dispatch Task: TSK-6591',
    description: 'Task TSK-6591 generated for VG-1042 and dispatched to Rapid Intervention Team 3. Status is now ASSIGNED.',
    keyPoints: [
      { label: 'TASK ID', value: 'TSK-6591' },
      { label: 'HOTSPOT', value: 'VG-1042 (Hyderabad)' },
      { label: 'ASSIGNED TEAM', value: 'Rapid Intervention Team 3' },
      { label: 'STATUS', value: 'ASSIGNED (Critical Priority)' }
    ],
    actionButtonText: 'Switch to Field Officer →'
  },
  // STEP 13 — FIELD OFFICER
  {
    step: 13,
    title: 'STEP 13 — FIELD OFFICER',
    stageBadge: 'PREVENT',
    stageNumber: '03',
    role: 'FIELD_OFFICER',
    view: 'MY_TASKS',
    headline: 'Field Officer Receives Task',
    description: 'The prioritized remediation task is delivered directly to the Field Officer mobile interface.',
    keyPoints: [
      { label: 'ACTIVE TASK', value: 'TSK-6591 (VG-1042)' },
      { label: 'LOCATION', value: 'Ward 12, Banjara Hills' },
      { label: 'PRIORITY', value: 'CRITICAL' },
      { label: 'STATUS', value: 'ASSIGNED' }
    ],
    actionButtonText: 'Start Inspection →'
  },
  // STEP 14 — FIELD INSPECTION
  {
    step: 14,
    title: 'STEP 14 — FIELD INSPECTION',
    stageBadge: 'PREVENT',
    stageNumber: '03',
    role: 'FIELD_OFFICER',
    view: 'ACTIVE_INSPECTION',
    headline: 'On-Site Inspection & Before Evidence',
    description: 'Field officer arrives on site. Before Evidence photograph is validated with live GNSS RTK lock and remediation checklist is activated.',
    keyPoints: [
      { label: 'INSPECTION STATUS', value: 'IN_PROGRESS' },
      { label: 'BEFORE EVIDENCE', value: 'Excavation pit photo loaded' },
      { label: 'GPS LOCK', value: '±1.2m NavIC/GPS coordinate match' },
      { label: 'CHECKLIST', value: 'Interactive remediation steps ready' }
    ],
    actionButtonText: 'Complete Intervention →'
  },
  // STEP 15 — BEFORE → INTERVENTION → AFTER
  {
    step: 15,
    title: 'STEP 15 — BEFORE → AFTER',
    stageBadge: 'PREVENT',
    stageNumber: '03',
    role: 'FIELD_OFFICER',
    view: 'ACTIVE_INSPECTION',
    headline: 'Field Intervention: Before → After',
    description: 'Intervention checklist verified on site: standing water removed, debris cleared, larvicidal barrier applied. After-intervention photo captured.',
    keyPoints: [
      { label: 'BEFORE', value: 'Excavation sump with standing water' },
      { label: 'INTERVENTION', value: '✓ Water pumped ✓ Debris cleared ✓ Barrier applied' },
      { label: 'AFTER', value: 'Remediated dry pit photo captured' },
      { label: 'AUDIT ANCHOR', value: 'Device GPS telemetry recorded' }
    ],
    actionButtonText: 'Submit for Verification →'
  },
  // STEP 16 — SUBMIT FOR VERIFICATION
  {
    step: 16,
    title: 'STEP 16 — SUBMITTED',
    stageBadge: 'VERIFY',
    stageNumber: '02',
    role: 'ADMIN',
    view: 'VERIFICATION',
    headline: 'Submitted for Municipal Verification',
    description: 'Task TSK-6591 submitted with cryptographic EXIF metadata and live GPS anchor. Status becomes AWAITING VERIFICATION.',
    keyPoints: [
      { label: 'TASK ID', value: 'TSK-6591 (VG-1042)' },
      { label: 'STATUS', value: 'AWAITING VERIFICATION' },
      { label: 'AUDIT VIEW', value: 'Municipal Verification Center' },
      { label: 'EVIDENCE', value: 'Side-by-side Before vs After with GIS Footprint' }
    ],
    actionButtonText: 'Approve & Resolve Site →'
  },
  // STEP 17 — ADMIN APPROVAL
  {
    step: 17,
    title: 'STEP 17 — ADMIN APPROVAL',
    stageBadge: 'VERIFY',
    stageNumber: '02',
    role: 'ADMIN',
    view: 'VERIFICATION',
    headline: 'Admin Approves Intervention ✓',
    description: 'Admin reviews Before/After evidence, GPS audit footprint, and checklist, then clicks APPROVE. Task & Hotspot become RESOLVED.',
    keyPoints: [
      { label: 'TASK STATUS', value: 'RESOLVED ✓' },
      { label: 'HOTSPOT STATUS', value: 'RESOLVED ✓' },
      { label: 'VERIFIED BY', value: 'Control Room Admin' },
      { label: 'AUDIT TRAIL', value: 'Saved to verification ledger' }
    ],
    actionButtonText: 'View Continuous Learning →'
  },
  // STEP 18 — CONTINUOUS LEARNING
  {
    step: 18,
    title: 'STEP 18 — CONTINUOUS LEARNING',
    stageBadge: 'LEARN',
    stageNumber: '04',
    role: 'ADMIN',
    view: 'LEARNING',
    headline: 'Continuous Model Learning Loop',
    description: 'Predicted Risk (82) → Observed Condition (Stagnant Water) → Intervention (Completed) → Verified Outcome (Resolved).',
    keyPoints: [
      { label: 'PREDICTED RISK', value: '82 — Critical' },
      { label: 'OBSERVED CONDITION', value: 'Stagnant Water (Confirmed)' },
      { label: 'INTERVENTION', value: 'Pumped water & Larvicide applied' },
      { label: 'OUTCOME', value: 'Stagnation Prevented (Resolved)' }
    ],
    methodologyNote: 'PREDICT → VERIFY → PREVENT → LEARN. "From prediction to verified prevention."',
    actionButtonText: '↺ Restart Demo'
  }
];

export const HeroDemoGuide: React.FC = () => {
  const { 
    demoStep, 
    setDemoStep, 
    isDemoGuideOpen, 
    setIsDemoGuideOpen,
    currentUser,
    switchUserRole,
    setActiveView,
    setSelectedHotspotId,
    setDispatchModalHotspotId,
    setActiveTaskId,
    tasks,
    dispatchTask,
    startInspection,
    submitIntervention,
    approveVerification,
    resetDemoScenario
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [positionSide, setPositionSide] = useState<'right' | 'left'>('right');

  // Intelligent positioning: For steps 5, 6, 7 where the Hotspot modal/panel is on the right, position on the left
  useEffect(() => {
    if (demoStep >= 5 && demoStep <= 7) {
      setPositionSide('left');
    } else {
      setPositionSide('right');
    }
  }, [demoStep]);

  // Synchronize state precisely for any given step
  const executeStepState = useCallback((targetStep: number) => {
    const stepObj = WALKTHROUGH_STEPS.find(s => s.step === targetStep) || WALKTHROUGH_STEPS[0];

    // 1. Role synchronization
    if (currentUser.role !== stepObj.role) {
      switchUserRole(stepObj.role);
    }

    // 2. View synchronization
    setActiveView(stepObj.view);

    // 3. Step-specific entity and modal orchestration
    switch (targetStep) {
      case 1:
        // Dashboard
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);
        setActiveView('DASHBOARD');
        break;

      case 2:
      case 3:
      case 4:
        // National GIS Map
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);
        setActiveView('RISK_MAP');
        break;

      case 5:
      case 6:
      case 7:
        // Open Hotspot intelligence modal for VG-1042
        setActiveView('RISK_MAP');
        setSelectedHotspotId('VG-1042');
        setDispatchModalHotspotId(null);
        break;

      case 8:
      case 9:
      case 11:
        // Targeted Drone Surveillance & CV Evidence (Modal closed)
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);
        setActiveView('HOTSPOTS');
        break;

      case 10:
        // Verification Center (Initial review)
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);
        setActiveView('VERIFICATION');
        break;

      case 12: {
        // Task Dispatch — Create real demo task TSK-6591 if not yet created
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);
        setActiveView('TASKS');

        const existingTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (!existingTask) {
          dispatchTask({
            hotspotId: 'VG-1042',
            priority: 'Critical',
            assignedTeam: 'Rapid Intervention Team 3',
            assignedOfficer: 'Demo Field Officer',
            deadline: '08 Sept 2026, 18:00 IST',
            recommendedAction: 'Remove standing water + clear debris + improve drainage',
            notes: 'High water retention detected in foundation pit. Priority intervention required.'
          });
        }
        break;
      }

      case 13: {
        // Field Officer Tasks View
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (!vgTask) {
          dispatchTask({
            hotspotId: 'VG-1042',
            priority: 'Critical',
            assignedTeam: 'Rapid Intervention Team 3',
            assignedOfficer: 'Demo Field Officer',
            deadline: '08 Sept 2026, 18:00 IST',
            recommendedAction: 'Remove standing water + clear debris + improve drainage',
            notes: 'High water retention detected in foundation pit. Priority intervention required.'
          });
        }
        switchUserRole('FIELD_OFFICER');
        setActiveView('MY_TASKS');
        break;
      }

      case 14: {
        // Field Officer Active Inspection (status -> IN_PROGRESS)
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (!vgTask) {
          dispatchTask({
            hotspotId: 'VG-1042',
            priority: 'Critical',
            assignedTeam: 'Rapid Intervention Team 3',
            assignedOfficer: 'Demo Field Officer',
            deadline: '08 Sept 2026, 18:00 IST',
            recommendedAction: 'Remove standing water + clear debris + improve drainage',
            notes: 'High water retention detected in foundation pit. Priority intervention required.'
          });
          vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        }
        if (vgTask) {
          setActiveTaskId(vgTask.task_id);
          if (vgTask.status === 'ASSIGNED') {
            startInspection(vgTask.task_id);
          }
        }
        switchUserRole('FIELD_OFFICER');
        setActiveView('ACTIVE_INSPECTION');
        break;
      }

      case 15: {
        // Field Officer Intervention (Before -> Intervention -> After)
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (vgTask) {
          setActiveTaskId(vgTask.task_id);
          if (vgTask.status === 'ASSIGNED') {
            startInspection(vgTask.task_id);
          }
        }
        switchUserRole('FIELD_OFFICER');
        setActiveView('ACTIVE_INSPECTION');
        break;
      }

      case 16: {
        // Submit Intervention -> Status becomes AWAITING_VERIFICATION
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (vgTask && vgTask.status !== 'AWAITING_VERIFICATION' && vgTask.status !== 'RESOLVED') {
          submitIntervention({
            taskId: vgTask.task_id,
            beforeEvidenceUrl: DEMO_EVIDENCE_IMAGES.vg1042_before,
            afterEvidenceUrl: DEMO_EVIDENCE_IMAGES.vg1042_after,
            checklist: {
              remove_standing_water: true,
              clear_debris: true,
              restore_drainage: true,
              treat_retention_area: true,
              remove_containers: true,
              other_preventive_action: true
            },
            officerNotes: 'Standing water evacuated via pump. Debris cleared from excavation pit and larvicide barrier applied.'
          });
        }
        switchUserRole('ADMIN');
        setActiveView('VERIFICATION');
        break;
      }

      case 17: {
        // Admin Approval -> Status becomes RESOLVED
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (vgTask && vgTask.status === 'AWAITING_VERIFICATION') {
          approveVerification(vgTask.task_id, 'Visual proof verified. Stagnant water removed and GPS coordinates verified on-site.');
        }
        switchUserRole('ADMIN');
        setActiveView('VERIFICATION');
        break;
      }

      case 18: {
        // Continuous Learning View
        setSelectedHotspotId(null);
        setDispatchModalHotspotId(null);

        let vgTask = tasks.find(t => t.hotspot_id === 'VG-1042');
        if (vgTask && vgTask.status !== 'RESOLVED') {
          approveVerification(vgTask.task_id, 'Verified and resolved.');
        }
        switchUserRole('ADMIN');
        setActiveView('LEARNING');
        break;
      }

      default:
        break;
    }
  }, [
    currentUser.role, 
    switchUserRole, 
    setActiveView, 
    setSelectedHotspotId, 
    setDispatchModalHotspotId, 
    setActiveTaskId, 
    tasks, 
    dispatchTask, 
    startInspection, 
    submitIntervention, 
    approveVerification
  ]);

  if (!isDemoGuideOpen) return null;

  const currentStepData = WALKTHROUGH_STEPS.find(s => s.step === demoStep) || WALKTHROUGH_STEPS[0];
  const progressPercentage = Math.round((demoStep / 18) * 100);

  const handleNext = () => {
    if (demoStep < 18) {
      const nextStep = demoStep + 1;
      setDemoStep(nextStep);
      executeStepState(nextStep);
    }
  };

  const handlePrevious = () => {
    if (demoStep > 1) {
      const prevStep = demoStep - 1;
      setDemoStep(prevStep);
      executeStepState(prevStep);
    }
  };

  const handleActionClick = () => {
    if (demoStep === 18) {
      resetDemoScenario();
      return;
    }
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);
    executeStepState(nextStep);
  };

  const handleStepJump = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetStep = parseInt(e.target.value, 10);
    setDemoStep(targetStep);
    executeStepState(targetStep);
  };

  const handleReset = () => {
    resetDemoScenario();
    executeStepState(1);
  };

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 pointer-events-auto ${
        positionSide === 'left'
          ? 'bottom-4 left-4 sm:left-6 max-w-[420px] w-[calc(100vw-32px)] sm:w-[420px]'
          : 'bottom-4 right-4 sm:right-6 max-w-[420px] w-[calc(100vw-32px)] sm:w-[420px]'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Floating Card Container */}
      <div className="relative bg-slate-900/98 text-white border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md transition-all">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          
          {/* Badge & Step counter */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3 fill-amber-400/40 text-amber-400" />
              <span>DEMO WORKFLOW</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-amber-400">
                {String(demoStep).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono text-slate-500">/ 18</span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1">
            
            {/* Step Jump Dropdown */}
            <select
              id="demo-step-select"
              aria-label="Select Demo Step"
              value={demoStep}
              onChange={handleStepJump}
              className="bg-slate-800 text-[10px] font-bold text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {WALKTHROUGH_STEPS.map(s => (
                <option key={s.step} value={s.step}>
                  {String(s.step).padStart(2, '0')}. {s.stageBadge}
                </option>
              ))}
            </select>

            {/* Position flip */}
            <button
              id="toggle-demo-position-btn"
              onClick={() => setPositionSide(positionSide === 'right' ? 'left' : 'right')}
              title={`Move guide to ${positionSide === 'right' ? 'left' : 'right'} side`}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Minimize */}
            <button
              id="minimize-demo-guide-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expand guide" : "Minimize guide"}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              id="close-demo-guide-btn"
              onClick={() => setIsDemoGuideOpen(false)}
              title="Close demo guide"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Content Body (when expanded) */}
        {!isMinimized && (
          <div className="p-3.5 sm:p-4 space-y-3">
            
            {/* Meta tags line: Stage + Role */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                  currentStepData.stageBadge === 'PREDICT' ? 'bg-purple-900/80 text-purple-200 border border-purple-700' :
                  currentStepData.stageBadge === 'VERIFY' ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700' :
                  currentStepData.stageBadge === 'PREVENT' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700' :
                  'bg-blue-900/80 text-blue-200 border border-blue-700'
                }`}>
                  STAGE {currentStepData.stageNumber}: {currentStepData.stageBadge}
                </span>

                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                  HERO: VG-1042
                </span>
              </div>

              {/* Active Role Badge */}
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                {currentStepData.role === 'ADMIN' ? (
                  <>
                    <Building2 className="w-3 h-3 text-sky-400" />
                    <span>Control Room</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3 h-3 text-amber-400" />
                    <span>Field Unit</span>
                  </>
                )}
              </div>
            </div>

            {/* Headline & Description */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                {currentStepData.headline}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Key Points Grid */}
            {currentStepData.keyPoints && (
              <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px]">
                {currentStepData.keyPoints.map((kp, idx) => (
                  <div key={idx} className="truncate">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider truncate">
                      {kp.label}
                    </span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {kp.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Methodology Note if any */}
            {currentStepData.methodologyNote && (
              <div className="flex items-start gap-1.5 text-[10px] text-amber-300/90 bg-amber-950/30 border border-amber-800/50 p-2 rounded-lg leading-tight">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentStepData.methodologyNote}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              id="demo-action-btn"
              onClick={handleActionClick}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98 ${
                demoStep === 18 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {demoStep === 18 ? (
                <>
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>{currentStepData.actionButtonText}</span>
                </>
              ) : (
                <>
                  <span>{currentStepData.actionButtonText}</span>
                </>
              )}
            </button>

            {/* Navigation & Reset Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
              
              <button
                id="demo-prev-btn"
                onClick={handlePrevious}
                disabled={demoStep === 1}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition px-1.5 py-1 rounded hover:bg-slate-800"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                id="demo-reset-btn"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition px-2 py-1 rounded hover:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>

              <button
                id="demo-next-btn"
                onClick={handleNext}
                disabled={demoStep === 18}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition px-1.5 py-1 rounded hover:bg-slate-800"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
