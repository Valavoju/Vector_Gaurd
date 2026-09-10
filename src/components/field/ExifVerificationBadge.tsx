import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Compass, 
  Camera, 
  Satellite, 
  Layers, 
  Check, 
  Info, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Hash
} from 'lucide-react';
import { ExifGeoMetadata } from '../../types';

interface ExifVerificationBadgeProps {
  metadata?: ExifGeoMetadata;
  targetSiteLat: number;
  targetSiteLng: number;
  taskLocationName: string;
  onSimulateMismatch?: () => void;
  onRecalibrateLock?: () => void;
  isWatermarked?: boolean;
}

export const ExifVerificationBadge: React.FC<ExifVerificationBadgeProps> = ({
  metadata,
  targetSiteLat,
  targetSiteLng,
  taskLocationName,
  onSimulateMismatch,
  onRecalibrateLock,
  isWatermarked = true
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  if (!metadata) {
    return (
      <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-slate-500" />
          <span>Processing EXIF metadata & GPS verification...</span>
        </div>
      </div>
    );
  }

  const isMatched = metadata.isGeoMatched;

  return (
    <div className={`rounded-lg border transition-all text-xs font-mono ${
      isMatched 
        ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-200' 
        : 'bg-amber-950/30 border-amber-800/60 text-slate-200'
    }`}>
      {/* Header Status Bar */}
      <div className="p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isMatched ? (
            <div className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md bg-amber-950 text-amber-400 border border-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white text-xs">
                {isMatched ? 'EXIF GEO-VALIDATED' : 'GPS PROXIMITY WARNING'}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                isMatched ? 'bg-emerald-900/80 text-emerald-200' : 'bg-amber-900/80 text-amber-200'
              }`}>
                OFFSET: {metadata.distanceOffsetMeters}m (TOLERANCE: {metadata.geoToleranceMeters}m)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              LAT: {metadata.extractedLat.toFixed(5)}° N, LNG: {metadata.extractedLng.toFixed(5)}° E
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded EXIF Details */}
      {isDetailsOpen && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-800/80 space-y-1.5 text-[10px] text-slate-300">
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded border border-slate-800/80">
            <div>
              <span className="text-slate-500">Camera:</span> {metadata.cameraMakeModel || 'Sony IMX890 GNSS'}
            </div>
            <div>
              <span className="text-slate-500">Audit Code:</span> {metadata.verificationAuditCode || 'VG-EXIF-9921'}
            </div>
            <div>
              <span className="text-slate-500">Capture Time:</span> {new Date(metadata.captureTimestamp).toLocaleTimeString()}
            </div>
            <div>
              <span className="text-slate-500">Watermark:</span> {metadata.watermarkApplied ? 'Burned' : 'Pending'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
