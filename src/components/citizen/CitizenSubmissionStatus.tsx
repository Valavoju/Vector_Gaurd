import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  PlusCircle, 
  ArrowRight,
  Eye,
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';
import { CitizenEvidenceSubmission } from '../../types';
import { useApp } from '../../context/AppContext';

interface CitizenSubmissionStatusProps {
  latestSubmission: CitizenEvidenceSubmission | null;
  onSubmitNew: () => void;
}

export const CitizenSubmissionStatus: React.FC<CitizenSubmissionStatusProps> = ({ 
  latestSubmission,
  onSubmitNew 
}) => {
  const { citizenSubmissions, registeredCitizen, switchUserRole, setActiveView } = useApp();

  const allSubmissions = citizenSubmissions;
  const activeItem = latestSubmission || allSubmissions[0];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      
      {/* Top Banner */}
      {latestSubmission && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-extrabold text-emerald-950">
              Evidence Submission Received ({latestSubmission.submissionId})
            </div>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              Your environmental evidence has been recorded with verified citizen consent and queued for human audit by the Municipal Health Control Room.
            </p>
          </div>
        </div>
      )}

      {/* Main Submission Details Card */}
      {activeItem && (
        <div className="bg-card rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base text-slate-900">{activeItem.submissionId}</span>
                <span className="bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded text-xs">
                  {activeItem.evidenceType}
                </span>
                {activeItem.status === 'PENDING_HUMAN_VERIFICATION' && (
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    PENDING HUMAN VERIFICATION
                  </span>
                )}
                {activeItem.status === 'APPROVED_SUPPORTING' && (
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    APPROVED SUPPORTING EVIDENCE
                  </span>
                )}
                {activeItem.status === 'REJECTED' && (
                  <span className="bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    CLARIFICATION REQUESTED
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Submitted: {new Date(activeItem.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </div>
            </div>

            {/* Evidence Source Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right shrink-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence Source</div>
              <div className="text-xs font-extrabold text-slate-800">Registered Citizen</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Consent: Recorded</span>
              </div>
            </div>
          </div>

          {/* Masked PII Privacy Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Masked Citizen Audit Profile (Privacy Protected):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-card p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold">CITIZEN IDENTITY</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{activeItem.citizenNameMasked}</div>
              </div>
              <div className="bg-card p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold">MOBILE (MASKED)</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{activeItem.citizenMobileMasked}</div>
              </div>
              <div className="bg-card p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold">EMAIL (MASKED)</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5 truncate">
                  {activeItem.citizenEmailMasked || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Photo and Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            
            {/* Visual Evidence Photo */}
            <div className="sm:col-span-6 space-y-1.5">
              <div className="text-xs font-bold text-slate-800">Visual Evidence Photo:</div>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-52 relative">
                <img 
                  src={activeItem.imageUrl} 
                  alt="Submitted evidence" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="vg-island absolute top-2 left-2 bg-slate-950/80 text-white font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur-xs">
                  {activeItem.evidenceType}
                </span>
              </div>
            </div>

            {/* Location & Observation Narrative */}
            <div className="sm:col-span-6 space-y-4">
              
              {/* Location Card */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Observation Location:</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-start gap-1.5 font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>{activeItem.localArea}</span>
                  </div>
                  <div className="text-slate-600 pl-5">
                    {activeItem.city}, {activeItem.state}
                  </div>
                  {activeItem.gpsCoordinates && (
                    <div className="text-[11px] font-mono text-slate-500 pl-5">
                      GPS: {activeItem.gpsCoordinates}
                    </div>
                  )}
                  {activeItem.linkedHotspotId && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/80 text-[11px] text-indigo-700 font-bold flex items-center gap-1 pl-5">
                      <span>Linked Hotspot Reference:</span>
                      <span className="bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded font-mono">
                        {activeItem.linkedHotspotId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Citizen Description:</div>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                  "{activeItem.description}"
                </p>
              </div>

              {/* Administrative Review Result if reviewed */}
              {activeItem.adminNotes && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Municipal Review Remarks:</span>
                  </div>
                  <p className="text-slate-700 text-[11px]">
                    "{activeItem.adminNotes}"
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Audited by: {activeItem.reviewedBy || 'Control Room Admin'}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <button
              type="button"
              onClick={onSubmitNew}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Another Observation</span>
            </button>

            {/* Switch to Admin Role to Verify Quick Action */}
            <button
              id="switch-admin-audit-evidence-btn"
              type="button"
              onClick={() => {
                switchUserRole('ADMIN');
                setActiveView('VERIFICATION');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
            >
              <Building2 className="w-4 h-4" />
              <span>Switch to Admin: Audit in Verification Center →</span>
            </button>

          </div>

        </div>
      )}

      {/* History of Previous Submissions */}
      {allSubmissions.length > 1 && (
        <div className="bg-card rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
          <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            All Submissions in Current Demo Session ({allSubmissions.length})
          </div>

          <div className="space-y-2.5">
            {allSubmissions.map(item => (
              <div 
                key={item.submissionId}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-200">
                    <img 
                      src={item.imageUrl} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{item.submissionId}</span>
                      <span className="text-slate-400 font-normal">•</span>
                      <span className="text-violet-700 font-bold">{item.evidenceType}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {item.localArea}, {item.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {item.status === 'PENDING_HUMAN_VERIFICATION' && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PENDING AUDIT
                    </span>
                  )}
                  {item.status === 'APPROVED_SUPPORTING' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      APPROVED ✓
                    </span>
                  )}
                  {item.status === 'REJECTED' && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      REJECTED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
