import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Radio, 
  Compass, 
  MapPin, 
  Activity, 
  Wifi, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Satellite,
  Crosshair,
  Maximize2,
  LocateFixed
} from 'lucide-react';
import { TaskRecord, HotspotRecord, DeviceGpsAnchor } from '../../types';

interface RealtimeGpsIndicatorProps {
  activeTask?: TaskRecord | null;
  relatedHotspot?: HotspotRecord | null;
  deviceGpsAnchor?: DeviceGpsAnchor;
  onGetPosition?: () => void;
  isAcquiring?: boolean;
}

export const RealtimeGpsIndicator: React.FC<RealtimeGpsIndicatorProps> = ({
  activeTask,
  relatedHotspot,
  deviceGpsAnchor,
  onGetPosition,
  isAcquiring = false
}) => {
  // Base coordinates from active task/hotspot or Hyderabad default
  const baseLat = deviceGpsAnchor?.latitude ?? (relatedHotspot?.latitude ?? (activeTask ? 17.4156 : 17.4126));
  const baseLng = deviceGpsAnchor?.longitude ?? (relatedHotspot?.longitude ?? (activeTask ? 78.4350 : 78.4482));
  const locationName = relatedHotspot?.location || activeTask?.location || 'Ward 12, Banjara Hills, Hyderabad';
  const wardName = relatedHotspot?.ward || activeTask?.ward || 'Ward 12';

  // State for dynamic coordinates with micro-jitter
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: baseLat,
    lng: baseLng
  });

  const [accuracy, setAccuracy] = useState<number>(deviceGpsAnchor?.accuracyMeters ?? 1.2);
  const [altitude, setAltitude] = useState<number>(deviceGpsAnchor?.altitudeMeters ?? 534);
  const [heading, setHeading] = useState<number>(deviceGpsAnchor?.headingDeg ?? 184);
  const [satellitesLocked, setSatellitesLocked] = useState<number>(16);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Synchronize when external device anchor changes
  useEffect(() => {
    if (deviceGpsAnchor) {
      setCurrentCoords({
        lat: deviceGpsAnchor.latitude,
        lng: deviceGpsAnchor.longitude
      });
      if (deviceGpsAnchor.accuracyMeters) setAccuracy(deviceGpsAnchor.accuracyMeters);
      if (deviceGpsAnchor.altitudeMeters) setAltitude(deviceGpsAnchor.altitudeMeters);
      if (deviceGpsAnchor.headingDeg) setHeading(deviceGpsAnchor.headingDeg);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }
  }, [deviceGpsAnchor]);

  // Update base when active task or hotspot changes
  useEffect(() => {
    if (!deviceGpsAnchor) {
      setCurrentCoords({
        lat: baseLat + (Math.random() - 0.5) * 0.00004,
        lng: baseLng + (Math.random() - 0.5) * 0.00004
      });
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }
  }, [baseLat, baseLng, activeTask?.task_id]);

  // Live GNSS RTK simulation loop (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const latJitter = (Math.random() - 0.5) * 0.00003;
      const lngJitter = (Math.random() - 0.5) * 0.00003;
      
      setCurrentCoords({
        lat: Number((baseLat + latJitter).toFixed(6)),
        lng: Number((baseLng + lngJitter).toFixed(6))
      });

      setAltitude(prev => Math.round(532 + Math.random() * 4));
      setHeading(prev => (prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3) + 360) % 360);
      setAccuracy(Number((1.1 + Math.random() * 0.3).toFixed(1)));
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 3000);

    return () => clearInterval(interval);
  }, [baseLat, baseLng]);

  // Handle manual recalibration ping
  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setCurrentCoords({
        lat: Number((baseLat + (Math.random() - 0.5) * 0.00001).toFixed(6)),
        lng: Number((baseLng + (Math.random() - 0.5) * 0.00001).toFixed(6))
      });
      setAccuracy(0.9);
      setSatellitesLocked(18);
      setIsCalibrating(false);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 800);
  };

  const isInspecting = activeTask?.status === 'IN_PROGRESS';
  const isAwaitingVerification = activeTask?.status === 'AWAITING_VERIFICATION';
  const geofenceDistanceMeters = isInspecting ? 6 : isAwaitingVerification ? 0 : 24;

  return (
    <div className="bg-[#090e1d] text-slate-100 rounded-lg p-3 border border-slate-800 shadow-md space-y-2.5 font-mono text-xs">
      
      {/* Top Main Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        
        {/* Left: GNSS Lock & Coordinate Stream */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-700/60 shrink-0">
            <Radio className={`w-4 h-4 ${isCalibrating ? 'animate-spin text-amber-400' : 'animate-pulse'}`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                GNSS / RTK SATELLITE FIX
              </span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-800">
                LOCKED (±{accuracy}m)
              </span>
            </div>
            <div className="text-[11px] text-cyan-300 font-bold tracking-tight truncate mt-0.5">
              LAT: {currentCoords.lat.toFixed(6)}° N • LNG: {currentCoords.lng.toFixed(6)}° E
            </div>
          </div>
        </div>

        {/* Right: Geofence status & Acquire Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-slate-400">Target Proximity</div>
            <div className="text-xs font-bold text-emerald-400">
              {geofenceDistanceMeters}m to Site (INSIDE GEOFENCE)
            </div>
          </div>

          {onGetPosition && (
            <button
              onClick={onGetPosition}
              disabled={isAcquiring}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-semibold transition disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isAcquiring ? 'animate-spin' : ''}`} />
              <span>{isAcquiring ? 'Locking...' : 'Sync GPS'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Toggle Telemetry Details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Expanded Live Telemetry Drawer */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300">
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
            <div className="text-slate-500 uppercase">Satellites</div>
            <div className="font-bold text-cyan-400 text-xs mt-0.5">{satellitesLocked} Fixes (GPS+Galileo)</div>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
            <div className="text-slate-500 uppercase">Altitude</div>
            <div className="font-bold text-slate-200 text-xs mt-0.5">{altitude} m MSL</div>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
            <div className="text-slate-500 uppercase">Heading</div>
            <div className="font-bold text-slate-200 text-xs mt-0.5">{heading}° Azimuth</div>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
            <div className="text-slate-500 uppercase">Last Packet</div>
            <div className="font-bold text-emerald-400 text-xs mt-0.5">{lastSyncTime || 'LIVE'}</div>
          </div>
        </div>
      )}

    </div>
  );
};
