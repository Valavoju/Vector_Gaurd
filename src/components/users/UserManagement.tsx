import React from 'react';
import { Users, Shield, Smartphone, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const UserManagement: React.FC = () => {
  const { switchUserRole, currentUser } = useApp();

  const usersList = [
    {
      id: 'usr_admin_1',
      name: 'Control Room Admin',
      email: 'admin@vectorguard.ai',
      role: 'ADMIN' as UserRole,
      title: 'Municipal Surveillance Supervisor',
      zone: 'National Demonstration Command (India Pilot)',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_field_1',
      name: 'Field Officer (Team 3)',
      email: 'field.team3@vectorguard.ai',
      role: 'FIELD_OFFICER' as UserRole,
      title: 'Rapid Intervention Squad Lead',
      zone: 'Rapid Intervention Team 3 (Sector 12–14)',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_field_2',
      name: 'Field Officer (Team 1)',
      email: 'field.team1@vectorguard.ai',
      role: 'FIELD_OFFICER' as UserRole,
      title: 'Field Operations Specialist',
      zone: 'Rapid Intervention Team 1 (Sector 10–11)',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center ring-1 ring-blue-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Personnel & Operational Roles</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-based access control for surveillance supervisors and rapid intervention field teams
            </p>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usersList.map(user => {
          const isCurrent = currentUser.email === user.email;

          return (
            <div 
              key={user.id}
              className={`bg-white rounded-2xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                isCurrent ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                    {isCurrent && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ACTIVE SESSION
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{user.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{user.zone}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {user.email}
                </span>

                <button
                  onClick={() => switchUserRole(user.role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isCurrent 
                      ? 'bg-slate-100 text-slate-400 cursor-default' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {isCurrent ? 'Current View' : 'Switch to Persona'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
