import React, { useCallback, useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export const TaskDispatchModal: React.FC = () => {
  const { 
    dispatchModalHotspotId, 
    setDispatchModalHotspotId, 
    hotspots, 
    dispatchTask 
  } = useApp();

  const hotspot = hotspots.find(h => h.hotspot_id === dispatchModalHotspotId);

  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Critical');
  const [assignedTeam, setAssignedTeam] = useState<string>('Rapid Intervention Team 3');
  const [assignedOfficer, setAssignedOfficer] = useState<string>('Rajesh Kumar (Team 3)');
  const [deadline, setDeadline] = useState<string>('Within 4 Hours (Priority Rapid Action)');
  const [recommendedAction, setRecommendedAction] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (hotspot) {
      setPriority(hotspot.risk_level === 'CRITICAL' ? 'Critical' : hotspot.risk_level === 'HIGH' ? 'High' : 'Medium');
      setRecommendedAction(hotspot.recommended_action);
      setNotes(`High risk water retention predicted (${hotspot.breeding_risk_score}/100) at ${hotspot.site_type}. Perform visual dewatering, clear debris, and apply anti-larval barrier.`);
    }
  }, [hotspot]);

  const closeModal = useCallback(() => setDispatchModalHotspotId(null), [setDispatchModalHotspotId]);
  useEscapeKey(!!dispatchModalHotspotId, closeModal);

  if (!dispatchModalHotspotId || !hotspot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchTask({
      hotspotId: hotspot.hotspot_id,
      priority,
      assignedTeam,
      assignedOfficer,
      deadline,
      recommendedAction,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto vg-scrim flex items-center justify-center p-3 sm:p-4" onClick={closeModal}>
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-surface animate-pop-in w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="vg-hero !rounded-none !shadow-none p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dispatch Preventive Field Task</h3>
              <p className="text-xs text-slate-400">
                Deploy rapid municipal response team for targeted environmental mitigation
              </p>
            </div>
          </div>

          <button
            id="close-dispatch-modal-btn"
            onClick={() => setDispatchModalHotspotId(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Hotspot Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">{hotspot.hotspot_id}</span>
                <RiskBadge level={hotspot.risk_level} suffix={`Score ${hotspot.breeding_risk_score}`} />
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">{hotspot.location} • {hotspot.ward}</div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              {hotspot.rainfall}mm rain • {hotspot.drainage_condition}
            </div>
          </div>

          {/* Priority & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Intervention Priority *</label>
              <select
                id="dispatch-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Critical">🔴 Critical (Immediate Action)</option>
                <option value="High">🟠 High Priority (Within 6h)</option>
                <option value="Medium">🟡 Medium Priority (Within 24h)</option>
                <option value="Low">🟢 Low / Routine Monitoring</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Deadline *</label>
              <select
                id="dispatch-deadline-select"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Within 4 Hours (Priority Rapid Action)">Within 4 Hours (Priority Rapid Action)</option>
                <option value="Today before 18:00 IST">Today before 18:00 IST</option>
                <option value="Within 24 Hours">Within 24 Hours</option>
                <option value="Next Scheduled Sweep Cycle">Next Scheduled Sweep Cycle</option>
              </select>
            </div>
          </div>

          {/* Assigned Team & Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Assigned Operational Team *</label>
              <select
                id="dispatch-team-select"
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Rapid Intervention Team 3">Rapid Intervention Team 3 (Ward 12-14)</option>
                <option value="Rapid Intervention Team 1">Rapid Intervention Team 1 (Ward 10-11)</option>
                <option value="Sanitation & Desilting Squad B">Sanitation & Desilting Squad B (Ward 15-18)</option>
                <option value="Vector Bio-Control Unit 4">Vector Bio-Control Unit 4 (Central)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Assigned Field Officer *</label>
              <select
                id="dispatch-officer-select"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Rajesh Kumar (Team 3)">Rajesh Kumar (Team 3 Officer - Demo Hero)</option>
                <option value="K. Suresh Varma (Team 1)">K. Suresh Varma (Team 1 Officer)</option>
                <option value="Mohammed Tariq (Squad B)">Mohammed Tariq (Squad B Supervisor)</option>
                <option value="P. Shailaja (Unit 4)">P. Shailaja (Biologist Inspector)</option>
              </select>
            </div>
          </div>

          {/* Recommended Action */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Mandatory Preventive Actions *</label>
            <input
              id="dispatch-action-input"
              type="text"
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              placeholder="e.g. Remove standing water + clear debris"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Admin Dispatch Instructions / Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Officer Briefing & Field Notes</label>
            <textarea
              id="dispatch-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific instructions for the field team..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Notification will be dispatched to Officer Rajesh Kumar's mobile app instantly.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDispatchModalHotspotId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-card border border-slate-300 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                id="create-task-submit-btn"
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>CREATE TASK & DISPATCH</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
