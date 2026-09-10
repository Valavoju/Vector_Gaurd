export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type HotspotStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'AWAITING_VERIFICATION' 
  | 'RESOLVED' 
  | 'RE_INSPECTION_REQUIRED';

export type TaskStatus = 
  | 'CREATED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'AWAITING_VERIFICATION' 
  | 'RESOLVED' 
  | 'RE_INSPECTION_REQUIRED';

export type ImageryLevel = 'LEVEL_1_GOV' | 'LEVEL_2_STREET' | 'LEVEL_3_DRONE' | 'UNAVAILABLE';

export type UserRole = 'ADMIN' | 'FIELD_OFFICER' | 'CITIZEN';

export interface CVDetectionResult {
  detectedCondition: string;
  confidence: number;
  tags: string[];
  boundingAreaDescription: string;
  surfaceType: string;
  estimatedAreaSqMeters?: number;
  supportingObservations?: string[];
}

export interface DeviceGpsAnchor {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  altitudeMeters?: number | null;
  headingDeg?: number | null;
  speedKmh?: number | null;
  acquiredAt: string;
  source: 'BROWSER_GEOLOCATION_API' | 'HARDWARE_GNSS_RECEIVER' | 'SIMULATED_RTK_FALLBACK';
  distanceToSiteMeters: number;
  isWithinGeofence: boolean;
  exifCrossValidationDeltaMeters?: number;
  deviceFingerprint?: string;
  anchorChecksum?: string;
  isCrossAnchorMatched?: boolean;
}

export interface ExifGeoMetadata {
  extractedLat: number;
  extractedLng: number;
  coordinateArray?: [number, number]; // [lat, lng] array
  gpsBoundaryPolygon?: [number, number][]; // Polygon bounding box coordinates
  siteLat: number;
  siteLng: number;
  distanceOffsetMeters: number;
  isGeoMatched: boolean;
  geoToleranceMeters: number;
  captureTimestamp: string;
  cameraMakeModel?: string;
  sensorIso?: string;
  sensorExposure?: string;
  sensorAperture?: string;
  headingAzimuthDeg?: number;
  altitudeMeters?: number;
  satelliteFix?: string;
  watermarkApplied: boolean;
  watermarkedImageUrl?: string;
  verificationAuditCode: string;
}

export interface HotspotRecord {
  hotspot_id: string;
  country: string; // 'India'
  state: string;   // 'Telangana' | 'Delhi' | 'Maharashtra' | 'Karnataka' etc.
  city: string;    // 'Hyderabad' | 'Delhi' | 'Mumbai' | 'Bengaluru' etc.
  region?: string; // 'South India' | 'North India' | 'West India' etc.
  local_area?: string;
  ward: string;
  ward_number: number;
  location: string;
  locality: string;
  latitude: number;
  longitude: number;
  rainfall: number; // mm in last 48-72h
  temperature: number; // °C
  humidity: number; // %
  drainage_condition: 'Good' | 'Moderate' | 'Poor' | 'Severely Blocked';
  construction_activity: 'None' | 'Minor Renovation' | 'Active Excavation' | 'Active Construction Pit';
  historical_risk: number; // 0 - 100
  water_retention_prediction: number; // 0 - 100
  visual_score: number; // 0 - 100
  environmental_score: number; // 0 - 100
  breeding_risk_score: number; // 0 - 100 (Formula: Visual*0.4 + WaterRetention*0.25 + Environmental*0.2 + Historical*0.15)
  risk_level: RiskLevel;
  imagery_source: 'TARGETED DRONE' | 'LICENSED SATELLITE' | 'MUNICIPAL STREET' | 'AERIAL SURVEY' | string;
  imagery_level: ImageryLevel;
  visual_detection: string;
  cv_result: CVDetectionResult;
  recommended_action: string;
  status: HotspotStatus;
  assigned_team: string | null;
  assigned_officer: string | null;
  assigned_officer_id: string | null;
  before_image_url?: string;
  before_exif_metadata?: ExifGeoMetadata;
  after_image_url?: string;
  after_exif_metadata?: ExifGeoMetadata;
  device_live_gps?: DeviceGpsAnchor;
  officer_notes?: string;
  ai_explanation: string;
  site_type: 'Construction Site' | 'Stormwater Drain' | 'Low-Lying Vacant Plot' | 'Roadside Depressions' | 'Scrap Yard' | 'Residential Basement';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  active_task_id?: string;
}

