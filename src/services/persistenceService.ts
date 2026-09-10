/**
 * VECTORGUARD AI — PERSISTENCE & DATA REPOSITORY
 * 
 * Cleanly decouples frontend components from storage implementation.
 * Supports:
 * - Hotspot lifecycle management
 * - Task dispatch, field completion & admin verification
 * - Historical observations repository
 * - Continuous learning feedback calibration
 * - Atomic local storage synchronization with optional REST/Firestore bridge
 */

import { HotspotRecord, TaskRecord, LearningRecord, CVDetectionResult } from '../types';
import { SEED_HOTSPOTS, SEED_LEARNING_RECORDS } from '../data/seedHotspots';
import { getCompleteHotspotsDataset } from '../data/indiaGeoData';

const KEYS = {
  HOTSPOTS: 'vectorguard_hotspots_v2',
  TASKS: 'vectorguard_tasks_v2',
  LEARNING: 'vectorguard_learning_v2',
  HISTORICAL: 'vectorguard_historical_v2'
};

export interface HistoricalObservation {
  observation_id: string;
  hotspot_id: string;
  date: string;
  condition: string;
  risk_score: number;
  rainfall_recorded_mm: number;
  intervention_applied?: string;
  outcome: string;
  source: 'MUNICIPAL_SURVEY' | 'DRONE_PATROL' | 'CITIZEN_REPORT' | 'SATELLITE_RADAR';
}

export const SEED_HISTORICAL_OBSERVATIONS: HistoricalObservation[] = [
  {
    observation_id: 'HIST-2026-081',
    hotspot_id: 'VG-1042',
    date: '2026-08-14',
    condition: 'Heavy stagnation in unpaved basement foundation pit after 58mm rainfall',
    risk_score: 88,
    rainfall_recorded_mm: 58,
    intervention_applied: 'Submersible pump extraction + 10% Temephos application',
    outcome: 'Resolved in 48 hours',
    source: 'DRONE_PATROL'
  },
  {
    observation_id: 'HIST-2026-062',
    hotspot_id: 'VG-1042',
    date: '2026-07-22',
    condition: 'Minor surface ponding along road verge drainage culvert',
    risk_score: 65,
    rainfall_recorded_mm: 32,
    intervention_applied: 'Culvert desilting',
    outcome: 'Resolved in 24 hours',
    source: 'MUNICIPAL_SURVEY'
  },
  {
    observation_id: 'HIST-2026-044',
    hotspot_id: 'VG-1043',
    date: '2026-08-01',
    condition: 'Silt blockage in stormwater arterial channel',
    risk_score: 79,
    rainfall_recorded_mm: 45,
    intervention_applied: 'Excavator clearance + Bti larvicide',
    outcome: 'Resolved in 36 hours',
    source: 'MUNICIPAL_SURVEY'
  }
];

class PersistenceService {
  private memoryHotspots: HotspotRecord[] = [];
  private memoryTasks: TaskRecord[] = [];
  private memoryLearning: LearningRecord[] = [];
  private memoryHistorical: HistoricalObservation[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedH = localStorage.getItem(KEYS.HOTSPOTS);
      if (savedH) {
        const parsed = JSON.parse(savedH);
        this.memoryHotspots = getCompleteHotspotsDataset(parsed);
      } else {
        this.memoryHotspots = getCompleteHotspotsDataset(SEED_HOTSPOTS);
      }

      const savedT = localStorage.getItem(KEYS.TASKS);
      if (savedT) {
        this.memoryTasks = JSON.parse(savedT);
      } else {
        this.memoryTasks = [];
      }

      const savedL = localStorage.getItem(KEYS.LEARNING);
      if (savedL) {
        this.memoryLearning = JSON.parse(savedL);
      } else {
        this.memoryLearning = SEED_LEARNING_RECORDS;
      }

      const savedHist = localStorage.getItem(KEYS.HISTORICAL);
      if (savedHist) {
        this.memoryHistorical = JSON.parse(savedHist);
      } else {
        this.memoryHistorical = SEED_HISTORICAL_OBSERVATIONS;
      }
    } catch {
      this.memoryHotspots = getCompleteHotspotsDataset(SEED_HOTSPOTS);
      this.memoryTasks = [];
      this.memoryLearning = SEED_LEARNING_RECORDS;
      this.memoryHistorical = SEED_HISTORICAL_OBSERVATIONS;
    }
  }

  public getHotspots(): HotspotRecord[] {
    return [...this.memoryHotspots];
  }

  public saveHotspots(hotspots: HotspotRecord[]): void {
    this.memoryHotspots = hotspots;
    try {
      localStorage.setItem(KEYS.HOTSPOTS, JSON.stringify(hotspots));
    } catch {
      // storage quota or private window
    }
  }

  public getTasks(): TaskRecord[] {
    return [...this.memoryTasks];
  }

  public saveTasks(tasks: TaskRecord[]): void {
    this.memoryTasks = tasks;
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // storage quota
    }
  }

  public getLearningRecords(): LearningRecord[] {
    return [...this.memoryLearning];
  }

  public saveLearningRecords(records: LearningRecord[]): void {
    this.memoryLearning = records;
    try {
      localStorage.setItem(KEYS.LEARNING, JSON.stringify(records));
    } catch {
      // storage quota
    }
  }

  public getHistoricalObservations(hotspotId?: string): HistoricalObservation[] {
    if (!hotspotId) return [...this.memoryHistorical];
    return this.memoryHistorical.filter(h => h.hotspot_id === hotspotId);
  }

  public resetAll(): { hotspots: HotspotRecord[]; tasks: TaskRecord[]; learning: LearningRecord[] } {
    try {
      localStorage.removeItem(KEYS.HOTSPOTS);
      localStorage.removeItem(KEYS.TASKS);
      localStorage.removeItem(KEYS.LEARNING);
      localStorage.removeItem(KEYS.HISTORICAL);
    } catch {
      // ignore
    }
    this.memoryHotspots = getCompleteHotspotsDataset(SEED_HOTSPOTS);
    this.memoryTasks = [];
    this.memoryLearning = SEED_LEARNING_RECORDS;
    this.memoryHistorical = SEED_HISTORICAL_OBSERVATIONS;
    return {
      hotspots: this.memoryHotspots,
      tasks: this.memoryTasks,
      learning: this.memoryLearning
    };
  }
}

export const persistenceService = new PersistenceService();
