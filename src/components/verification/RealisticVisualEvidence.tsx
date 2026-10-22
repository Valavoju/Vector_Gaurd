import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Maximize2, 
  X, 
  Layers, 
  Smartphone, 
  UserCheck, 
  Building2,
  Calendar,
  Eye,
  Sparkles
} from 'lucide-react';
import { DEMO_EVIDENCE_IMAGES, AdditionalAngleEvidence } from '../../data/evidenceImages';
import { HotspotRecord, TaskRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { DownloadReportButton } from '../common/DownloadReportButton';

interface RealisticVisualEvidenceProps {
  hotspot?: HotspotRecord | null;
  task?: TaskRecord | null;
  showAdditionalAngles?: boolean;
  showMetadataCards?: boolean;
  compact?: boolean;
  /** Hide when the surrounding view already offers the report download. */
  showReportButton?: boolean;
}

export const RealisticVisualEvidence: React.FC<RealisticVisualEvidenceProps> = ({
  hotspot,
  task,
  showAdditionalAngles = true,
  showMetadataCards = true,
  compact = false,
  showReportButton = true,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<AdditionalAngleEvidence | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string; subtitle: string; tags?: string[] } | null>(null);
  const { hotspots } = useApp();

  // Defaults aligned with Hero Hotspot VG-1042
  const hotspotId = hotspot?.hotspot_id || task?.hotspot_id || 'VG-1042';
  const targetHotspot = hotspot || hotspots.find(h => h.hotspot_id === hotspotId) || hotspots[0];
  const wardName = hotspot?.ward || task?.ward || 'Ward 12 (Banjara Hills / Jubilee Hills)';
  const cityName = hotspot?.city || 'Hyderabad';
  const stateName = hotspot?.state || 'Telangana';
  const localityName = hotspot?.locality || 'Banjara Hills';
  const coordinates = '17.4156° N, 78.4489° E';
  const locationAddress = hotspot?.location || task?.location || 'Plot 48, Road No. 12, Banjara Hills (Near NBT Nagar)';

  const beforeImageUrl = task?.before_evidence_url || hotspot?.before_image_url || DEMO_EVIDENCE_IMAGES.vg1042_before;
  const afterImageUrl = task?.after_evidence_url || hotspot?.after_image_url || DEMO_EVIDENCE_IMAGES.vg1042_after;

  const officerName = task?.assigned_officer || 'Rajesh Kumar';
  const officerTeam = task?.assigned_team || 'Rapid Intervention Team 3';

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Visual Evidence with Embedded EXIF GPS Watermark</span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                {hotspotId}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Photographic field verification with cryptographically anchored GNSS metadata
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showReportButton && targetHotspot && (
            <DownloadReportButton
              hotspot={targetHotspot}
              task={task}
              variant="primary"
              buttonId={`evidence-download-report-btn-${hotspotId}`}
            />
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium ml-1">
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Officer Photo Proof
            </span>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE BEFORE / AFTER EVIDENCE COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* ================= BEFORE INTERVENTION CARD ================= */}
        <div className="bg-card rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          
          {/* Card Title Bar */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              <span>BEFORE INTERVENTION</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500 font-mono text-[11px]">Surveillance Imagery</span>
            </div>
            
            <span className="bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              STAGNANT WATER DETECTED
            </span>
          </div>

          {/* Photographic Viewport with Embedded Watermark */}
          <div 
            className="vg-island relative bg-slate-950 aspect-4/3 w-full overflow-hidden group cursor-pointer"
            onClick={() => setActivePhotoModal({
              url: beforeImageUrl,
              title: `Before Intervention — ${hotspotId}`,
              subtitle: `Surveillance capture: Stagnant water pooling in excavation pit (Visual Score: 74%)`,
              tags: ['Stagnant Water', 'Construction Pit', 'Debris', 'Poor Drainage']
            })}
          >
            <img 
              src={beforeImageUrl} 
              alt="Before Intervention Evidence" 
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />

            {/* Expand button on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white p-1.5 rounded-lg backdrop-blur-xs">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* EMBEDDED TRANSLUCENT EXIF GPS WATERMARK OVERLAY */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3 pt-6 text-white pointer-events-none">
              <div className="flex items-end justify-between gap-2">
                
                {/* Left: Mini Map Thumbnail with Red Pin */}
                <div className="relative w-14 h-14 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0 shadow-lg flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:6px_6px] opacity-70"></div>
                  {/* Road grid lines */}
                  <div className="absolute inset-0 border-r border-slate-700/50 transform rotate-12"></div>
                  <div className="absolute inset-0 border-b border-slate-700/50 transform -rotate-6"></div>
                  {/* Center red pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white shadow-md"></span>
                    <span className="text-[7px] font-mono font-bold text-white mt-0.5 bg-slate-950/80 px-1 rounded">MAP</span>
                  </div>
                </div>

                {/* Center: EXIF Geotag Metadata */}
                <div className="flex-1 font-mono text-[10px] leading-tight space-y-0.5 text-slate-200">
                  <div className="font-bold text-white text-[11px] truncate">
                    {hotspotId} | {wardName.split('/')[0]}
                  </div>
                  <div className="text-slate-300 truncate">
                    {cityName}, {stateName}
                  </div>
                  <div className="text-amber-300 font-semibold">
                    {coordinates}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[9px]">
                    <span>2026-09-08 06:45 IST</span>
                    <span>•</span>
                    <span>Altitude: 542 m</span>
                  </div>
                </div>

                {/* Right: Compass & VectorGuard AI Brand */}
                <div className="flex flex-col items-end shrink-0 text-right space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-200 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/50">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>▲ N</span>
                  </div>
                  <div className="text-[9px] font-bold text-indigo-300 tracking-wider">
                    VectorGuard AI
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 uppercase">
                    Drone Survey
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Detected Condition Box */}
          <div className="p-3.5 bg-rose-50/50 border-t border-rose-100 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs text-rose-950 font-semibold flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Detected Condition:</strong> Stagnant water pooling in excavation pit with debris
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                Visual Score: 74%
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-200/60">
                Stagnant Water
              </span>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-200/60">
                Construction Pit
              </span>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-200/60">
                Debris
              </span>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-200/60">
                Poor Drainage
              </span>
            </div>
          </div>

        </div>

        {/* ================= AFTER INTERVENTION CARD ================= */}
        <div className="bg-card rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          
          {/* Card Title Bar */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>AFTER INTERVENTION</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500 font-mono text-[11px]">Field Verification Imagery</span>
            </div>
            
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              NO WATER RETENTION
            </span>
          </div>

          {/* Photographic Viewport with Embedded Watermark */}
          <div 
            className="vg-island relative bg-slate-950 aspect-4/3 w-full overflow-hidden group cursor-pointer"
            onClick={() => setActivePhotoModal({
              url: afterImageUrl,
              title: `After Intervention — ${hotspotId}`,
              subtitle: `Verified condition: Standing water evacuated; pit cleared and treated with larvicide barrier (Visual Score: 98%)`,
              tags: ['Water Removed', 'Pit Cleaned', 'Larvicide Treatment', 'Verified by Officer']
            })}
          >
            <img 
              src={afterImageUrl} 
              alt="After Intervention Evidence" 
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />

            {/* Expand button on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white p-1.5 rounded-lg backdrop-blur-xs">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* EMBEDDED TRANSLUCENT EXIF GPS WATERMARK OVERLAY */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3 pt-6 text-white pointer-events-none">
              <div className="flex items-end justify-between gap-2">
                
                {/* Left: Mini Map Thumbnail with Red Pin */}
                <div className="relative w-14 h-14 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0 shadow-lg flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:6px_6px] opacity-70"></div>
                  {/* Road grid lines */}
                  <div className="absolute inset-0 border-r border-slate-700/50 transform rotate-12"></div>
                  <div className="absolute inset-0 border-b border-slate-700/50 transform -rotate-6"></div>
                  {/* Center red pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white shadow-md"></span>
                    <span className="text-[7px] font-mono font-bold text-white mt-0.5 bg-slate-950/80 px-1 rounded">MAP</span>
                  </div>
                </div>

                {/* Center: EXIF Geotag Metadata */}
                <div className="flex-1 font-mono text-[10px] leading-tight space-y-0.5 text-slate-200">
                  <div className="font-bold text-white text-[11px] truncate">
                    {hotspotId} | {wardName.split('/')[0]}
                  </div>
                  <div className="text-slate-300 truncate">
                    {cityName}, {stateName}
                  </div>
                  <div className="text-emerald-300 font-semibold">
                    {coordinates}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[9px]">
                    <span>2026-09-12 15:20 IST</span>
                    <span>•</span>
                    <span>Altitude: 543 m</span>
                  </div>
                </div>

                {/* Right: Compass & VectorGuard AI Brand */}
                <div className="flex flex-col items-end shrink-0 text-right space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-200 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/50">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>▲ N</span>
                  </div>
                  <div className="text-[9px] font-bold text-indigo-300 tracking-wider">
                    VectorGuard AI
                  </div>
                  <div className="text-[8px] font-mono text-emerald-300 uppercase">
                    Field Verification
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Verified Condition Box */}
          <div className="p-3.5 bg-emerald-50/50 border-t border-emerald-100 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs text-emerald-950 font-semibold flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Verified Condition:</strong> Standing water evacuated; pit cleared and treated with larvicide barrier
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                Visual Score: 98%
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-200/60">
                Water Removed
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-200/60">
                Pit Cleaned
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-200/60">
                Larvicide Treatment
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-200/60">
                Verified by Officer
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= ADDITIONAL EVIDENCE (MULTIPLE ANGLES) ================= */}
      {showAdditionalAngles && (
        <div className="bg-card rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Additional Evidence (Multiple Angles)
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              5 multi-perspective audit angles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DEMO_EVIDENCE_IMAGES.additional_angles.map((angle, idx) => (
              <div 
                key={angle.id}
                onClick={() => setSelectedAngle(angle)}
                className="vg-island group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col"
              >
                {/* Photo */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img 
                    src={angle.imageUrl} 
                    alt={angle.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      angle.category === 'BEFORE' ? 'bg-rose-600 text-white' :
                      angle.category === 'AFTER' ? 'bg-emerald-600 text-white' :
                      angle.category === 'TREATMENT' ? 'bg-indigo-600 text-white' :
                      'bg-slate-800 text-slate-200'
                    }`}>
                      {angle.category}
                    </span>
                  </div>

                  {/* Watermark bar on photo bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[8px] font-mono text-slate-300 truncate">
                    {angle.coordinates}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2 bg-card flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-[11px] text-slate-900 truncate">
                      {angle.title}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                      {angle.caption}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1.5 pt-1 border-t border-slate-100">
                    {angle.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= BOTTOM 3 METADATA CARDS ================= */}
      {showMetadataCards && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Location Details */}
          <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Location Details
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Hotspot ID:</span>
                <span className="font-extrabold text-slate-900 font-mono">{hotspotId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Ward:</span>
                <span className="font-semibold text-slate-900 text-right">{wardName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">City / State:</span>
                <span className="font-semibold text-slate-900">{cityName}, {stateName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Coordinates:</span>
                <span className="font-mono text-indigo-700 font-semibold">{coordinates}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-600">
                <span className="font-medium text-slate-500">Address: </span>
                <span>{locationAddress}</span>
              </div>
            </div>
          </div>

          {/* 2. Timeline */}
          <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Timeline
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              {/* Event 1 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0 ring-2 ring-rose-100"></span>
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">08 Sep 2026, 06:45</div>
                  <div className="text-[11px] text-slate-500">Drone survey – stagnant water detected</div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0 ring-2 ring-indigo-100"></span>
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">09 Sep 2026, 10:30</div>
                  <div className="text-[11px] text-slate-500">Task assigned to {officerTeam}</div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 ring-2 ring-blue-100"></span>
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">12 Sep 2026, 14:10</div>
                  <div className="text-[11px] text-slate-500">Field intervention completed</div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 ring-2 ring-emerald-100"></span>
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">12 Sep 2026, 15:20</div>
                  <div className="text-[11px] text-slate-500">Post-intervention verification (No water retention)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Officer Verification */}
          <div className="bg-card rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Officer Verification
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Field Officer:</span>
                <span className="font-bold text-slate-900">{officerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Team:</span>
                <span className="font-semibold text-slate-800">{officerTeam}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Verification Status:</span>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  Resolved
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Submitted On:</span>
                <span className="font-mono text-slate-700 text-[11px]">12 Sep 2026, 15:25 IST</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Photo Source:</span>
                <span className="font-mono text-slate-700 text-[11px]">Mobile (EXIF Verified)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Device:</span>
                <span className="font-mono text-slate-700 text-[11px]">iPhone 15</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">GPS Verified:</span>
                <span className="font-bold text-emerald-700 font-mono">✓ Yes (Within 2.1m)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= MODAL LIGHTBOX FOR MULTI-ANGLE ZOOM ================= */}
      {selectedAngle && (
        <div 
          className="fixed inset-0 z-50 vg-scrim flex items-center justify-center p-4"
          onClick={() => setSelectedAngle(null)}
        >
          <div 
            className="vg-island bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  selectedAngle.category === 'BEFORE' ? 'bg-rose-600 text-white' :
                  selectedAngle.category === 'AFTER' ? 'bg-emerald-600 text-white' :
                  selectedAngle.category === 'TREATMENT' ? 'bg-indigo-600 text-white' :
                  'bg-slate-800 text-slate-200'
                }`}>
                  {selectedAngle.category}
                </span>
                <h3 className="font-bold text-sm text-white">{selectedAngle.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedAngle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-16/10 bg-slate-950">
              <img 
                src={selectedAngle.imageUrl} 
                alt={selectedAngle.title} 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 space-y-2 bg-slate-900/90 border-t border-slate-800 text-xs">
              <p className="text-slate-200">{selectedAngle.caption}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>GNSS: {selectedAngle.coordinates}</span>
                <span>Captured: {selectedAngle.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL LIGHTBOX FOR BEFORE/AFTER ZOOM ================= */}
      {activePhotoModal && (
        <div 
          className="fixed inset-0 z-50 vg-scrim flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div 
            className="vg-island bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{activePhotoModal.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activePhotoModal.subtitle}</p>
              </div>
              <button 
                onClick={() => setActivePhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-16/10 bg-slate-950">
              <img 
                src={activePhotoModal.url} 
                alt={activePhotoModal.title} 
                className="w-full h-full object-contain"
              />
            </div>

            {activePhotoModal.tags && (
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-2">
                {activePhotoModal.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
