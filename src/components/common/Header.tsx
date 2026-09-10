import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  RotateCcw, 
  Sliders, 
  CheckSquare, 
  User, 
  Sparkles,
  Layers,
  ChevronDown,
  Activity,
  Globe2,
  ShieldCheck,
  Check,
  Lock,
  Smartphone,
  Eye,
  AlertTriangle,
  Info,
  Bell,
  RefreshCw,
  Compass,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    switchUserRole,
    demoMode, 
    setDemoMode, 
    resetDemo, 
    activeView, 
    setActiveView,
    tasks,
    hotspots,
    registeredCitizen,
    citizenSubmissions,
    isMobileNavOpen,
    setIsMobileNavOpen,
    databaseConnectionStatus
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const awaitingCount = tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length;

  const handleRoleChange = (role: UserRole) => {
    setIsRoleMenuOpen(false);
    if (switchUserRole) {
      switchUserRole(role);
    } else if (setCurrentUser) {
      if (role === 'CITIZEN') {
        setCurrentUser({
          id: 'usr-citizen-01',
          name: registeredCitizen ? registeredCitizen.fullName : 'Citizen Sentinel',
          role: 'CITIZEN',
          team: 'Supporting Evidence Network'
        });
        setActiveView('CITIZEN_PORTAL');
      } else if (role === 'FIELD_OFFICER') {
        setCurrentUser({
          id: 'usr-fo-01',
          name: 'Rajesh Kumar',
          role: 'FIELD_OFFICER',
          team: 'Rapid Intervention Unit 4'
        });
        setActiveView('MY_TASKS');
      } else {
        setCurrentUser({
          id: 'usr-admin-01',
          name: 'Dr. Neha Sharma',
          role: 'ADMIN',
          team: 'Vector Surveillance Command'
        });
        setActiveView('DASHBOARD');
      }
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 text-slate-800 flex items-center justify-between px-3 sm:px-4 z-40 shrink-0 select-none shadow-2xs relative">
      
      {/* Brand & Left Navigation Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        
        {/* Mobile Hamburger Toggle Button */}
        <button
          id="mobile-nav-toggle-btn"
          aria-label="Toggle Navigation Menu"
          onClick={() => setIsMobileNavOpen?.(!isMobileNavOpen)}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
        >
          {isMobileNavOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
        </button>

        <div 
          onClick={() => {
            if (currentUser.role === 'ADMIN') setActiveView('DASHBOARD');
          }}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 font-sans truncate">
                VectorGuard <span className="text-teal-600">AI</span>
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden xs:block truncate">
              Predict. Verify. Prevent. Learn.
            </div>
          </div>
        </div>

        {/* Demo / Pilot Data Warning Pill */}
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/90 border border-amber-300/80 px-3 py-0.5 rounded-full font-sans shadow-2xs whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>DEMO / PILOT DATA — ILLUSTRATIVE</span>
          </span>
        </div>
      </div>

      {/* Right Operational Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        
        {/* Database Connection Status Button */}
        <button
          onClick={() => setActiveView('DATA_ML')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-mono transition"
          title="Persistent Cloud Database Active — Click to open 9 Tables & Architecture"
        >
          <span className={`w-2 h-2 rounded-full ${databaseConnectionStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <Database className="w-3 h-3 text-sky-600" />
          <span className="font-semibold text-slate-700">DB: {databaseConnectionStatus === 'CONNECTED' ? 'Connected' : 'Syncing'}</span>
        </button>

        {/* System Operational & Local Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-800">System Operational</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-[11px]">09 Sept 2026, 13:59 IST</span>
        </div>

        {/* Demo Mode Toggle Button */}
        <button
          id="header-demo-guide-toggle"
          onClick={() => setDemoMode?.(!demoMode)}
          className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-sans font-bold flex items-center gap-1 sm:gap-1.5 transition shadow-xs shrink-0 ${
            demoMode 
              ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400/40' 
              : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
          }`}
          title="Toggle 18-Step Interactive Walkthrough Guide"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30 shrink-0" />
          <span className="hidden xs:inline">Demo Mode</span>
          <span className="xs:hidden">Demo</span>
        </button>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <span>System Notifications</span>
                <span className="text-blue-600 font-semibold">{awaitingCount || 3} Active</span>
              </div>
              <div className="py-2 space-y-2 text-slate-700">
                <div className="flex items-start gap-2 p-1.5 hover:bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>
                  <div className="text-[11px]">
                    <div className="font-bold text-slate-900">VG-1042 Inspection Pending</div>
                    <div className="text-slate-500 text-[10px]">Ward 12, Banjara Hills, Hyderabad</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 hover:bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <div className="text-[11px]">
                    <div className="font-bold text-slate-900">Weather API Telemetry Synced</div>
                    <div className="text-slate-500 text-[10px]">Real-time precipitation updated</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Role Perspective Switcher */}
        <div className="relative shrink-0">
          <button
            id="header-role-switcher-btn"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 pl-1 pr-1.5 sm:pr-2 py-1 rounded-full hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              {currentUser.role === 'ADMIN' ? 'CR' : currentUser.role === 'FIELD_OFFICER' ? 'FO' : 'CZ'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-bold text-xs text-slate-900 leading-tight">
                {currentUser.role === 'ADMIN' ? 'Control Room' : 
                 currentUser.role === 'FIELD_OFFICER' ? 'Field Unit' : 'Citizen Sentinel'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight font-medium">
                {currentUser.role === 'ADMIN' ? 'Admin' : 
                 currentUser.role === 'FIELD_OFFICER' ? 'Field Officer' : 'Citizen'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-100">
              <div className="p-2.5 bg-slate-50 border-b border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  SWITCH ROLE PERSPECTIVE
                </span>
              </div>

              <div className="p-1.5 space-y-1">
                {/* Admin */}
                <button
                  id="role-switch-admin"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                    currentUser.role === 'ADMIN' 
                      ? 'bg-blue-50 text-blue-900 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    CR
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Control Room Admin</div>
                    <div className="text-[11px] text-slate-500">GIS Operations, Task Dispatch & Verification</div>
                  </div>
                </button>

                {/* Field Officer */}
                <button
                  id="role-switch-officer"
                  onClick={() => handleRoleChange('FIELD_OFFICER')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                    currentUser.role === 'FIELD_OFFICER' 
                      ? 'bg-emerald-50 text-emerald-900 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    FO
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Field Officer</div>
                    <div className="text-[11px] text-slate-500">Mobile Inspection, GPS Photos & Remediation</div>
                  </div>
                </button>

                {/* Citizen */}
                <button
                  id="role-switch-citizen"
                  onClick={() => handleRoleChange('CITIZEN')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                    currentUser.role === 'CITIZEN' 
                      ? 'bg-purple-50 text-purple-900 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    CZ
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Citizen Sentinel</div>
                    <div className="text-[11px] text-slate-500">Community Evidence & Verification</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
