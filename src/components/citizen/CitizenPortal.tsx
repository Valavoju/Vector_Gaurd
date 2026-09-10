import React, { useState } from 'react';
import { 
  User, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Building2,
  Info,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CitizenRegistration } from './CitizenRegistration';
import { CitizenEvidenceSubmission } from './CitizenEvidenceSubmission';
import { CitizenSubmissionStatus } from './CitizenSubmissionStatus';
import { CitizenEvidenceSubmission as CitizenEvidenceSubmissionType, maskName, maskMobile } from '../../types';

export const CitizenPortal: React.FC = () => {
  const { registeredCitizen, citizenSubmissions, resetToDefaultData, switchUserRole, setActiveView } = useApp();

  const [activeTab, setActiveTab] = useState<'SUBMIT' | 'STATUS' | 'HISTORY'>('SUBMIT');
  const [latestSubmission, setLatestSubmission] = useState<CitizenEvidenceSubmissionType | null>(null);

  const handleRegistrationComplete = () => {
    setActiveTab('SUBMIT');
  };

  const handleSubmissionComplete = (submission: CitizenEvidenceSubmissionType) => {
    setLatestSubmission(submission);
    setActiveTab('STATUS');
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-slate-100/60 pb-12">
      
      {/* Top Banner Navigation Bar for Citizen */}
      <div className="bg-white border-b border-slate-200/90 sticky top-[68px] z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Persona Identification */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 leading-tight">
                Citizen Evidence Portal
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {registeredCitizen ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ Registered: {registeredCitizen.fullName} ({registeredCitizen.city})
                  </span>
                ) : (
                  <span>Unregistered Sentinel Mode</span>
                )}
              </div>
            </div>
          </div>

          {/* Center/Right Tabs if Registered */}
          {registeredCitizen && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('SUBMIT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'SUBMIT' 
                    ? 'bg-white text-violet-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submit Evidence
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('STATUS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'STATUS' 
                    ? 'bg-white text-violet-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Submissions</span>
                {citizenSubmissions.length > 0 && (
                  <span className="bg-violet-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                    {citizenSubmissions.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Quick Switch to Admin Verification Button */}
          <button
            type="button"
            onClick={() => {
              switchUserRole('ADMIN');
              setActiveView('VERIFICATION');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition"
            title="Switch to Control Room Admin Verification Center"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin Review Center →</span>
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto pt-6">
        
        {/* If Not Registered: Show Registration */}
        {!registeredCitizen ? (
          <CitizenRegistration onRegistrationSuccess={handleRegistrationComplete} />
        ) : (
          <>
            {activeTab === 'SUBMIT' && (
              <CitizenEvidenceSubmission onSubmissionSuccess={handleSubmissionComplete} />
            )}

            {activeTab === 'STATUS' && (
              <CitizenSubmissionStatus 
                latestSubmission={latestSubmission} 
                onSubmitNew={() => setActiveTab('SUBMIT')} 
              />
            )}
          </>
        )}

      </div>

    </div>
  );
};
