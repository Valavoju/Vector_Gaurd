/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Header } from './components/common/Header';
import { HeroDemoGuide } from './components/common/HeroDemoGuide';
import { Sidebar } from './components/common/Sidebar';
import { PageLoader } from './components/common/PageLoader';
import { Toaster } from './components/common/Toaster';
import { HotspotDetailModal } from './components/hotspot/HotspotDetailModal';
import { TaskDispatchModal } from './components/tasks/TaskDispatchModal';

// Views are split into their own chunks so the first paint only ships the shell.
const named = <K extends string>(loader: () => Promise<Record<K, React.ComponentType>>, key: K) =>
  lazy(() => loader().then(m => ({ default: m[key] })));

const AdminDashboard = named(() => import('./components/dashboard/AdminDashboard'), 'AdminDashboard');
const RiskMap = named(() => import('./components/map/RiskMap'), 'RiskMap');
const HotspotsDirectory = named(() => import('./components/hotspot/HotspotsDirectory'), 'HotspotsDirectory');
const TasksDirectory = named(() => import('./components/tasks/TasksDirectory'), 'TasksDirectory');
const VerificationCenter = named(() => import('./components/verification/VerificationCenter'), 'VerificationCenter');
const ContinuousLearning = named(() => import('./components/learning/ContinuousLearning'), 'ContinuousLearning');
const AnalyticsDashboard = named(() => import('./components/analytics/AnalyticsDashboard'), 'AnalyticsDashboard');
const DeploymentEconomics = named(() => import('./components/deployment/DeploymentEconomics'), 'DeploymentEconomics');
const TechnicalArchitecture = named(() => import('./components/architecture/TechnicalArchitecture'), 'TechnicalArchitecture');
const UserManagement = named(() => import('./components/users/UserManagement'), 'UserManagement');
const ResponsibleAIModal = named(() => import('./components/responsible-ai/ResponsibleAIModal'), 'ResponsibleAIModal');
const FieldOfficerApp = named(() => import('./components/field/FieldOfficerApp'), 'FieldOfficerApp');
const CitizenPortal = named(() => import('./components/citizen/CitizenPortal'), 'CitizenPortal');

const SPLASH_MIN_MS = 1400;

/** Fades out the inline splash from index.html once the shell has mounted. */
const useDismissSplash = () => {
  useEffect(() => {
    const splash = document.getElementById('vg-splash');
    if (!splash) return;
    const wait = Math.max(0, SPLASH_MIN_MS - performance.now());
    const t = window.setTimeout(() => {
      splash.classList.add('is-done');
      window.setTimeout(() => splash.remove(), 700);
    }, wait);
    return () => window.clearTimeout(t);
  }, []);
};

/** Keeps the URL hash in sync with the active view so links and Back work. */
const useHashSync = (activeView: string) => {
  const isFirstSync = useRef(true);
  useEffect(() => {
    const hash = `#${activeView.toLowerCase().replace(/_/g, '-')}`;
    if (window.location.hash !== hash) {
      // The initial sync only normalises the URL; later changes become history entries.
      window.history[isFirstSync.current ? 'replaceState' : 'pushState'](null, '', hash);
    }
    isFirstSync.current = false;
  }, [activeView]);
};

const MainLayout: React.FC = () => {
  const { activeView, currentUser } = useApp();

  useDismissSplash();
  useHashSync(activeView);

  const renderActiveContent = () => {
    // 1. STRICT ACCESS CONTROL ENFORCEMENT: Citizen Role
    // Citizens are strictly confined to the citizen portal and submission workflows.
    // They cannot access control room dashboards, officer dispatch, or internal verification.
    if (currentUser.role === 'CITIZEN' || activeView === 'CITIZEN_PORTAL' || activeView === 'CITIZEN_SUBMIT') {
      return <CitizenPortal />;
    }

    // 2. STRICT ACCESS CONTROL ENFORCEMENT: Field Officer Role
    // Field officers are confined to their mobile remediation task list, GPS camera inspection, and history.
    if (currentUser.role === 'FIELD_OFFICER') {
      return <FieldOfficerApp />;
    }

    // 3. ADMIN ROLE: Enterprise GIS Command Center & Specialized Subviews
    switch (activeView) {
      case 'DASHBOARD':
        return <AdminDashboard />;
      case 'RISK_MAP':
        return <RiskMap />;
      case 'HOTSPOTS':
        return <HotspotsDirectory />;
      case 'TASKS':
        return <TasksDirectory />;
      case 'VERIFICATION':
        return <VerificationCenter />;
      case 'ANALYTICS':
        return <AnalyticsDashboard />;
      case 'LEARNING':
        return <ContinuousLearning />;
      case 'ARCHITECTURE':
      case 'DATA_ML':
        return <TechnicalArchitecture />;
      case 'DEPLOYMENT':
      case 'SDGS':
        return <DeploymentEconomics />;
      case 'USERS':
        return <UserManagement />;
      case 'SETTINGS':
      case 'RESPONSIBLE_AI':
        return <ResponsibleAIModal />;
      case 'GLOBAL_VIEW':
        return <RiskMap />;
      case 'MY_TASKS':
      case 'ACTIVE_INSPECTION':
      case 'HISTORY':
        return <FieldOfficerApp />;
      default:
        return <AdminDashboard />;
    }
  };

  const isMapView = currentUser.role === 'ADMIN' && (activeView === 'RISK_MAP' || activeView === 'GLOBAL_VIEW');

  return (
    <div className="h-dvh w-full max-w-full overflow-hidden flex flex-col font-sans text-slate-800 antialiased">
      {/* 1. Official Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Interactive Hero Walkthrough Assistant (Toggled via Demo Mode) */}
      <HeroDemoGuide />

      {/* 3. Floating sidebar + header + scrolling workspace */}
      <div className="flex-1 min-h-0 flex gap-3 p-2 sm:p-3">
        <Sidebar />

        <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-3">
          <Header />

          <main
            id="main-content"
            className={`flex-1 min-h-0 w-full min-w-0 rounded-2xl ${
              isMapView ? 'overflow-hidden border border-[var(--vg-glass-border)] shadow-[var(--vg-glass-shadow)]' : 'overflow-y-auto overflow-x-hidden'
            }`}
          >
            <Suspense fallback={<PageLoader />}>
              <div key={`${currentUser.role}-${activeView}`} className={`animate-page-in ${isMapView ? 'h-full' : ''}`}>
                {renderActiveContent()}
              </div>
            </Suspense>
          </main>
        </div>
      </div>

      {/* 4. Global Modals & Toasts */}
      <HotspotDetailModal />
      <TaskDispatchModal />
      <Toaster />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
