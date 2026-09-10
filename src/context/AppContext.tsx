import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  HotspotRecord, 
  TaskRecord, 
  UserRole, 
  UserProfile, 
  LearningRecord,
  DeviceGpsAnchor,
  CitizenProfile,
  CitizenEvidenceSubmission,
  CitizenEvidenceType,
  maskName,
  maskMobile,
  maskEmail
} from '../types';
import { 
  SEED_HOTSPOTS, 
  SEED_USERS, 
  SEED_LEARNING_RECORDS 
} from '../data/seedHotspots';
import { getCompleteHotspotsDataset } from '../data/indiaGeoData';
import { databaseService } from '../services/databaseService';
import { evidenceStorageService } from '../services/evidenceStorageService';
import { DatabaseConnectionStatus } from '../types/database';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  hotspots: HotspotRecord[];
  tasks: TaskRecord[];
  learningRecords: LearningRecord[];
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  activeView: string;
  selectedHotspotId: string | null;
  dispatchModalHotspotId: string | null;
  activeTaskId: string | null;
  notifications: NotificationToast[];
  demoStep: number;
  isDemoGuideOpen: boolean;
  demoMode?: boolean;
  setDemoMode?: (open: boolean) => void;
  resetDemo?: () => void;
  isMobileNavOpen?: boolean;
  setIsMobileNavOpen?: (open: boolean) => void;

  // Database Connection & Health Check
  databaseConnectionStatus: DatabaseConnectionStatus;
  runDatabaseHealthCheck: () => Promise<{ status: DatabaseConnectionStatus; provider: string; lastPing: string; latencyMs: number }>;

  // Citizen State & Actions
  registeredCitizen: CitizenProfile | null;
  citizenSubmissions: CitizenEvidenceSubmission[];
  registerCitizen: (params: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    state: string;
    city: string;
    consentGiven: boolean;
  }) => boolean;
  submitCitizenEvidence: (params: {
    evidenceType: CitizenEvidenceType;
    imageUrl: string;
    state: string;
    city: string;
    localArea: string;
    gpsCoordinates?: string;
    description: string;
    isDroneRestrictedScenario?: boolean;
    linkedHotspotId?: string;
  }) => CitizenEvidenceSubmission;
  approveCitizenSubmission: (submissionId: string, notes?: string) => void;
  rejectCitizenSubmission: (submissionId: string, reason?: string) => void;

  // Actions
  setActiveView: (view: string) => void;
  switchUserRole: (role: UserRole) => void;
  setSelectedHotspotId: (id: string | null) => void;
  setDispatchModalHotspotId: (id: string | null) => void;
  setActiveTaskId: (id: string | null) => void;
  setDemoStep: (step: number) => void;
  setIsDemoGuideOpen: (open: boolean) => void;
  advanceDemoStep: () => void;
  resetDemoScenario: () => void;
  
  dispatchTask: (params: {
    hotspotId: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assignedTeam: string;
    assignedOfficer: string;
    deadline: string;
    recommendedAction: string;
    notes: string;
  }) => void;
  
  startInspection: (taskId: string) => void;
  
  submitIntervention: (params: {
    taskId: string;
    beforeEvidenceUrl: string;
    beforeExifMetadata?: TaskRecord['before_exif_metadata'];
    afterEvidenceUrl: string;
    afterExifMetadata?: TaskRecord['after_exif_metadata'];
    deviceGpsAnchor?: DeviceGpsAnchor;
    checklist: TaskRecord['intervention_checklist'];
    officerNotes: string;
  }) => void;
  
  approveVerification: (taskId: string, reviewNotes?: string) => void;
  requestReinspection: (taskId: string, rejectionReason: string) => void;
  
  resetToDefaultData: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (toast: Omit<NotificationToast, 'id' | 'timestamp'>) => void;
}

