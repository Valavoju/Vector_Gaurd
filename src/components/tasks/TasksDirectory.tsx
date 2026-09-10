import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskRecord } from '../../types';

export const TasksDirectory: React.FC = () => {
  const { tasks, setSelectedHotspotId, setDispatchModalHotspotId, hotspots, setActiveView } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const openHotspots = hotspots.filter(h => h.status === 'OPEN');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.task_id.toLowerCase().includes(search.toLowerCase()) ||
      t.hotspot_id.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.assigned_officer.toLowerCase().includes(search.toLowerCase()) ||
      t.assigned_team.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-6 box-border">
      
      {/* 1. Page Header with Clean Hierarchy & Dominant Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Task Dispatch & Operations Control
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage municipal field response teams, track live mitigation interventions, and verify remediation evidence.
          </p>
        </div>

        {openHotspots.length > 0 && (
          <button
            id="dispatch-open-hotspot-btn"
            onClick={() => setDispatchModalHotspotId(openHotspots[0].hotspot_id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Dispatch Next Open Hotspot ({openHotspots[0].hotspot_id})</span>
          </button>
        )}
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by ID, hotspot, officer, ward, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter tasks by status"
          className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Task Statuses ({tasks.length})</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* 3. Task Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 sm:px-4 sm:py-3">Task ID</th>
                <th className="p-3.5 sm:px-4 sm:py-3">Hotspot & Location</th>
                <th className="p-3.5 sm:px-4 sm:py-3">Priority & Action</th>
                <th className="p-3.5 sm:px-4 sm:py-3">Assigned Officer / Team</th>
                <th className="p-3.5 sm:px-4 sm:py-3">Deadline</th>
                <th className="p-3.5 sm:px-4 sm:py-3">Status</th>
                <th className="p-3.5 sm:px-4 sm:py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No tasks match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.task_id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Task ID */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5 font-mono font-bold text-slate-900">
                      {task.task_id}
                    </td>

                    {/* Hotspot & Location */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5">
                      <div className="font-bold text-blue-700">{task.hotspot_id}</div>
                      <div className="text-slate-800 font-medium truncate max-w-[200px]">{task.location}</div>
                      <div className="text-[11px] text-slate-400">{task.ward}</div>
                    </td>

                    {/* Priority & Action */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5 max-w-xs">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        task.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <div className="text-slate-700 text-xs font-medium truncate">{task.recommended_action}</div>
                    </td>

                    {/* Assigned Officer */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5">
                      <div className="font-semibold text-slate-900">{task.assigned_officer}</div>
                      <div className="text-[11px] text-slate-500">{task.assigned_team}</div>
                    </td>

                    {/* Deadline */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5 font-mono text-xs text-slate-600">
                      {task.deadline}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                        task.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'AWAITING_VERIFICATION' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 sm:px-4 sm:py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedHotspotId(task.hotspot_id);
                          setActiveView('RISK_MAP');
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                      >
                        Inspect on Map
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No tasks match the selected criteria.
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.task_id} className="p-4 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{task.task_id}</span>
                      <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-mono">
                        {task.hotspot_id}
                      </span>
                    </div>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold mt-1 uppercase ${
                      task.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    task.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'AWAITING_VERIFICATION' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="font-semibold text-slate-800">{task.location}</div>
                  <div className="text-[11px] text-slate-500">{task.ward}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                  <div className="text-slate-700 font-medium">
                    Action: <span className="text-slate-900">{task.recommended_action}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Officer: <span className="font-semibold text-slate-700">{task.assigned_officer}</span> ({task.assigned_team})
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    Deadline: {task.deadline}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setSelectedHotspotId(task.hotspot_id);
                      setActiveView('RISK_MAP');
                    }}
                    className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition text-center"
                  >
                    Inspect on Map →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
