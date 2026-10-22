import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Satellite, 
  CloudRain, 
  Layers, 
  Eye, 
  Cpu, 
  Send, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Database,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  Search,
  X,
  FileText,
  Table as TableIcon,
  Code,
  Download,
  Check,
  AlertCircle,
  HardDrive,
  ExternalLink,
  Shield,
  Clock,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { databaseService } from '../../services/databaseService';
import { evidenceStorageService } from '../../services/evidenceStorageService';
import { DatabaseTableKey } from '../../types/database';

export const TechnicalArchitecture: React.FC = () => {
  const { databaseConnectionStatus, runDatabaseHealthCheck } = useApp();

  // Health check state
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthLatency, setHealthLatency] = useState<number | null>(24);
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toLocaleTimeString());
  const [, setTick] = useState(0);

  // Subscribe to live database updates from Firestore
  useEffect(() => {
    return databaseService.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  // Record Inspector Modal State
  const [inspectTable, setInspectTable] = useState<DatabaseTableKey | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Active section tab: 'DATABASE' or 'PIPELINE'
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'PIPELINE'>('DATABASE');

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await runDatabaseHealthCheck();
      setHealthLatency(res.latencyMs);
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch {
      setHealthLatency(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Table Data Resolvers
  const getTableRows = (tableKey: DatabaseTableKey): any[] => {
    switch (tableKey) {
      case 'hotspots':
        return databaseService.getHotspots();
      case 'weather_observations':
        return databaseService.getWeatherObservations();
      case 'historical_records':
        return databaseService.getHistoricalRecords();
      case 'tasks':
        return databaseService.getTasks();
      case 'evidence':
        return databaseService.getEvidence();
      case 'verifications':
        return databaseService.getVerifications();
      case 'interventions':
        return databaseService.getInterventions();
      case 'learning_outcomes':
        return databaseService.getLearningOutcomes();
      case 'citizen_registrations':
        return databaseService.getCitizenRegistrations();
      default:
        return [];
    }
  };

  // Dataset Table Meta
  const DATASET_TABLES: Array<{
    key: DatabaseTableKey;
    title: string;
    description: string;
    sourceTag: 'DATABASE RECORDS' | 'MODEL OUTPUTS' | 'EXTERNAL DATA' | 'EVIDENCE';
    primarySource: string;
    primaryKey: string;
    foreignKeys?: string;
    icon: any;
    accentColor: string;
  }> = [
    {
      key: 'hotspots',
      title: 'Hotspots',
      description: 'Persistent register of urban water stagnation sites, environmental indices, and breeding risk scores.',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Municipal GIS & Ground Survey',
      primaryKey: 'hotspot_id',
      foreignKeys: 'ward, city, state',
      icon: MapPin,
      accentColor: 'sky'
    },
    {
      key: 'weather_observations',
      title: 'Weather Observations',
      description: 'Location-specific 24h/48h precipitation, temperature, humidity, and Doppler radar forecasts.',
      sourceTag: 'EXTERNAL DATA',
      primarySource: 'Weather API / IMD Doppler Radar & AWS Network',
      primaryKey: 'weather_id',
      foreignKeys: 'hotspot_id',
      icon: CloudRain,
      accentColor: 'indigo'
    },
    {
      key: 'historical_records',
      title: 'Historical Records',
      description: 'Multi-year seasonal recurrence patterns, prior inspection outcomes, and remediation effectiveness.',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Historical Dataset & Drone Patrol Archives',
      primaryKey: 'historical_id',
      foreignKeys: 'hotspot_id',
      icon: Clock,
      accentColor: 'amber'
    },
    {
      key: 'tasks',
      title: 'Tasks',
      description: 'Operational dispatch orders, deadlines, team assignments, and remediation workflows (includes TSK-6591).',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Municipal Field Dispatch Engine',
      primaryKey: 'task_id',
      foreignKeys: 'hotspot_id, assigned_officer_id',
      icon: Send,
      accentColor: 'blue'
    },
    {
      key: 'evidence',
      title: 'Evidence',
      description: 'Immutable multi-source evidence store with aerial, field before/after, and citizen supporting captures.',
      sourceTag: 'EVIDENCE',
      primarySource: 'Targeted Drone, Field Officer GNSS & Citizen Sentinel',
      primaryKey: 'evidence_id',
      foreignKeys: 'hotspot_id, task_id',
      icon: Camera,
      accentColor: 'purple'
    },
    {
      key: 'verifications',
      title: 'Verifications',
      description: 'Two-tier verification audits by Chief Entomologist and Control Room validating remediations.',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Chief Municipal Entomologist & Quality Supervisors',
      primaryKey: 'verification_id',
      foreignKeys: 'evidence_id, hotspot_id',
      icon: ShieldCheck,
      accentColor: 'emerald'
    },
    {
      key: 'interventions',
      title: 'Interventions',
      description: 'Remediation logs linking mechanical dewatering, Bti larviciding, before/after evidence, and team outputs.',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Rapid Intervention Teams',
      primaryKey: 'intervention_id',
      foreignKeys: 'task_id, hotspot_id, before_evidence_id, after_evidence_id',
      icon: HardDrive,
      accentColor: 'cyan'
    },
    {
      key: 'learning_outcomes',
      title: 'Learning Outcomes',
      description: 'Retained ground-truth feedback outcomes for future model calibration and retraining cycles.',
      sourceTag: 'MODEL OUTPUTS',
      primarySource: 'Ground-Truth Calibration Pipeline',
      primaryKey: 'learning_id',
      foreignKeys: 'hotspot_id',
      icon: Cpu,
      accentColor: 'rose'
    },
    {
      key: 'citizen_registrations',
      title: 'Citizen Registrations',
      description: 'Privacy-hardened registry for public health sentinels submitting community advisory evidence.',
      sourceTag: 'DATABASE RECORDS',
      primarySource: 'Citizen Sentinel Portal (PII Protected & Masked)',
      primaryKey: 'citizen_registration_id',
      icon: Shield,
      accentColor: 'teal'
    }
  ];

  const activeTableMeta = DATASET_TABLES.find(t => t.key === inspectTable);
  const rawRows = inspectTable ? getTableRows(inspectTable) : [];
  
  const filteredRows = rawRows.filter(row => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return JSON.stringify(row).toLowerCase().includes(q);
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawRows, null, 2));
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleExportCsv = () => {
    if (!rawRows.length) return;
    const keys = Object.keys(rawRows[0]);
    const csvContent = [
      keys.join(','),
      ...rawRows.map(row => keys.map(k => {
        const val = row[k];
        if (typeof val === 'object' && val !== null) {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vectorguard_${inspectTable}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1560px] mx-auto space-y-6">
      
      {/* Top Navigation / Tab Header */}
      <div className="vg-hero rounded-2xl p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Data & Machine Learning Architecture</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Production Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real persistent database operations, 9 logical schema tables, verified evidence storage, and mathematical risk calibration
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'DATABASE'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database Hub (9 Tables)
          </button>
          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'PIPELINE'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Full Pipeline & Scoring
          </button>
        </div>
      </div>

      {/* SECTION 1: DATABASE CONNECTION HEALTH & TRANSPARENCY BAR */}
      <div className="vg-panel-dark rounded-2xl p-5 shadow-lg backdrop-blur-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">DATABASE</span>
              
              {databaseConnectionStatus === 'CONNECTED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ● Connected
                </span>
              )}
              {databaseConnectionStatus === 'RECONNECTING' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ● Reconnecting
                </span>
              )}
              {databaseConnectionStatus === 'UNAVAILABLE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/40 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  ● Offline Mode
                </span>
              )}

              {healthLatency !== null && (
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                  Latency: <span className="text-emerald-400">{healthLatency}ms</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <div>
                <strong className="text-slate-300">Provider:</strong> Firebase Firestore
              </div>
              <div>•</div>
              <div>
                <strong className="text-slate-300">Storage:</strong> Firebase Storage / vectorguard-evidence
              </div>
              <div>•</div>
              <div>
                <strong className="text-slate-300">Last Health Ping:</strong> {lastCheckTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleHealthCheck}
              disabled={isCheckingHealth}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              {isCheckingHealth ? 'Pinging Cloud DB...' : 'Run Live Health Check'}
            </button>
          </div>

        </div>

        {/* Live Firestore Collections Summary */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Collections (Live Firestore Counts)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Total Records: {DATASET_TABLES.reduce((acc, t) => acc + getTableRows(t.key).length, 0)}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Hotspots —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('hotspots').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Weather —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('weather_observations').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Historical —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('historical_records').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Tasks —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('tasks').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Evidence —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('evidence').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Verifications —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('verifications').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Interventions —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('interventions').length}</strong>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Learning Outcomes —</span>
              <strong className="font-mono text-white text-sm">{getTableRows('learning_outcomes').length}</strong>
            </div>
          </div>
        </div>

        {/* Engine Transparency Notice */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              All transactions commit atomically with persistent offline caching. Data is restored instantly on page refresh or browser restart.
            </span>
          </div>
          <div className="text-amber-400/90 font-medium shrink-0">
            DEMO / PILOT DATA — ILLUSTRATIVE
          </div>
        </div>
      </div>

      {/* VIEW: DATABASE HUB (9 TABLES) */}
      {activeTab === 'DATABASE' && (
        <div className="space-y-5">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-500" />
                Persistent Database Datasets (9 Tables)
              </h3>
              <p className="text-xs text-slate-500">
                Click <strong className="text-slate-700">[View Records]</strong> on any table card to inspect rows, schema properties, and persistent evidence.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Total Tables: 9
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Total Records: {
                  DATASET_TABLES.reduce((acc, t) => acc + getTableRows(t.key).length, 0)
                }
              </span>
            </div>
          </div>

          {/* 9 Dataset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DATASET_TABLES.map((table) => {
              const rows = getTableRows(table.key);
              const count = rows.length;
              const Icon = table.icon;

              let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
              if (table.sourceTag === 'MODEL OUTPUTS') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
              } else if (table.sourceTag === 'EXTERNAL DATA') {
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
              } else if (table.sourceTag === 'EVIDENCE') {
                badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
              }

              return (
                <div 
                  key={table.key}
                  className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition vg-lift flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
                          <Icon className="w-4 h-4 text-sky-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 tracking-tight">
                            {table.title}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-400">
                            table: <code className="text-sky-600">{table.key}</code>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold font-mono text-slate-900">
                          {count}
                        </span>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Records
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {table.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Source Provenance:</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${badgeColor}`}>
                          {table.sourceTag}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Origin Feed:</span>
                        <span className="text-slate-700 font-medium text-right truncate max-w-[180px]" title={table.primarySource}>
                          {table.primarySource}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Primary Key:</span>
                        <span className="font-mono text-slate-600 font-semibold text-[10px]">
                          {table.primaryKey}
                        </span>
                      </div>
                    </div>

                    {table.key === 'learning_outcomes' && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-normal">
                        <strong>Feedback Notice:</strong> Verified field outcomes are retained as feedback data for future model calibration and retraining.
                      </div>
                    )}

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      DEMO / PILOT DATA — ILLUSTRATIVE
                    </span>

                    <button
                      onClick={() => {
                        setInspectTable(table.key);
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      View Records
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW: FULL PIPELINE & RISK SCORING */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-6">
          
          <div className="vg-panel-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sky-400">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Predictive Decision-Support Formula</h3>
            </div>
            
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
              <code>
                RiskScore = (VisualCondition × 0.40) + (WaterRetentionPrediction × 0.25) + (EnvironmentalScore × 0.20) + (HistoricalRecurrence × 0.15)
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-bold text-sky-400">40% Visual Score</span>
                <p className="text-[11px] text-slate-400 mt-1">Computer vision detection of standing water, surface pooling, and debris obstruction.</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-bold text-indigo-400">25% Retention Prediction</span>
                <p className="text-[11px] text-slate-400 mt-1">Calculated soil permeability, terrain depression slope, and 48h drainage velocity.</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-bold text-emerald-400">20% Environmental Score</span>
                <p className="text-[11px] text-slate-400 mt-1">Dynamic weather factors: 48h cumulative rainfall, ambient temperature, and humidity.</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-bold text-amber-400">15% Historical Recurrence</span>
                <p className="text-[11px] text-slate-400 mt-1">Prior stagnation incidence rate and persistent vector breeding history at this GPS pin.</p>
              </div>
            </div>
          </div>

          {/* 6 Architectural Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Stage 1: Data Ingestion */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Multi-Modal Ingestion</h3>
              </div>
              
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Satellite className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span><strong>Satellite & Earth Obs:</strong> Sentinel-2 multi-spectral NDVI/NDWI indices & Planet 3m optical.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CloudRain className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>Meteorological:</strong> IMD weather radar, 48h rainfall volume, ambient temperature, humidity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Municipal GIS:</strong> Digital Elevation Models (DEM), storm drain network topology, land-use zoning.</span>
                </li>
              </ul>
            </div>

            {/* Stage 2: Tiered Imagery Hierarchy */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Tiered Imagery Hierarchy</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900">Level 1: Govt GIS / Satellite</div>
                  <div className="text-[11px] text-slate-500">Macro-scale citywide coverage (10m–30m resolution)</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-900">Level 2: Street / Municipal Cameras</div>
                  <div className="text-[11px] text-slate-500">Fixed public traffic points & vehicle sweeps</div>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-bold text-purple-950">Level 3: Targeted Drone Micro-Surveys</div>
                  <div className="text-[11px] text-purple-900">Triggered ONLY on top 5% high-risk ambiguous hotspots</div>
                </div>
              </div>
            </div>

            {/* Stage 3: Computer Vision Engine */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Computer Vision Engine</h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>Water Segmentation:</strong> Pixel-level classification of stagnant pools, turbidity, and algae.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Confidence Threshold:</strong> Multi-frame verification scoring to eliminate cloud shadows.</span>
                </li>
              </ul>
            </div>

            {/* Stage 4: Predictive Risk Engine */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Decision Support</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritizes municipal resources by generating a unified 0–100 Breeding Risk Score, categorizing wards into Critical, High, Moderate, or Low urgency.
              </p>
            </div>

            {/* Stage 5: Field Officer Protocol */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  5
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Field Verification Protocol</h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>GPS Anchor:</strong> Live device location validation within 100m geo-fence radius.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span><strong>EXIF Telemetry:</strong> Immutable timestamp and device camera verification for Before/After proof.</span>
                </li>
              </ul>
            </div>

            {/* Stage 6: Feedback Calibration Loop */}
            <div className="bg-card rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  6
                </div>
                <h3 className="font-bold text-slate-900 text-xs">Feedback Calibration</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Verified field outcomes are retained as feedback data for future model calibration and retraining, continuously improving retention forecasts.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* RECORD INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {inspectTable && activeTableMeta && (
        <div className="fixed inset-0 z-50 vg-scrim flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-card rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Table Inspector: <span className="font-mono text-sky-600">{inspectTable}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                      {rawRows.length} records
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                      DEMO / PILOT DATA — ILLUSTRATIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Source: {activeTableMeta.primarySource} • Provenance: <strong className="text-slate-700">{activeTableMeta.sourceTag}</strong>
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-card text-slate-900 shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('json')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === 'json' 
                        ? 'bg-card text-slate-900 shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    JSON
                  </button>
                </div>

                <button
                  onClick={handleExportCsv}
                  title="Export to CSV"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyJson}
                  title="Copy JSON"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {copiedSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setInspectTable(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="p-3 sm:px-6 border-b border-slate-200 flex items-center justify-between gap-3 bg-card">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${inspectTable} by ID, status, ward, coordinates...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                Showing {filteredRows.length} of {rawRows.length} records
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50">
              {viewMode === 'table' ? (
                <div className="rounded-xl border border-slate-200 bg-card overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 font-semibold">
                        {rawRows.length > 0 && Object.keys(rawRows[0]).map((col) => (
                          <th key={col} className="p-3 font-mono text-[11px] whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {filteredRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          {Object.entries(row).map(([k, val]: [string, any], colIdx) => {
                            // If this is an image_reference column in the evidence table, display an interactive thumbnail
                            if (k === 'image_reference' && typeof val === 'string') {
                              const resolvedUrl = evidenceStorageService.getImageUrl(val);
                              return (
                                <td key={colIdx} className="p-3 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={resolvedUrl} 
                                      alt="Evidence preview" 
                                      className="w-8 h-8 rounded-md object-cover border border-slate-300 bg-slate-100"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                    <span className="text-slate-700 truncate max-w-[200px]" title={val}>
                                      {val}
                                    </span>
                                  </div>
                                </td>
                              );
                            }

                            // If this is a status or risk level column, render styled badge
                            if (k === 'status' || k === 'verification_status' || k === 'risk_level') {
                              let badgeStyle = 'bg-slate-100 text-slate-700';
                              if (val === 'CRITICAL' || val === 'HIGH' || val === 'REJECTED') {
                                badgeStyle = 'bg-rose-100 text-rose-800';
                              } else if (val === 'RESOLVED' || val === 'APPROVED') {
                                badgeStyle = 'bg-emerald-100 text-emerald-800';
                              } else if (val === 'IN_PROGRESS' || val === 'ASSIGNED' || val === 'MODERATE') {
                                badgeStyle = 'bg-amber-100 text-amber-800';
                              }
                              return (
                                <td key={colIdx} className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                                    {String(val)}
                                  </span>
                                </td>
                              );
                            }

                            return (
                              <td key={colIdx} className="p-3 text-slate-700 whitespace-nowrap max-w-[280px] truncate" title={typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}>
                                {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '—')}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre className="vg-island p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-auto max-h-[58vh] border border-slate-800 leading-relaxed">
                  {JSON.stringify(filteredRows, null, 2)}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:px-6 border-t border-slate-200 bg-card flex items-center justify-between text-xs text-slate-500">
              <span>Primary Key: <code className="text-sky-600 font-bold">{activeTableMeta.primaryKey}</code></span>
              <button
                onClick={() => setInspectTable(null)}
                className="px-4 py-1.5 rounded-xl vg-btn-primary font-semibold text-xs"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
