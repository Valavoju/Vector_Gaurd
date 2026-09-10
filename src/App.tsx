/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Header } from './components/common/Header';
import { HeroDemoGuide } from './components/common/HeroDemoGuide';
import { Sidebar } from './components/common/Sidebar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { RiskMap } from './components/map/RiskMap';
import { HotspotsDirectory } from './components/hotspot/HotspotsDirectory';
import { TasksDirectory } from './components/tasks/TasksDirectory';
import { VerificationCenter } from './components/verification/VerificationCenter';
import { ContinuousLearning } from './components/learning/ContinuousLearning';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { DeploymentEconomics } from './components/deployment/DeploymentEconomics';
import { TechnicalArchitecture } from './components/architecture/TechnicalArchitecture';
import { UserManagement } from './components/users/UserManagement';
import { ResponsibleAIModal } from './components/responsible-ai/ResponsibleAIModal';
import { FieldOfficerApp } from './components/field/FieldOfficerApp';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { HotspotDetailModal } from './components/hotspot/HotspotDetailModal';
import { TaskDispatchModal } from './components/tasks/TaskDispatchModal';

const MainLayout: React.FC = () => {
  const { activeView, currentUser } = useApp();

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

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white box-border">
      {/* 1. Official Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Top Header & Role Switcher */}
      <Header />

      {/* 3. Interactive Hero Walkthrough Assistant (Toggled via Demo Mode) */}
      <HeroDemoGuide />

      {/* 4. Main Body with Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden w-full max-w-full">
        <Sidebar />

        <main className="flex-1 overflow-y-auto w-full min-w-0 bg-[#f8fafc]">
          {renderActiveContent()}
        </main>
      </div>

      {/* 5. Global Modals */}
      <HotspotDetailModal />
      <TaskDispatchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