export interface TaskRecord {
  task_id: string;
  hotspot_id: string;
  country?: string;
  state?: string;
  city?: string;
  local_area?: string;
  ward: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: TaskStatus;
  recommended_action: string;
  assigned_team: string;
  assigned_officer: string;
  assigned_officer_id: string;
  assigned_by: string;
  assigned_at: string;
  deadline: string;
  admin_notes: string;
  before_evidence_url?: string;
  before_evidence_type?: 'seeded' | 'uploaded';
  before_exif_metadata?: ExifGeoMetadata;
  after_evidence_url?: string;
  after_evidence_type?: 'seeded' | 'uploaded';
  after_exif_metadata?: ExifGeoMetadata;
  device_live_gps?: DeviceGpsAnchor;
  intervention_checklist: {
    remove_standing_water: boolean;
    clear_debris: boolean;
    restore_drainage: boolean;
    treat_retention_area: boolean;
    remove_containers: boolean;
    other_preventive_action: boolean;
  };
  officer_notes?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  completed_at?: string;
}

export interface LearningRecord {
  id: string;
  hotspot_id: string;
  ward: string;
  city?: string;
  state?: string;
  date: string;
  predicted_risk_score: number;
  predicted_risk_level: RiskLevel;
  observed_condition: string;
  actual_stagnation_found: boolean;
  intervention_applied: string;
  outcome: 'PREVENTED_STAGNATION' | 'RESOLVED_EARLY' | 'FALSE_ALARM_RESOLVED';
  calibration_delta: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team?: string;
  zone?: string;
  phone: string;
  avatar: string;
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  state: string;
  city: string;
  consentGiven: boolean;
  consentTimestamp: string;
  registeredAt: string;
}

export type CitizenEvidenceType = 
  | 'Stagnant Water'
  | 'Blocked Drain'
  | 'Water-Retaining Pothole'
  | 'Construction Water Retention'
  | 'Open Container / Debris'
  | 'Other Environmental Condition';

export type CitizenSubmissionStatus = 
  | 'PENDING_HUMAN_VERIFICATION'
  | 'APPROVED_SUPPORTING'
  | 'REJECTED';

export interface CitizenEvidenceSubmission {
  submissionId: string; // e.g. 'CE-0001'
  citizenId: string;
  citizenNameMasked: string;
  citizenMobileMasked: string;
  citizenEmailMasked?: string;
  evidenceType: CitizenEvidenceType;
  imageUrl: string;
  state: string;
  city: string;
  localArea: string;
  gpsCoordinates?: string;
  description: string;
  consentRecorded: boolean;
  status: CitizenSubmissionStatus;
  isDroneRestrictedScenario?: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  linkedHotspotId?: string;
}

/** Privacy masking helpers */
export function maskName(name: string): string {
  if (!name) return 'A*** K*****';
  const parts = name.trim().split(/\s+/);
  return parts.map(p => {
    if (p.length <= 1) return p + '***';
    return p[0] + '***' + (p.length > 2 ? p[p.length - 1] : '');
  }).join(' ');
}

export function maskMobile(mobile: string): string {
  if (!mobile) return '******4321';
  const clean = mobile.replace(/\D/g, '');
  if (clean.length < 4) return '******' + clean;
  return '******' + clean.slice(-4);
}

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 1 ? local[0] + '***' : '***';
  return `${maskedLocal}@${domain}`;
}
