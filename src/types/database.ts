/**
 * VECTORGUARD AI — PERSISTENT DATABASE TYPES & SCHEMAS
 * 
 * Strict logical schema declarations matching relational PostgreSQL / Firestore tables:
 * 1. hotspots
 * 2. weather_observations
 * 3. historical_records
 * 4. tasks
 * 5. evidence
 * 6. verifications
 * 7. interventions
 * 8. learning_outcomes
 * 9. citizen_registrations
 */

export type DatabaseConnectionStatus = 'CONNECTED' | 'RECONNECTING' | 'UNAVAILABLE';

export type DatabaseTableKey = 
  | 'hotspots'
  | 'weather_observations'
  | 'historical_records'
  | 'tasks'
  | 'evidence'
  | 'verifications'
  | 'interventions'
  | 'learning_outcomes'
  | 'citizen_registrations';

export interface DbHotspotRecord {
  hotspot_id: string; // Primary Key
  state: string;
  city: string;
  local_area: string;
  ward: string;
  latitude: number;
  longitude: number;
  site_type: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  drainage_condition: 'Good' | 'Moderate' | 'Poor' | 'Severely Blocked';
  construction_activity: 'None' | 'Minor Renovation' | 'Active Excavation' | 'Active Construction Pit';
  historical_risk: number;
  water_retention_prediction: number;
  visual_condition_score: number;
  environmental_score: number;
  risk_score: number; // 0-100 deterministic breeding risk formula
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  imagery_source: string;
  imagery_access: string;
  visual_detection: string;
  recommended_action: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VERIFICATION' | 'RESOLVED' | 'RE_INSPECTION_REQUIRED';
  assigned_team: string | null;
  assigned_officer: string | null;
  created_at: string;
  updated_at: string;
  // Metadata provenance
  _source_provenance?: 'MODEL OUTPUTS' | 'DATABASE RECORDS' | 'EXTERNAL DATA' | 'EVIDENCE';
}

export interface DbWeatherObservation {
  weather_id: string; // Primary Key
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  latitude: number;
  longitude: number;
  observation_time: string;
  rainfall_24h: number;
  rainfall_48h: number;
  temperature: number;
  humidity: number;
  forecast_rainfall: number;
  forecast_temperature: number;
  forecast_humidity: number;
  source: string; // e.g. "IMD Doppler Radar & AWS Network"
  created_at: string;
  _source_provenance?: 'EXTERNAL DATA';
}

export interface DbHistoricalRecord {
  historical_id: string; // Primary Key
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  observation_date: string;
  previous_stagnation: string;
  previous_risk_score: number;
  inspection_result: string;
  intervention: string;
  recurrence: string;
  historical_rainfall: number;
  field_observation: string;
  verification_outcome: string;
  source: string; // e.g. "Municipal Survey", "Drone Patrol"
  _source_provenance?: 'DATABASE RECORDS';
}

export interface DbTaskRecord {
  task_id: string; // Primary Key (e.g. "TSK-6591")
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  assigned_team: string;
  assigned_officer: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  status: 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VERIFICATION' | 'RESOLVED' | 'RE_INSPECTION_REQUIRED';
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  notes: string;
  _source_provenance?: 'DATABASE RECORDS';
}

export type EvidenceSourceType = 
  | 'TARGETED_DRONE' 
  | 'FIELD_OFFICER' 
  | 'AUTHORIZED_GOVERNMENT' 
  | 'REGISTERED_CITIZEN';

export type EvidenceCaptureType = 
  | 'AERIAL_BEFORE' 
  | 'FIELD_BEFORE' 
  | 'CLOSE_UP' 
  | 'INTERVENTION' 
  | 'AFTER' 
  | 'CLEANUP_PROOF' 
  | 'CITIZEN_PHOTO';

export interface DbEvidenceRecord {
  evidence_id: string; // Primary Key (e.g. "EVD-1042-01")
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  task_id?: string | null; // Foreign Key -> tasks.task_id
  source_type: EvidenceSourceType;
  capture_type: EvidenceCaptureType;
  image_reference: string; // Persistent storage path / URL (e.g. "vectorguard-evidence/VG-1042/targeted/drone_before.svg")
  latitude: number;
  longitude: number;
  timestamp: string;
  altitude?: number | null;
  camera_source: string; // e.g. "DJI Matrice 300 RTK - Zenmuse H20", "Officer Mobile GNSS", "Citizen Sentinel Portal"
  condition: string;
  description: string;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REINSPECTION_REQUIRED';
  created_at: string;
  _source_provenance?: 'EVIDENCE';
}

export interface DbVerificationRecord {
  verification_id: string; // Primary Key (e.g. "VRF-9021")
  evidence_id: string; // Foreign Key -> evidence.evidence_id
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  verified_by: string; // e.g. "Dr. Anita Desai (Chief Municipal Entomologist)"
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REINSPECTION_REQUIRED';
  verification_notes: string;
  verified_at: string;
  _source_provenance?: 'DATABASE RECORDS';
}

export interface DbInterventionRecord {
  intervention_id: string; // Primary Key (e.g. "INT-4412")
  task_id: string; // Foreign Key -> tasks.task_id
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  action_type: string; // e.g. "Dewatering & Bio-larvicide Application"
  description: string;
  performed_by: string; // e.g. "K. Rao (Field Specialist)"
  performed_at: string;
  before_evidence_id: string; // Foreign Key -> evidence.evidence_id
  intervention_evidence_id?: string | null;
  after_evidence_id: string; // Foreign Key -> evidence.evidence_id
  outcome: string; // e.g. "Water evacuated completely. Gravel trench exposed and treated with Bti."
  _source_provenance?: 'DATABASE RECORDS';
}

export interface DbLearningOutcomeRecord {
  learning_id: string; // Primary Key (e.g. "LRN-01042")
  hotspot_id: string; // Foreign Key -> hotspots.hotspot_id
  predicted_risk: number;
  observed_condition: string;
  intervention_outcome: string;
  verification_outcome: string;
  observation_date: string;
  calibration_status: 'CALIBRATED_RETENTION' | 'PENDING_CYCLE' | 'STABLE_VALIDATED';
  _source_provenance?: 'MODEL OUTPUTS';
}

export interface DbCitizenRegistrationRecord {
  citizen_registration_id: string; // Primary Key (e.g. "REG-CZ-0492")
  full_name: string; // Protected PII (masked in UI)
  mobile_number: string; // Protected PII (masked in UI)
  email?: string | null; // Protected PII (masked in UI)
  state: string;
  city: string;
  consent_recorded: boolean;
  registered_at: string;
  _source_provenance?: 'DATABASE RECORDS';
}
