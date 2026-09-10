/**
 * VECTORGUARD AI — FIRESTORE SEED & MIGRATION ENGINE
 * 
 * Migrates existing demo & static datasets into live Firebase Firestore collections:
 * 1. hotspots (preserves VG-1042, VG-1001..VG-1071 with exact coordinates and risk scores)
 * 2. weather_observations (preserves IMD radar/AWS telemetry mapped to hotspots)
 * 3. historical_records (preserves municipal breeding history HIST-2026-081, HIST-2026-062, etc.)
 * 4. tasks (preserves TSK-6591 linked to VG-1042, TSK-6588, TSK-6572)
 * 5. evidence (preserves EVD-VG1042-DRN01..CTZ01 with vectorguard-evidence/ storage paths)
 * 6. verifications (preserves VRF-9021, VRF-9018 entomologist audits)
 * 7. interventions (preserves INT-4412 dewatering & Bti remediation)
 * 8. learning_outcomes (preserves LRN-01042, LRN-01043, LRN-01045 closed-loop calibrations)
 * 9. citizen_registrations (preserves REG-CZ-0492, REG-CZ-0388 sentinel registrations)
 * 
 * Key guarantees:
 * - Deterministic, idempotent seeding (uses exact document IDs, no duplicates)
 * - All records labeled with: "DEMO / PILOT DATA — ILLUSTRATIVE"
 * - Does not alter existing risk scores or GPS coordinates
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import config from '../firebase-applet-config.json' with { type: 'json' };

// Import original static/seed datasets
import { SEED_HOTSPOTS } from '../src/data/seedHotspots.ts';
import { getCompleteHotspotsDataset } from '../src/data/indiaGeoData.ts';

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const DEMO_LABEL = 'DEMO / PILOT DATA — ILLUSTRATIVE';

async function seedHotspots() {
  console.log('\n--- 1. Seeding Hotspots Collection ---');
  const allHotspots = getCompleteHotspotsDataset(SEED_HOTSPOTS);
  console.log(`Found ${allHotspots.length} total hotspots in codebase (including hero VG-1042)`);

  let count = 0;
  // Write in batches of 50
  for (let i = 0; i < allHotspots.length; i += 50) {
    const batch = writeBatch(db);
    const chunk = allHotspots.slice(i, i + 50);

    for (const h of chunk) {
      const docRef = doc(db, 'hotspots', h.hotspot_id);
      const record = {
        hotspot_id: h.hotspot_id,
        state: h.state,
        city: h.city,
        local_area: h.local_area || h.locality || 'Municipal Zone',
        ward: h.ward,
        latitude: h.latitude,
        longitude: h.longitude,
        site_type: h.site_type || 'Urban Stagnation Point',
        rainfall: h.rainfall,
        temperature: h.temperature,
        humidity: h.humidity,
        drainage_condition: h.drainage_condition || 'Poor',
        construction_activity: h.construction_activity || 'None',
        historical_risk: h.historical_risk,
        water_retention_prediction: h.water_retention_prediction,
        visual_condition_score: h.visual_score,
        environmental_score: h.environmental_score,
        risk_score: h.breeding_risk_score,
        risk_level: h.risk_level,
        imagery_source: h.imagery_source,
        imagery_access: h.imagery_level,
        visual_detection: h.visual_detection || 'Surface ponding detected',
        recommended_action: h.recommended_action || 'Inspect and clear',
        status: h.status || 'OPEN',
        assigned_team: h.assigned_team || null,
        assigned_officer: h.assigned_officer || null,
        created_at: h.created_at || '2026-08-10T08:00:00Z',
        updated_at: h.updated_at || new Date().toISOString(),
        _source_provenance: 'DATABASE RECORDS',
        _data_label: DEMO_LABEL,
        cv_result: h.cv_result || null
      };

      batch.set(docRef, record, { merge: true });
      count++;
    }
    await batch.commit();
    console.log(`  Committed batch ${Math.floor(i / 50) + 1} (${count}/${allHotspots.length})`);
  }

  // Double check hero VG-1042
  const heroSnap = await getDoc(doc(db, 'hotspots', 'VG-1042'));
  if (heroSnap.exists()) {
    console.log(`  Verified VG-1042 in Firestore! Risk: ${heroSnap.data()?.risk_score}, Ward: ${heroSnap.data()?.ward}`);
  } else {
    throw new Error('VG-1042 failed to seed!');
  }

  return count;
}

async function seedWeather(hotspots: any[]) {
  console.log('\n--- 2. Seeding Weather Observations Collection ---');
  let count = 0;
  let idx = 1;

  for (let i = 0; i < hotspots.length; i += 50) {
    const batch = writeBatch(db);
    const chunk = hotspots.slice(i, i + 50);

    for (const h of chunk) {
      const weatherId = `WX-${h.hotspot_id}-${idx++}`;
      const docRef = doc(db, 'weather_observations', weatherId);
      const record = {
        weather_id: weatherId,
        hotspot_id: h.hotspot_id,
        latitude: h.latitude,
        longitude: h.longitude,
        observation_time: '2026-08-15T06:00:00Z',
        rainfall_24h: Math.round(h.rainfall * 0.65),
        rainfall_48h: h.rainfall,
        temperature: h.temperature,
        humidity: h.humidity,
        forecast_rainfall: Math.max(0, Math.round(h.rainfall * 0.45)),
        forecast_temperature: h.temperature + 1,
        forecast_humidity: Math.min(95, h.humidity + 2),
        source: 'IMD Doppler Radar & AWS Network (Illustrative Telemetry)',
        created_at: new Date().toISOString(),
        _source_provenance: 'EXTERNAL DATA',
        _data_label: DEMO_LABEL
      };

      batch.set(docRef, record, { merge: true });
      count++;
    }
    await batch.commit();
  }
  console.log(`  Inserted ${count} weather observations into Firestore`);
  return count;
}

async function seedHistorical() {
  console.log('\n--- 3. Seeding Historical Records Collection ---');
  const historicalRecords = [
    {
      historical_id: 'HIST-2026-081',
      hotspot_id: 'VG-1042',
      observation_date: '2026-08-14',
      previous_stagnation: 'Heavy stagnation in unpaved basement foundation pit after 58mm rainfall',
      previous_risk_score: 88,
      inspection_result: 'Confirmed breeding conditions in 420 sq.m pit',
      intervention: 'Submersible pump extraction + 10% Temephos application',
      recurrence: 'High probability during prolonged monsoon precipitation',
      historical_rainfall: 58,
      field_observation: 'Severe silt accumulation along edge berms',
      verification_outcome: 'Resolved in 48 hours',
      source: 'Drone Patrol (Targeted Aerial)',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      historical_id: 'HIST-2026-062',
      hotspot_id: 'VG-1042',
      observation_date: '2026-07-22',
      previous_stagnation: 'Minor surface ponding along road verge drainage culvert',
      previous_risk_score: 65,
      inspection_result: 'Slow drainage discharge into municipal secondary conduit',
      intervention: 'Culvert desilting and trash grating restoration',
      recurrence: 'Moderate seasonal risk',
      historical_rainfall: 32,
      field_observation: 'Plastic bag obstructions cleared',
      verification_outcome: 'Resolved in 24 hours',
      source: 'Municipal Survey',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      historical_id: 'HIST-2026-044',
      hotspot_id: 'VG-1043',
      observation_date: '2026-08-01',
      previous_stagnation: 'Silt blockage in stormwater arterial channel',
      previous_risk_score: 79,
      inspection_result: 'Stagnant pool formation adjacent to flyover pillar',
      intervention: 'Excavator clearance + Bti bio-larvicide spraying',
      recurrence: 'Recurring during heavy rain',
      historical_rainfall: 45,
      field_observation: 'Construction debris runoff from elevated corridor',
      verification_outcome: 'Resolved in 36 hours',
      source: 'Municipal Survey',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      historical_id: 'HIST-2026-029',
      hotspot_id: 'VG-1044',
      observation_date: '2026-08-05',
      previous_stagnation: 'Depression ponding in vacant plot opposite residential block',
      previous_risk_score: 72,
      inspection_result: 'Vegetation overgrowth trapping rainwater',
      intervention: 'Brush cutting + earth leveling',
      recurrence: 'Low',
      historical_rainfall: 38,
      field_observation: 'Grading restored positive outflow to street gutter',
      verification_outcome: 'Resolved in 24 hours',
      source: 'Field Officer Ground Sweep',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const h of historicalRecords) {
    batch.set(doc(db, 'historical_records', h.historical_id), h, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${historicalRecords.length} historical records into Firestore`);
  return historicalRecords.length;
}

async function seedTasks() {
  console.log('\n--- 4. Seeding Tasks Collection ---');
  const tasks = [
    {
      task_id: 'TSK-6591',
      hotspot_id: 'VG-1042',
      assigned_team: 'Rapid Intervention Team 3',
      assigned_officer: 'K. Rao (Senior Health Inspector)',
      priority: 'Critical',
      deadline: '2026-08-16T18:00:00Z',
      status: 'ASSIGNED',
      created_at: '2026-08-14T09:30:00Z',
      started_at: '2026-08-14T11:00:00Z',
      completed_at: null,
      notes: 'Priority basement foundation pit remediation. Deploy submersible suction pump and apply Bti bio-larvicide.',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      task_id: 'TSK-6588',
      hotspot_id: 'VG-1043',
      assigned_team: 'Ward 104 Vector Control',
      assigned_officer: 'M. Suresh',
      priority: 'High',
      deadline: '2026-08-17T12:00:00Z',
      status: 'IN_PROGRESS',
      created_at: '2026-08-14T08:15:00Z',
      started_at: '2026-08-14T10:00:00Z',
      completed_at: null,
      notes: 'Clear stormwater arterial obstruction near pillar 42.',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      task_id: 'TSK-6572',
      hotspot_id: 'VG-1045',
      assigned_team: 'Zone 4 Sanitation Squad',
      assigned_officer: 'P. Varma',
      priority: 'Medium',
      deadline: '2026-08-15T16:00:00Z',
      status: 'RESOLVED',
      created_at: '2026-08-13T10:00:00Z',
      started_at: '2026-08-13T11:30:00Z',
      completed_at: '2026-08-14T15:00:00Z',
      notes: 'Low-lying plot cleared and treated. Verified by municipal supervisor.',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const t of tasks) {
    batch.set(doc(db, 'tasks', t.task_id), t, { merge: true });
  }
  await batch.commit();

  const taskSnap = await getDoc(doc(db, 'tasks', 'TSK-6591'));
  if (taskSnap.exists()) {
    console.log(`  Verified TSK-6591 in Firestore! Linked hotspot: ${taskSnap.data()?.hotspot_id}`);
  } else {
    throw new Error('TSK-6591 failed to seed!');
  }

  return tasks.length;
}

async function seedEvidence() {
  console.log('\n--- 5. Seeding Evidence Collection ---');
  const evidenceRecords = [
    {
      evidence_id: 'EVD-VG1042-DRN01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'TARGETED_DRONE',
      capture_type: 'AERIAL_BEFORE',
      image_reference: 'vectorguard-evidence/VG-1042/targeted/drone_surveillance_before.svg',
      storage_path: 'vectorguard-evidence/VG-1042/targeted/drone_surveillance_before.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.4435,
      longitude: 78.3772,
      timestamp: '2026-08-14T09:15:00Z',
      altitude: 45,
      camera_source: 'DJI Matrice 300 RTK - Zenmuse H20 Multi-Spectral',
      condition: 'Extensive water accumulation in foundation sump pit (420 sq.m)',
      description: 'High-resolution nadir aerial scan confirming stagnant retention post-rainfall.',
      verification_status: 'APPROVED',
      created_at: '2026-08-14T09:20:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-FLD01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'FIELD_OFFICER',
      capture_type: 'FIELD_BEFORE',
      image_reference: 'vectorguard-evidence/VG-1042/field/officer_ground_before.svg',
      storage_path: 'vectorguard-evidence/VG-1042/field/officer_ground_before.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44348,
      longitude: 78.37722,
      timestamp: '2026-08-14T11:22:00Z',
      altitude: 2,
      camera_source: 'Field Officer Rugged Mobile GNSS Terminal',
      condition: 'Murky standing water in basement excavation sump with construction debris',
      description: 'On-site perimeter inspection verifying stagnant depth of 0.45m.',
      verification_status: 'APPROVED',
      created_at: '2026-08-14T11:23:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-CLP01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'FIELD_OFFICER',
      capture_type: 'CLOSE_UP',
      image_reference: 'vectorguard-evidence/VG-1042/field/standing_water_closeup.svg',
      storage_path: 'vectorguard-evidence/VG-1042/field/standing_water_closeup.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44349,
      longitude: 78.37721,
      timestamp: '2026-08-14T11:25:00Z',
      altitude: 1,
      camera_source: 'Field Officer Macro Lens',
      condition: 'Surface algae sheen and stagnant perimeter rings',
      description: 'Close inspection confirming favorable vector breeding micro-habitat.',
      verification_status: 'APPROVED',
      created_at: '2026-08-14T11:26:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-INT01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'FIELD_OFFICER',
      capture_type: 'INTERVENTION',
      image_reference: 'vectorguard-evidence/VG-1042/field/dewatering_pump_intervention.svg',
      storage_path: 'vectorguard-evidence/VG-1042/field/dewatering_pump_intervention.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44349,
      longitude: 78.37721,
      timestamp: '2026-08-15T14:30:00Z',
      altitude: 1.5,
      camera_source: 'Field Officer Rugged Mobile GNSS Terminal',
      condition: 'Active mechanical dewatering in progress',
      description: 'Submersible trash pump discharging sump retention into municipal sewer.',
      verification_status: 'APPROVED',
      created_at: '2026-08-15T14:35:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-AFT01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'FIELD_OFFICER',
      capture_type: 'AFTER',
      image_reference: 'vectorguard-evidence/VG-1042/field/dry_foundation_after.svg',
      storage_path: 'vectorguard-evidence/VG-1042/field/dry_foundation_after.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44351,
      longitude: 78.37724,
      timestamp: '2026-08-16T10:00:00Z',
      altitude: 2,
      camera_source: 'Field Officer Rugged Mobile GNSS Terminal',
      condition: 'Basement gravel floor dry and free of standing water',
      description: 'Post-intervention validation showing zero surface pooling.',
      verification_status: 'APPROVED',
      created_at: '2026-08-16T10:05:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-TRT01',
      hotspot_id: 'VG-1042',
      task_id: 'TSK-6591',
      source_type: 'FIELD_OFFICER',
      capture_type: 'CLEANUP_PROOF',
      image_reference: 'vectorguard-evidence/VG-1042/field/bti_larvicide_proof.svg',
      storage_path: 'vectorguard-evidence/VG-1042/field/bti_larvicide_proof.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44350,
      longitude: 78.37723,
      timestamp: '2026-08-16T10:15:00Z',
      altitude: 1.5,
      camera_source: 'Field Officer Rugged Mobile GNSS Terminal',
      condition: 'Bti granular larvicide barrier deployed',
      description: 'Preventive bio-larvicide application to eliminate residual egg rafts.',
      verification_status: 'APPROVED',
      created_at: '2026-08-16T10:20:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    },
    {
      evidence_id: 'EVD-VG1042-CTZ01',
      hotspot_id: 'VG-1042',
      task_id: null,
      source_type: 'REGISTERED_CITIZEN',
      capture_type: 'CITIZEN_PHOTO',
      image_reference: 'vectorguard-evidence/VG-1042/citizen/citizen_debris_pooling.svg',
      storage_path: 'vectorguard-evidence/VG-1042/citizen/citizen_debris_pooling.svg',
      storage_bucket: 'vectorguard-evidence',
      latitude: 17.44353,
      longitude: 78.37725,
      timestamp: '2026-08-13T17:45:00Z',
      altitude: null,
      camera_source: 'Citizen Sentinel Mobile Web Portal',
      condition: 'Rainwater accumulation visible from street boundary wall',
      description: 'Citizen observation submitted as supporting advisory evidence only.',
      verification_status: 'APPROVED',
      created_at: '2026-08-13T17:46:00Z',
      _source_provenance: 'EVIDENCE',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const e of evidenceRecords) {
    batch.set(doc(db, 'evidence', e.evidence_id), e, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${evidenceRecords.length} evidence records into Firestore`);
  return evidenceRecords.length;
}

async function seedVerifications() {
  console.log('\n--- 6. Seeding Verifications Collection ---');
  const verifications = [
    {
      verification_id: 'VRF-9021',
      evidence_id: 'EVD-VG1042-AFT01',
      hotspot_id: 'VG-1042',
      verified_by: 'Dr. Anita Desai (Chief Municipal Entomologist)',
      verification_status: 'APPROVED',
      verification_notes: 'Audited against high-resolution drone baseline. Excavation pit verified dry and bio-treated.',
      verified_at: '2026-08-16T11:00:00Z',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    },
    {
      verification_id: 'VRF-9018',
      evidence_id: 'EVD-VG1042-DRN01',
      hotspot_id: 'VG-1042',
      verified_by: 'VectorGuard Control Room Supervisor',
      verification_status: 'APPROVED',
      verification_notes: 'Computer vision water segmentation validated; task dispatched to field team.',
      verified_at: '2026-08-14T09:25:00Z',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const v of verifications) {
    batch.set(doc(db, 'verifications', v.verification_id), v, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${verifications.length} verification records into Firestore`);
  return verifications.length;
}

async function seedInterventions() {
  console.log('\n--- 7. Seeding Interventions Collection ---');
  const interventions = [
    {
      intervention_id: 'INT-4412',
      task_id: 'TSK-6591',
      hotspot_id: 'VG-1042',
      action_type: 'Submersible Dewatering & Bti Bio-Larvicide Treatment',
      description: 'Evacuated 85,000 liters of stagnant runoff; treated gravel sump with 500g Bti granules.',
      performed_by: 'K. Rao (Field Specialist, Rapid Intervention Team 3)',
      performed_at: '2026-08-15T15:00:00Z',
      before_evidence_id: 'EVD-VG1042-FLD01',
      intervention_evidence_id: 'EVD-VG1042-INT01',
      after_evidence_id: 'EVD-VG1042-AFT01',
      outcome: 'Water evacuated completely. Foundation pit graded to prevent re-pooling.',
      _source_provenance: 'DATABASE RECORDS',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const i of interventions) {
    batch.set(doc(db, 'interventions', i.intervention_id), i, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${interventions.length} intervention records into Firestore`);
  return interventions.length;
}

async function seedLearning() {
  console.log('\n--- 8. Seeding Learning Outcomes Collection ---');
  const learningRecords = [
    {
      learning_id: 'LRN-01042',
      hotspot_id: 'VG-1042',
      predicted_risk: 94,
      observed_condition: '420 sq.m stagnant water pool in basement foundation trench',
      intervention_outcome: 'Dewatered & Bti treated within 48h',
      verification_outcome: 'Audited and Approved',
      observation_date: '2026-08-16',
      calibration_status: 'CALIBRATED_RETENTION',
      _source_provenance: 'MODEL OUTPUTS',
      _data_label: DEMO_LABEL
    },
    {
      learning_id: 'LRN-01043',
      hotspot_id: 'VG-1043',
      predicted_risk: 78,
      observed_condition: 'Stormwater arterial silt blockage',
      intervention_outcome: 'Debris removed; flow restored',
      verification_outcome: 'Audited and Approved',
      observation_date: '2026-08-14',
      calibration_status: 'STABLE_VALIDATED',
      _source_provenance: 'MODEL OUTPUTS',
      _data_label: DEMO_LABEL
    },
    {
      learning_id: 'LRN-01045',
      hotspot_id: 'VG-1045',
      predicted_risk: 68,
      observed_condition: 'Vacant plot surface ponding',
      intervention_outcome: 'Graded and gravel filled',
      verification_outcome: 'Audited and Approved',
      observation_date: '2026-08-12',
      calibration_status: 'STABLE_VALIDATED',
      _source_provenance: 'MODEL OUTPUTS',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const l of learningRecords) {
    batch.set(doc(db, 'learning_outcomes', l.learning_id), l, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${learningRecords.length} learning outcome records into Firestore`);
  return learningRecords.length;
}

async function seedCitizenRegistrations() {
  console.log('\n--- 9. Seeding Citizen Registrations Collection ---');
  const citizens = [
    {
      citizen_registration_id: 'REG-CZ-0492',
      full_name: 'Ananya Sharma',
      mobile_number: '+91 98765 43210',
      email: 'ananya.s@example.com',
      state: 'Telangana',
      city: 'Hyderabad',
      consent_recorded: true,
      data_usage_authorized: true,
      registered_at: '2026-08-10T14:20:00Z',
      reports_submitted_count: 3,
      status: 'VERIFIED_SENTINEL',
      _source_provenance: 'DATABASE RECORDS (Protected PII)',
      _data_label: DEMO_LABEL
    },
    {
      citizen_registration_id: 'REG-CZ-0388',
      full_name: 'Vikram Reddy',
      mobile_number: '+91 98111 22334',
      email: 'vikram.r@example.com',
      state: 'Telangana',
      city: 'Hyderabad',
      consent_recorded: true,
      data_usage_authorized: true,
      registered_at: '2026-08-11T09:10:00Z',
      reports_submitted_count: 1,
      status: 'VERIFIED_SENTINEL',
      _source_provenance: 'DATABASE RECORDS (Protected PII)',
      _data_label: DEMO_LABEL
    },
    {
      citizen_registration_id: 'REG-CZ-0512',
      full_name: 'Sunita Rao',
      mobile_number: '+91 98222 33445',
      email: 'sunita.rao@example.com',
      state: 'Telangana',
      city: 'Hyderabad',
      consent_recorded: true,
      data_usage_authorized: true,
      registered_at: '2026-08-12T16:45:00Z',
      reports_submitted_count: 2,
      status: 'VERIFIED_SENTINEL',
      _source_provenance: 'DATABASE RECORDS (Protected PII)',
      _data_label: DEMO_LABEL
    }
  ];

  const batch = writeBatch(db);
  for (const c of citizens) {
    batch.set(doc(db, 'citizen_registrations', c.citizen_registration_id), c, { merge: true });
  }
  await batch.commit();
  console.log(`  Inserted ${citizens.length} citizen registration records into Firestore`);
  return citizens.length;
}

async function cleanPingDoc() {
  try {
    await deleteDoc(doc(db, 'hotspots', 'VG-TEST-PING'));
  } catch {
    // ignore
  }
}

async function verifyAllCollections() {
  console.log('\n================ VERIFYING FIRESTORE COLLECTIONS ================');
  const collections = [
    'hotspots',
    'weather_observations',
    'historical_records',
    'tasks',
    'evidence',
    'verifications',
    'interventions',
    'learning_outcomes',
    'citizen_registrations'
  ];

  const report: Record<string, number> = {};
  for (const colName of collections) {
    const snap = await getDocs(collection(db, colName));
    report[colName] = snap.size;
    console.log(`✓ Collection "${colName}": ${snap.size} documents in Firestore`);
  }

  // Check VG-1042
  const vg1042 = await getDoc(doc(db, 'hotspots', 'VG-1042'));
  console.log(`\n✓ Document "hotspots/VG-1042": ${vg1042.exists() ? 'EXISTS' : 'MISSING'}`);
  if (vg1042.exists()) {
    console.log('  Data:', JSON.stringify(vg1042.data(), null, 2).slice(0, 300) + '...');
  }

  // Check TSK-6591
  const tsk6591 = await getDoc(doc(db, 'tasks', 'TSK-6591'));
  console.log(`✓ Document "tasks/TSK-6591": ${tsk6591.exists() ? 'EXISTS' : 'MISSING'}`);
  if (tsk6591.exists()) {
    console.log('  Data:', JSON.stringify(tsk6591.data(), null, 2));
  }

  // Check evidence referencing VG-1042
  const evdSnap = await getDoc(doc(db, 'evidence', 'EVD-VG1042-DRN01'));
  console.log(`✓ Document "evidence/EVD-VG1042-DRN01": ${evdSnap.exists() ? 'EXISTS' : 'MISSING'}`);
  if (evdSnap.exists()) {
    console.log('  Image Reference:', evdSnap.data()?.image_reference);
  }

  console.log('\n================ MIGRATION SUCCESS SUMMARY ================');
  console.table(report);
}

async function run() {
  try {
    console.log(`Connecting to Firestore database: ${config.firestoreDatabaseId}`);
    await cleanPingDoc();

    const hotspots = getCompleteHotspotsDataset(SEED_HOTSPOTS);
    await seedHotspots();
    await seedWeather(hotspots);
    await seedHistorical();
    await seedTasks();
    await seedEvidence();
    await seedVerifications();
    await seedInterventions();
    await seedLearning();
    await seedCitizenRegistrations();

    await verifyAllCollections();
    console.log('\nSeeding complete! Firestore is fully populated.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during Firestore migration:', error);
    process.exit(1);
  }
}

run();