const LOCAL_STORAGE_KEY_HOTSPOTS = 'vectorguard_hotspots_v1';
const LOCAL_STORAGE_KEY_TASKS = 'vectorguard_tasks_v1';
const LOCAL_STORAGE_KEY_LEARNING = 'vectorguard_learning_v1';
const LOCAL_STORAGE_KEY_CITIZEN = 'vectorguard_citizen_profile_v1';
const LOCAL_STORAGE_KEY_CITIZEN_SUBMISSIONS = 'vectorguard_citizen_submissions_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize State
  const [hotspots, setHotspots] = useState<HotspotRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HOTSPOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return getCompleteHotspotsDataset(parsed);
        }
      }
    } catch {
      // ignore
    }
    return getCompleteHotspotsDataset(SEED_HOTSPOTS);
  });

  const [tasks, setTasks] = useState<TaskRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasHeroTask = parsed.some((t: TaskRecord) => t.task_id === 'TSK-6591');
          if (hasHeroTask) return parsed;
        }
      }
    } catch {
      // ignore
    }
    // Load from databaseService including seeded demo task TSK-6591
    const dbTasks = databaseService.getTasks();
    return dbTasks.map(t => ({
      task_id: t.task_id,
      hotspot_id: t.hotspot_id,
      ward: t.hotspot_id === 'VG-1042' ? 'Ward 104 - Kondapur' : 'Ward 104',
      location: t.hotspot_id === 'VG-1042' ? 'HITEC City Phase 2 Construction Site' : 'Municipal Site',
      priority: t.priority,
      status: t.status as any,
      recommended_action: 'Submersible Dewatering & Bti Bio-Larvicide Treatment',
      assigned_team: t.assigned_team,
      assigned_officer: t.assigned_officer,
      assigned_officer_id: 'usr-officer-01',
      assigned_by: 'Control Room Supervisor',
      assigned_at: t.created_at,
      deadline: t.deadline,
      admin_notes: t.notes,
      intervention_checklist: {
        remove_standing_water: false,
        clear_debris: false,
        restore_drainage: false,
        treat_retention_area: false,
        remove_containers: false,
        other_preventive_action: false
      }
    }));
  });

  const [dbConnectionStatus, setDbConnectionStatus] = useState<DatabaseConnectionStatus>('CONNECTED');

  useEffect(() => {
    databaseService.runHealthCheck().then(res => {
      setDbConnectionStatus(res.status);
    });

    const unsubscribe = databaseService.subscribe(() => {
      const dbHotspots = databaseService.getHotspots();
      if (dbHotspots.length > 0) {
        setHotspots(getCompleteHotspotsDataset(dbHotspots as any));
      }
      const dbTasks = databaseService.getTasks();
      if (dbTasks.length > 0) {
        setTasks(prev => {
          const map = new Map<string, TaskRecord>(prev.map(t => [t.task_id, t]));
          dbTasks.forEach(t => {
            const existing = map.get(t.task_id);
            map.set(t.task_id, {
              task_id: t.task_id,
              hotspot_id: t.hotspot_id,
              ward: t.hotspot_id === 'VG-1042' ? 'Ward 104 - Kondapur' : (existing?.ward || 'Ward 104'),
              location: t.hotspot_id === 'VG-1042' ? 'HITEC City Phase 2 Construction Site' : (existing?.location || 'Municipal Site'),
              priority: t.priority as any,
              status: t.status as any,
              recommended_action: existing?.recommended_action || 'Submersible Dewatering & Bti Bio-Larvicide Treatment',
              assigned_team: t.assigned_team,
              assigned_officer: t.assigned_officer,
              assigned_officer_id: existing?.assigned_officer_id || 'usr-officer-01',
              assigned_by: existing?.assigned_by || 'Control Room Supervisor',
              assigned_at: t.created_at,
              deadline: t.deadline,
              admin_notes: t.notes,
              intervention_checklist: existing?.intervention_checklist || {
                remove_standing_water: false,
                clear_debris: false,
                restore_drainage: false,
                treat_retention_area: false,
                remove_containers: false,
                other_preventive_action: false
              }
            });
          });
          return Array.from(map.values());
        });
      }
    });

    return unsubscribe;
  }, []);

  const runDatabaseHealthCheck = async () => {
    const res = await databaseService.runHealthCheck();
    setDbConnectionStatus(res.status);
    return res;
  };

  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LEARNING);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_LEARNING_RECORDS;
  });

  // Citizen Profile State (stored in demo memory / localStorage)
  const [registeredCitizen, setRegisteredCitizen] = useState<CitizenProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CITIZEN);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Citizen Submissions Queue
  const [citizenSubmissions, setCitizenSubmissions] = useState<CitizenEvidenceSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CITIZEN_SUBMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(SEED_USERS[0]);

  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const raw = window.location.hash.replace('#', '').toUpperCase().replace(/-/g, '_');
      if (raw) return raw;
    }
    return 'DASHBOARD';
  });

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [dispatchModalHotspotId, setDispatchModalHotspotId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Wrapped setActiveView to auto-close mobile drawer, reconcile user role, and sync URL hash
  const handleSetActiveView = (view: string) => {
    // If switching to an admin view while in Citizen/Field Officer mode, reconcile role to Admin
    const adminViews = [
      'DASHBOARD', 'RISK_MAP', 'HOTSPOTS', 'TASKS', 'VERIFICATION', 
      'ANALYTICS', 'LEARNING', 'ARCHITECTURE', 'DATA_ML', 'DEPLOYMENT', 
      'SDGS', 'USERS', 'SETTINGS', 'RESPONSIBLE_AI', 'GLOBAL_VIEW'
    ];

    if (adminViews.includes(view)) {
      if (currentUser.role !== 'ADMIN') {
        setCurrentUser(SEED_USERS[0]);
      }
    } else if (view === 'MY_TASKS' || view === 'ACTIVE_INSPECTION' || view === 'HISTORY') {
      if (currentUser.role !== 'FIELD_OFFICER') {
        const fo = SEED_USERS.find(u => u.role === 'FIELD_OFFICER') || SEED_USERS[1];
        setCurrentUser(fo);
      }
    } else if (view === 'CITIZEN_PORTAL' || view === 'CITIZEN_SUBMIT') {
      if (currentUser.role !== 'CITIZEN') {
        setCurrentUser({
          id: 'usr-citizen-01',
          name: registeredCitizen ? registeredCitizen.fullName : 'Citizen Sentinel',
          email: 'citizen@sentinel.org',
          role: 'CITIZEN',
          team: 'Supporting Evidence Network',
          phone: '+91 98490 00000',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        });
      }
    }

    setActiveView(view);
    setIsMobileNavOpen(false);

    if (typeof window !== 'undefined') {
      const targetHash = `#${view.toLowerCase().replace(/_/g, '-')}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState({ view }, '', targetHash);
      }
    }
  };

  // Listen to browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const raw = window.location.hash.replace('#', '').toUpperCase().replace(/-/g, '_');
        if (raw) {
          setActiveView(raw);
        }
      }
    };

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HOTSPOTS, JSON.stringify(hotspots));
    } catch {
      // ignore
    }
  }, [hotspots]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LEARNING, JSON.stringify(learningRecords));
    } catch {
      // ignore
    }
  }, [learningRecords]);

  useEffect(() => {
    try {
      if (registeredCitizen) {
        localStorage.setItem(LOCAL_STORAGE_KEY_CITIZEN, JSON.stringify(registeredCitizen));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_CITIZEN);
      }
    } catch {
      // ignore
    }
  }, [registeredCitizen]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CITIZEN_SUBMISSIONS, JSON.stringify(citizenSubmissions));
    } catch {
      // ignore
    }
  }, [citizenSubmissions]);

  const addNotification = (toast: Omit<NotificationToast, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: NotificationToast = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications(prev => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss
    setTimeout(() => {
      dismissNotification(id);
    }, 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(t => t.id !== id));
  };

  const registerCitizen = (params: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    state: string;
    city: string;
    consentGiven: boolean;
  }): boolean => {
    if (!params.fullName.trim() || !params.mobileNumber.trim() || !params.state || !params.city || !params.consentGiven) {
      return false;
    }

    const newCitizen: CitizenProfile = {
      id: `cz-${Date.now()}`,
      fullName: params.fullName.trim(),
      mobileNumber: params.mobileNumber.trim(),
      email: params.email?.trim() || undefined,
      state: params.state,
      city: params.city,
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      registeredAt: new Date().toISOString()
    };

    setRegisteredCitizen(newCitizen);

    // Persist to Database Citizen Registrations Table (with protected PII)
    databaseService.createCitizenRegistration({
      citizen_registration_id: newCitizen.id,
      full_name: params.fullName.trim(),
      mobile_number: params.mobileNumber.trim(),
      email: params.email?.trim() || null,
      state: params.state,
      city: params.city,
      consent_recorded: true,
      registered_at: newCitizen.registeredAt,
      _source_provenance: 'DATABASE RECORDS'
    });

    // Update currentUser if in citizen mode
    if (currentUser.role === 'CITIZEN') {
      setCurrentUser({
        id: newCitizen.id,
        name: maskName(newCitizen.fullName),
        email: newCitizen.email ? maskEmail(newCitizen.email) : 'citizen@public.health.in',
        role: 'CITIZEN',
        team: 'Public Health Sentinel',
        zone: `${newCitizen.city}, ${newCitizen.state}`,
        phone: maskMobile(newCitizen.mobileNumber),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    }

    addNotification({
      type: 'success',
      title: 'Registration Successful',
      message: 'Your citizen profile has been registered for environmental evidence submission.'
    });

    return true;
  };

  const submitCitizenEvidence = (params: {
    evidenceType: CitizenEvidenceType;
    imageUrl: string;
    state: string;
    city: string;
    localArea: string;
    gpsCoordinates?: string;
    description: string;
    isDroneRestrictedScenario?: boolean;
    linkedHotspotId?: string;
  }): CitizenEvidenceSubmission => {
    const nextNum = citizenSubmissions.length + 1;
    const submissionId = `CE-${nextNum.toString().padStart(4, '0')}`;
    
    const citizenName = registeredCitizen?.fullName || 'Anil Kumar';
    const citizenMobile = registeredCitizen?.mobileNumber || '9876543210';
    const citizenEmail = registeredCitizen?.email;

    const newSubmission: CitizenEvidenceSubmission = {
      submissionId,
      citizenId: registeredCitizen?.id || `cz-${Date.now()}`,
      citizenNameMasked: maskName(citizenName),
      citizenMobileMasked: maskMobile(citizenMobile),
      citizenEmailMasked: citizenEmail ? maskEmail(citizenEmail) : undefined,
      evidenceType: params.evidenceType,
      imageUrl: params.imageUrl,
      state: params.state,
      city: params.city,
      localArea: params.localArea,
      gpsCoordinates: params.gpsCoordinates || (params.linkedHotspotId ? '17.4156° N, 78.4350° E' : undefined),
      description: params.description,
      consentRecorded: true,
      status: 'PENDING_HUMAN_VERIFICATION',
      isDroneRestrictedScenario: params.isDroneRestrictedScenario || false,
      submittedAt: new Date().toISOString(),
      linkedHotspotId: params.linkedHotspotId
    };

    setCitizenSubmissions(prev => [newSubmission, ...prev]);

    // Persist as supporting evidence record in database
    try {
      const lat = params.gpsCoordinates ? parseFloat(params.gpsCoordinates.split('°')[0]) : 17.4435;
      const lng = params.gpsCoordinates ? parseFloat(params.gpsCoordinates.split(',')[1]?.replace('°', '')?.replace('E', '')?.trim() || '78.3772') : 78.3772;
      databaseService.createEvidence({
        evidence_id: `EVD-CZ-${newSubmission.submissionId}`,
        hotspot_id: params.linkedHotspotId || 'VG-1042',
        task_id: null,
        source_type: 'REGISTERED_CITIZEN',
        capture_type: 'CITIZEN_PHOTO',
        image_reference: params.imageUrl,
        latitude: isNaN(lat) ? 17.4435 : lat,
        longitude: isNaN(lng) ? 78.3772 : lng,
        timestamp: newSubmission.submittedAt,
        altitude: null,
        camera_source: 'Citizen Sentinel Mobile Web Portal',
        condition: params.evidenceType,
        description: params.description,
        verification_status: 'PENDING',
        created_at: newSubmission.submittedAt,
        _source_provenance: 'EVIDENCE'
      });
    } catch {
      // ignore
    }

    addNotification({
      type: 'success',
      title: `Evidence Submitted (${submissionId})`,
      message: 'Status: PENDING HUMAN VERIFICATION. Forwarded to Municipal Review Center.'
    });

    return newSubmission;
  };

  const approveCitizenSubmission = (submissionId: string, notes?: string) => {
    setCitizenSubmissions(prev => prev.map(s => {
      if (s.submissionId === submissionId) {
        return {
          ...s,
          status: 'APPROVED_SUPPORTING',
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name,
          adminNotes: notes || 'Verified by Control Room as supporting ground-level observation.'
        };
      }
      return s;
    }));

    addNotification({
      type: 'success',
      title: `Citizen Evidence ${submissionId} Approved ✓`,
      message: 'Recorded as verified supporting ground observation in municipal intelligence archive.'
    });
  };

  const rejectCitizenSubmission = (submissionId: string, reason?: string) => {
    setCitizenSubmissions(prev => prev.map(s => {
      if (s.submissionId === submissionId) {
        return {
          ...s,
          status: 'REJECTED',
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name,
          adminNotes: reason || 'Additional visual clarity or precise geolocation required.'
        };
      }
      return s;
    }));

    addNotification({
      type: 'warning',
      title: `Citizen Evidence ${submissionId} Request Updated`,
      message: 'Status updated. Additional evidence or location precision requested.'
    });
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'CITIZEN') {
      const citizenUser: UserProfile = {
        id: registeredCitizen?.id || 'usr-citizen-demo',
        name: registeredCitizen?.fullName ? maskName(registeredCitizen.fullName) : 'Registered Citizen',
        email: registeredCitizen?.email ? maskEmail(registeredCitizen.email) : 'citizen@public.health.in',
        role: 'CITIZEN',
        team: 'Supporting Ground Evidence',
        zone: registeredCitizen ? `${registeredCitizen.city}, ${registeredCitizen.state}` : 'Citizen Observation',
        phone: registeredCitizen?.mobileNumber ? maskMobile(registeredCitizen.mobileNumber) : '+91 ******4321',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      setCurrentUser(citizenUser);
      setActiveView('CITIZEN_PORTAL');
      addNotification({
        type: 'info',
        title: 'Switched to Citizen Perspective',
        message: 'Supporting environmental evidence submission portal.'
      });
      return;
    }

    const matchedUser = SEED_USERS.find(u => u.role === role) || SEED_USERS[0];
    setCurrentUser(matchedUser);

    if (role === 'FIELD_OFFICER') {
      setActiveView('MY_TASKS');
      addNotification({
        type: 'info',
        title: 'Logged in as Field Officer',
        message: `Field unit active: ${matchedUser.name} (${matchedUser.team || 'Rapid Intervention'})`
      });
    } else {
      setActiveView('DASHBOARD');
      addNotification({
        type: 'info',
        title: 'Logged in as Control Room Admin',
        message: `Control Room Command active.`
      });
    }
  };

  // STEP 7: Dispatch Task
  const dispatchTask = (params: {
    hotspotId: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assignedTeam: string;
    assignedOfficer: string;
    deadline: string;
    recommendedAction: string;
    notes: string;
  }) => {
    const targetHotspot = hotspots.find(h => h.hotspot_id === params.hotspotId);
    if (!targetHotspot) return;

    const newTaskId = `TSK-${Date.now().toString().slice(-4)}`;

    const newTask: TaskRecord = {
      task_id: newTaskId,
      hotspot_id: params.hotspotId,
      ward: targetHotspot.ward,
      location: targetHotspot.location,
      priority: params.priority,
      status: 'ASSIGNED',
      recommended_action: params.recommendedAction || targetHotspot.recommended_action,
      assigned_team: params.assignedTeam,
      assigned_officer: params.assignedOfficer,
      assigned_officer_id: 'usr-officer-01',
      assigned_by: currentUser.name,
      assigned_at: new Date().toISOString(),
      deadline: params.deadline,
      admin_notes: params.notes,
      intervention_checklist: {
        remove_standing_water: false,
        clear_debris: false,
        restore_drainage: false,
        treat_retention_area: false,
        remove_containers: false,
        other_preventive_action: false
      }
    };

    setTasks(prev => [newTask, ...prev.filter(t => t.hotspot_id !== params.hotspotId)]);

    // Persist Task to Database Table
    databaseService.createTask({
      task_id: newTaskId,
      hotspot_id: params.hotspotId,
      assigned_team: params.assignedTeam,
      assigned_officer: params.assignedOfficer,
      priority: params.priority,
      deadline: params.deadline,
      status: 'ASSIGNED',
      created_at: newTask.assigned_at,
      started_at: null,
      completed_at: null,
      notes: params.notes,
      _source_provenance: 'DATABASE RECORDS'
    });

    // Update Hotspot in Database Table
    try {
      databaseService.updateHotspot(params.hotspotId, {
        status: 'ASSIGNED',
        assigned_team: params.assignedTeam,
        assigned_officer: params.assignedOfficer
      });
    } catch {
      // ignore
    }

    // Update Hotspot state to ASSIGNED
    setHotspots(prev => prev.map(h => {
      if (h.hotspot_id === params.hotspotId) {
        return {
          ...h,
          status: 'ASSIGNED',
          assigned_team: params.assignedTeam,
          assigned_officer: params.assignedOfficer,
          assigned_officer_id: 'usr-officer-01',
          active_task_id: newTaskId,
          updated_at: new Date().toISOString()
        };
      }
      return h;
    }));

    setDispatchModalHotspotId(null);

    addNotification({
      type: 'success',
      title: `Task Dispatched: ${newTaskId}`,
      message: `Assigned to ${params.assignedOfficer} (${params.assignedTeam}) for hotspot ${params.hotspotId}.`
    });

    if (params.hotspotId === 'VG-1042' && demoStep === 7) {
      setDemoStep(8);
    }
  };

  // STEP 10: Start Inspection (Officer changes status ASSIGNED -> IN_PROGRESS)
  const startInspection = (taskId: string) => {
    const targetTask = tasks.find(t => t.task_id === taskId);
    if (!targetTask) return;

    // Database Update
    try {
      databaseService.updateTask(taskId, {
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString()
      });
      databaseService.updateHotspot(targetTask.hotspot_id, {
        status: 'IN_PROGRESS'
      });
    } catch {
      // ignore
    }

    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: 'IN_PROGRESS'
        };
      }
      return t;
    }));

    setHotspots(prev => prev.map(h => {
      if (h.hotspot_id === targetTask.hotspot_id) {
        return {
          ...h,
          status: 'IN_PROGRESS',
          updated_at: new Date().toISOString()
        };
      }
      return h;
    }));

    setActiveTaskId(taskId);

    addNotification({
      type: 'info',
      title: 'Inspection Initiated',
      message: `Field protocol started for ${targetTask.hotspot_id} at ${targetTask.location}.`
    });

    if (targetTask.hotspot_id === 'VG-1042' && demoStep === 10) {
      setDemoStep(11);
    }
  };

  // STEP 13: Submit Intervention (Officer submits Before + Checklist + After + Notes + Device GPS Anchor -> AWAITING_VERIFICATION)
  const submitIntervention = (params: {
    taskId: string;
    beforeEvidenceUrl: string;
    beforeExifMetadata?: TaskRecord['before_exif_metadata'];
    afterEvidenceUrl: string;
    afterExifMetadata?: TaskRecord['after_exif_metadata'];
    deviceGpsAnchor?: DeviceGpsAnchor;
    checklist: TaskRecord['intervention_checklist'];
    officerNotes: string;
  }) => {
    const targetTask = tasks.find(t => t.task_id === params.taskId);
    if (!targetTask) return;

    const submissionTime = new Date().toISOString();

    // Persist evidence records to database
    try {
      const beforeEvidenceId = `EVD-${Date.now()}-FLD01`;
      const afterEvidenceId = `EVD-${Date.now()}-AFT01`;

      databaseService.createEvidence({
        evidence_id: beforeEvidenceId,
        hotspot_id: targetTask.hotspot_id,
        task_id: params.taskId,
        source_type: 'FIELD_OFFICER',
        capture_type: 'FIELD_BEFORE',
        image_reference: params.beforeEvidenceUrl,
        latitude: params.deviceGpsAnchor?.latitude || 17.4435,
        longitude: params.deviceGpsAnchor?.longitude || 78.3772,
        timestamp: submissionTime,
        altitude: params.deviceGpsAnchor?.altitudeMeters || null,
        camera_source: 'Field Officer Rugged Mobile GNSS',
        condition: 'Murky stagnant water in foundation sump',
        description: params.officerNotes || 'Pre-intervention ground evidence',
        verification_status: 'PENDING',
        created_at: submissionTime,
        _source_provenance: 'EVIDENCE'
      });

      databaseService.createEvidence({
        evidence_id: afterEvidenceId,
        hotspot_id: targetTask.hotspot_id,
        task_id: params.taskId,
        source_type: 'FIELD_OFFICER',
        capture_type: 'AFTER',
        image_reference: params.afterEvidenceUrl,
        latitude: params.deviceGpsAnchor?.latitude || 17.4435,
        longitude: params.deviceGpsAnchor?.longitude || 78.3772,
        timestamp: submissionTime,
        altitude: params.deviceGpsAnchor?.altitudeMeters || null,
        camera_source: 'Field Officer Rugged Mobile GNSS',
        condition: 'Dry foundation gravel post-dewatering',
        description: 'Post-intervention validation evidence',
        verification_status: 'PENDING',
        created_at: submissionTime,
        _source_provenance: 'EVIDENCE'
      });

      databaseService.createIntervention({
        intervention_id: `INT-${Date.now()}`,
        task_id: params.taskId,
        hotspot_id: targetTask.hotspot_id,
        action_type: 'Submersible Dewatering & Bti Bio-Larvicide Treatment',
        description: params.officerNotes || 'Water evacuated completely. Gravel sump treated with Bti bio-larvicide.',
        performed_by: targetTask.assigned_officer || 'Field Specialist',
        performed_at: submissionTime,
        before_evidence_id: beforeEvidenceId,
        intervention_evidence_id: beforeEvidenceId,
        after_evidence_id: afterEvidenceId,
        outcome: 'Standing water cleared and site restored.',
        _source_provenance: 'DATABASE RECORDS'
      });

      databaseService.updateTask(params.taskId, {
        status: 'AWAITING_VERIFICATION'
      });

      databaseService.updateHotspot(targetTask.hotspot_id, {
        status: 'AWAITING_VERIFICATION'
      });
    } catch {
      // ignore
    }

    setTasks(prev => prev.map(t => {
      if (t.task_id === params.taskId) {
        return {
          ...t,
          status: 'AWAITING_VERIFICATION',
          before_evidence_url: params.beforeEvidenceUrl,
          before_exif_metadata: params.beforeExifMetadata,
          after_evidence_url: params.afterEvidenceUrl,
          after_exif_metadata: params.afterExifMetadata,
          device_live_gps: params.deviceGpsAnchor,
          intervention_checklist: params.checklist,
          officer_notes: params.officerNotes,
          submitted_at: submissionTime
        };
      }
      return t;
    }));

    setHotspots(prev => prev.map(h => {
      if (h.hotspot_id === targetTask.hotspot_id) {
        return {
          ...h,
          status: 'AWAITING_VERIFICATION',
          before_image_url: params.beforeEvidenceUrl,
          before_exif_metadata: params.beforeExifMetadata,
          after_image_url: params.afterEvidenceUrl,
          after_exif_metadata: params.afterExifMetadata,
          device_live_gps: params.deviceGpsAnchor,
          officer_notes: params.officerNotes,
          updated_at: submissionTime
        };
      }
      return h;
    }));

    addNotification({
      type: 'success',
      title: 'Intervention Submitted for Verification',
      message: `Evidence and completed checklist forwarded to Municipal Verification Center.`
    });

    if (targetTask.hotspot_id === 'VG-1042' && demoStep >= 11 && demoStep <= 13) {
      setDemoStep(14);
    }
  };

  // STEP 16: Approve Verification (Admin sets status to RESOLVED & logs to continuous learning)
  const approveVerification = (taskId: string, reviewNotes?: string) => {
    const targetTask = tasks.find(t => t.task_id === taskId);
    if (!targetTask) return;

    const targetHotspot = hotspots.find(h => h.hotspot_id === targetTask.hotspot_id);
    const resolvedTime = new Date().toISOString();

    // Persist verification and learning outcome in database
    try {
      databaseService.createVerification({
        verification_id: `VRF-${Date.now().toString().slice(-4)}`,
        evidence_id: 'EVD-VG1042-AFT01',
        hotspot_id: targetTask.hotspot_id,
        verified_by: currentUser.name || 'Chief Municipal Entomologist',
        verification_status: 'APPROVED',
        verification_notes: reviewNotes || 'Field intervention audited against drone baseline and approved.',
        verified_at: resolvedTime,
        _source_provenance: 'DATABASE RECORDS'
      });

      databaseService.updateTask(taskId, {
        status: 'RESOLVED',
        completed_at: resolvedTime
      });

      databaseService.updateHotspot(targetTask.hotspot_id, {
        status: 'RESOLVED'
      });

      databaseService.createLearningOutcome({
        learning_id: `LRN-${Date.now().toString().slice(-4)}`,
        hotspot_id: targetTask.hotspot_id,
        predicted_risk: targetHotspot?.breeding_risk_score || 85,
        observed_condition: targetHotspot?.visual_detection || 'Foundation pit water stagnation',
        intervention_outcome: 'Dewatered and treated',
        verification_outcome: 'Audited and Approved',
        observation_date: resolvedTime.split('T')[0],
        calibration_status: 'CALIBRATED_RETENTION',
        _source_provenance: 'MODEL OUTPUTS'
      });
    } catch {
      // ignore
    }

    // 1. Update Task
    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: 'RESOLVED',
          reviewed_at: resolvedTime,
          reviewed_by: currentUser.name,
          completed_at: resolvedTime
        };
      }
      return t;
    }));

    // 2. Update Hotspot
    setHotspots(prev => prev.map(h => {
      if (h.hotspot_id === targetTask.hotspot_id) {
        return {
          ...h,
          status: 'RESOLVED',
          resolved_at: resolvedTime,
          updated_at: resolvedTime
        };
      }
      return h;
    }));

    // 3. Log to Continuous Learning Feedback loop
    if (targetHotspot) {
      const newLearningRecord: LearningRecord = {
        id: `LR-${Date.now().toString().slice(-4)}`,
        hotspot_id: targetHotspot.hotspot_id,
        ward: targetHotspot.ward.split(' ')[0] + ' ' + targetHotspot.ward.split(' ')[1],
        date: new Date().toISOString().split('T')[0],
        predicted_risk_score: targetHotspot.breeding_risk_score,
        predicted_risk_level: targetHotspot.risk_level,
        observed_condition: targetHotspot.visual_detection,
        actual_stagnation_found: true,
        intervention_applied: targetHotspot.recommended_action,
        outcome: 'PREVENTED_STAGNATION',
        calibration_delta: +1
      };
      setLearningRecords(prev => [newLearningRecord, ...prev]);
    }

    addNotification({
      type: 'success',
      title: `Intervention Verified & Resolved ✓`,
      message: `Hotspot ${targetTask.hotspot_id} successfully closed. Feedback stored in learning pipeline.`
    });

    if (targetTask.hotspot_id === 'VG-1042' && demoStep === 16) {
      setDemoStep(17);
    }
  };

  // STEP 16 (Alt): Request Re-inspection
  const requestReinspection = (taskId: string, rejectionReason: string) => {
    const targetTask = tasks.find(t => t.task_id === taskId);
    if (!targetTask) return;

    const reviewTime = new Date().toISOString();

    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: 'RE_INSPECTION_REQUIRED',
          rejection_reason: rejectionReason,
          reviewed_at: reviewTime,
          reviewed_by: currentUser.name
        };
      }
      return t;
    }));

    setHotspots(prev => prev.map(h => {
      if (h.hotspot_id === targetTask.hotspot_id) {
        return {
          ...h,
          status: 'RE_INSPECTION_REQUIRED',
          updated_at: reviewTime
        };
      }
      return h;
    }));

    addNotification({
      type: 'warning',
      title: 'Re-Inspection Requested',
      message: `Task returned to ${targetTask.assigned_officer} with audit feedback.`
    });
  };

  // Reset ONLY the hero demo scenario (VG-1042) without wiping the rest of the dataset
  const resetDemoScenario = () => {
    const initialVg1042 = SEED_HOTSPOTS.find(h => h.hotspot_id === 'VG-1042') || SEED_HOTSPOTS[0];
    
    // Restore VG-1042 to OPEN state
    setHotspots(prev => prev.map(h => h.hotspot_id === 'VG-1042' ? { ...initialVg1042, status: 'OPEN', assigned_team: null, assigned_officer: null, assigned_officer_id: null, active_task_id: undefined } : h));
    
    // Remove VG-1042 task
    setTasks(prev => prev.filter(t => t.hotspot_id !== 'VG-1042'));
    
    // Remove VG-1042 learning feedback if any
    setLearningRecords(prev => prev.filter(r => r.hotspot_id !== 'VG-1042'));
    
    setCurrentUser(SEED_USERS[0]);
    setActiveView('DASHBOARD');
    setSelectedHotspotId('VG-1042');
    setDispatchModalHotspotId(null);
    setActiveTaskId(null);
    setDemoStep(1);

    addNotification({
      type: 'info',
      title: 'Demo Scenario Reset',
      message: 'Hotspot VG-1042 restored to OPEN. Ready for 18-step interactive walkthrough.'
    });
  };

  // Reset entire application data back to pristine hero demo state
  const resetToDefaultData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_HOTSPOTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_TASKS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_LEARNING);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CITIZEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CITIZEN_SUBMISSIONS);
    
    // Reset database service tables and reload
    databaseService.resetToDefault();
    
    setHotspots(getCompleteHotspotsDataset(SEED_HOTSPOTS));
    setTasks(databaseService.getTasks().map(t => ({
      task_id: t.task_id,
      hotspot_id: t.hotspot_id,
      ward: t.hotspot_id === 'VG-1042' ? 'Ward 104 - Kondapur' : 'Ward 104',
      location: t.hotspot_id === 'VG-1042' ? 'HITEC City Phase 2 Construction Site' : 'Municipal Site',
      priority: t.priority,
      status: t.status as any,
      recommended_action: 'Submersible Dewatering & Bti Bio-Larvicide Treatment',
      assigned_team: t.assigned_team,
      assigned_officer: t.assigned_officer,
      assigned_officer_id: 'usr-officer-01',
      assigned_by: 'Control Room Supervisor',
      assigned_at: t.created_at,
      deadline: t.deadline,
      admin_notes: t.notes,
      intervention_checklist: {
        remove_standing_water: false,
        clear_debris: false,
        restore_drainage: false,
        treat_retention_area: false,
        remove_containers: false,
        other_preventive_action: false
      }
    })));
    setLearningRecords(SEED_LEARNING_RECORDS);
    setRegisteredCitizen(null);
    setCitizenSubmissions([]);
    setCurrentUser(SEED_USERS[0]);
    setActiveView('DASHBOARD');
    setSelectedHotspotId(null);
    setDispatchModalHotspotId(null);
    setActiveTaskId(null);
    setDemoStep(1);

    addNotification({
      type: 'info',
      title: 'Demo Environment Reset',
      message: 'All 30 hotspots, tasks, and citizen registrations restored to initial state.'
    });
  };

  const advanceDemoStep = () => {
    if (demoStep < 18) setDemoStep(demoStep + 1);
  };

  return (
    <AppContext.Provider
      value={{
        hotspots,
        tasks,
        learningRecords,
        currentUser,
        setCurrentUser,
        activeView,
        selectedHotspotId,
        dispatchModalHotspotId,
        activeTaskId,
        notifications,
        demoStep,
        isDemoGuideOpen,
        demoMode: isDemoGuideOpen,
        setDemoMode: setIsDemoGuideOpen,
        resetDemo: resetDemoScenario,
        isMobileNavOpen,
        setIsMobileNavOpen,
        databaseConnectionStatus: dbConnectionStatus,
        runDatabaseHealthCheck,
        registeredCitizen,
        citizenSubmissions,
        registerCitizen,
        submitCitizenEvidence,
        approveCitizenSubmission,
        rejectCitizenSubmission,
        setActiveView: handleSetActiveView,
        switchUserRole,
        setSelectedHotspotId,
        setDispatchModalHotspotId,
        setActiveTaskId,
        setDemoStep,
        setIsDemoGuideOpen,
        advanceDemoStep,
        resetDemoScenario,
        dispatchTask,
        startInspection,
        submitIntervention,
        approveVerification,
        requestReinspection,
        resetToDefaultData,
        dismissNotification,
        addNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
