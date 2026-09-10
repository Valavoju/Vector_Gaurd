import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Layers, 
  ClipboardList, 
  CheckSquare, 
  BarChart3, 
  Cpu, 
  Coins, 
  Users, 
  ShieldAlert,
  Smartphone,
  History,
  Activity,
  Globe2,
  Settings,
  Leaf,
  User,
  UploadCloud,
  Lock,
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCheck,
  Award,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    tasks, 
    hotspots,
    registeredCitizen,
    citizenSubmissions,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const awaitingVerificationCount = tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length;
  const criticalHotspotCount = hotspots.filter(h => h.risk_level === 'CRITICAL' && h.status !== 'RESOLVED').length;
  const myAssignedTasksCount = tasks.filter(t => t.assigned_officer_id === currentUser.id && t.status !== 'RESOLVED').length;

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setIsMobileNavOpen?.(false);
  };

  // Citizen Sidebar Content
  const renderCitizenContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#080e1a] text-slate-200">
      <div className="p-3 space-y-4">
        {/* Citizen Persona Header */}
        <div className="bg-purple-950/30 rounded-lg p-2.5 border border-purple-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-purple-900 text-purple-300 flex items-center justify-center font-bold text-xs">
              CZ
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {registeredCitizen ? registeredCitizen.fullName : 'Citizen Sentinel'}
              </div>
              <div className="text-[10px] text-purple-300 font-mono truncate">
                {registeredCitizen ? `${registeredCitizen.city}, ${registeredCitizen.state}` : 'Supporting Evidence'}
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Navigation Links */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 font-mono">
            CITIZEN PORTAL
          </div>

          <button
            id="citizen-nav-submit"
            onClick={() => handleNavClick('CITIZEN_PORTAL')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
              activeView === 'CITIZEN_PORTAL' || activeView === 'CITIZEN_SUBMIT'
                ? 'bg-purple-950 text-purple-200 border border-purple-700/60 font-semibold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>Evidence Portal</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-500 bg-slate-950 font-mono">
        Supporting Evidence Network
      </div>
    </div>
  );

  // Field Officer Sidebar Content
  const renderFieldOfficerContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#080e1a] text-slate-200">
      <div className="p-3 space-y-4">
        {/* Officer Persona Header */}
        <div className="bg-emerald-950/30 rounded-lg p-2.5 border border-emerald-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-xs">
              FO
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-300 font-mono truncate">{currentUser.team}</div>
            </div>
          </div>
        </div>

        {/* Field Operations Navigation */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 font-mono">
            FIELD OPERATIONS
          </div>

          <button
            id="field-nav-my-tasks"
            onClick={() => handleNavClick('MY_TASKS')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
              activeView === 'MY_TASKS'
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-700/60 font-semibold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>My Assigned Tasks</span>
            </div>
            {myAssignedTasksCount > 0 && (
              <span className="bg-emerald-900 text-emerald-200 text-[10px] font-mono px-1.5 py-0.2 rounded">
                {myAssignedTasksCount}
              </span>
            )}
          </button>

          <button
            id="field-nav-active-inspection"
            onClick={() => handleNavClick('ACTIVE_INSPECTION')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
              activeView === 'ACTIVE_INSPECTION'
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-700/60 font-semibold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Active Inspection</span>
            </div>
          </button>

          <button
            id="field-nav-history"
            onClick={() => handleNavClick('HISTORY')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
              activeView === 'HISTORY'
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-700/60 font-semibold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Intervention History</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-500 bg-slate-950 font-mono">
        Mobile Remediation Terminal
      </div>
    </div>
  );

  // Admin Sidebar Content (Baseline UI)
  const renderAdminContent = () => (
    <div className="flex flex-col justify-between h-full bg-white text-slate-700">
      <div className="p-3 space-y-1 overflow-y-auto">
        
        {/* Dashboard */}
        <button
          id="nav-dashboard-btn"
          onClick={() => handleNavClick('DASHBOARD')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'DASHBOARD'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className={`w-4 h-4 ${activeView === 'DASHBOARD' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Dashboard</span>
          </div>
        </button>

        {/* Risk Map */}
        <button
          id="nav-gis-map-btn"
          onClick={() => handleNavClick('RISK_MAP')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'RISK_MAP'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MapPin className={`w-4 h-4 ${activeView === 'RISK_MAP' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Risk Map</span>
          </div>
        </button>

        {/* Hotspots */}
        <button
          id="nav-hotspots-btn"
          onClick={() => handleNavClick('HOTSPOTS')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'HOTSPOTS'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className={`w-4 h-4 ${activeView === 'HOTSPOTS' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Hotspots</span>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {hotspots.length || 30}
          </span>
        </button>

        {/* Tasks */}
        <button
          id="nav-tasks-btn"
          onClick={() => handleNavClick('TASKS')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'TASKS'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ClipboardList className={`w-4 h-4 ${activeView === 'TASKS' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Tasks</span>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length || 5}
          </span>
        </button>

        {/* Verification */}
        <button
          id="nav-verification-btn"
          onClick={() => handleNavClick('VERIFICATION')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'VERIFICATION'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckSquare className={`w-4 h-4 ${activeView === 'VERIFICATION' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Verification</span>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {awaitingVerificationCount || 1}
          </span>
        </button>

        {/* Subtle Divider */}
        <div className="border-t border-slate-200 my-2 pt-1"></div>

        {/* Analytics */}
        <button
          id="nav-analytics-btn"
          onClick={() => handleNavClick('ANALYTICS')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'ANALYTICS'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className={`w-4 h-4 ${activeView === 'ANALYTICS' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Analytics</span>
          </div>
        </button>

        {/* Learning */}
        <button
          id="nav-learning-btn"
          onClick={() => handleNavClick('LEARNING')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'LEARNING'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <History className={`w-4 h-4 ${activeView === 'LEARNING' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Learning</span>
          </div>
        </button>

        {/* Data & ML */}
        <button
          id="nav-data-ml-btn"
          onClick={() => handleNavClick('DATA_ML')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'DATA_ML' || activeView === 'ARCHITECTURE'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Cpu className={`w-4 h-4 ${activeView === 'DATA_ML' || activeView === 'ARCHITECTURE' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Data & ML</span>
          </div>
        </button>

        {/* Subtle Divider */}
        <div className="border-t border-slate-200 my-2 pt-1"></div>

        {/* Users */}
        <button
          id="nav-users-btn"
          onClick={() => handleNavClick('USERS')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'USERS'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Users className={`w-4 h-4 ${activeView === 'USERS' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Users</span>
          </div>
        </button>

        {/* Settings */}
        <button
          id="nav-settings-btn"
          onClick={() => handleNavClick('RESPONSIBLE_AI')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            activeView === 'RESPONSIBLE_AI' || activeView === 'SETTINGS'
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className={`w-4 h-4 ${activeView === 'RESPONSIBLE_AI' || activeView === 'SETTINGS' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Settings</span>
          </div>
        </button>

      </div>

      {/* Bottom SDG and Global View Section */}
      <div className="p-3 border-t border-slate-200 space-y-2.5 bg-slate-50/70 shrink-0">
        
        {/* Global View Button */}
        <button
          id="nav-global-view-btn"
          onClick={() => handleNavClick('GLOBAL_VIEW')}
          className={`w-full flex items-center gap-2 text-left p-1.5 rounded-lg transition ${
            activeView === 'GLOBAL_VIEW' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <div className="font-bold text-xs">Global View</div>
            <div className="text-[10px] text-slate-500">India & Worldwide GIS</div>
          </div>
        </button>

        {/* SDG Impact Badge / Button */}
        <button
          id="nav-sdgs-btn"
          onClick={() => handleNavClick('SDGS')}
          className={`w-full flex items-start gap-2 text-left p-1.5 rounded-lg transition pt-2 border-t border-slate-200/80 ${
            activeView === 'SDGS' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100 text-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[11px]">SDG 3 | 11 | 13</div>
            <div className="text-[10px] text-slate-500 leading-tight">
              Good Health<br/>Sustainable Cities<br/>Climate Action
            </div>
          </div>
        </button>

      </div>
    </div>
  );

  const getActiveContent = () => {
    if (currentUser.role === 'CITIZEN') return renderCitizenContent();
    if (currentUser.role === 'FIELD_OFFICER') return renderFieldOfficerContent();
    return renderAdminContent();
  };

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-56 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-full overflow-hidden z-30 text-slate-700 select-none shadow-2xs">
        {getActiveContent()}
      </aside>

      {/* 2. Mobile Responsive Drawer & Backdrop */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileNavOpen?.(false)}
          />
          
          {/* Sliding Drawer */}
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  VG
                </div>
                <span className="font-bold text-xs text-slate-900">Navigation Menu</span>
              </div>
              <button
                onClick={() => setIsMobileNavOpen?.(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {getActiveContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
