import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  FileText,
  Building,
  ArrowRight
} from 'lucide-react';
import { ALL_INDIAN_STATES_AND_UTS } from '../../data/indiaGeoData';
import { useApp } from '../../context/AppContext';

interface CitizenRegistrationProps {
  onRegistrationSuccess: () => void;
}

export const CitizenRegistration: React.FC<CitizenRegistrationProps> = ({ onRegistrationSuccess }) => {
  const { registerCitizen } = useApp();

  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [state, setState] = useState<string>('Telangana');
  const [city, setCity] = useState<string>('Hyderabad');
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  // Get available cities for selected state
  const selectedStateObj = ALL_INDIAN_STATES_AND_UTS.find(s => s.name === state);
  const cityList = selectedStateObj ? selectedStateObj.cities : [];

  const handleStateChange = (newState: string) => {
    setState(newState);
    const matched = ALL_INDIAN_STATES_AND_UTS.find(s => s.name === newState);
    if (matched && matched.cities.length > 0) {
      setCity(matched.cities[0].name);
    } else {
      setCity('');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters.';
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim()) {
      errs.mobileNumber = 'Please enter a valid mobile number.';
    } else if (cleanMobile.length < 10) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!state) {
      errs.state = 'Please select your state.';
    }

    if (!city.trim()) {
      errs.city = 'Please select your city.';
    }

    if (!consentGiven) {
      errs.consent = 'Consent is required before submitting evidence.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    const success = registerCitizen({
      fullName,
      mobileNumber,
      email: email.trim() || undefined,
      state,
      city,
      consentGiven
    });

    if (success) {
      setShowSuccessBanner(true);
      setTimeout(() => {
        onRegistrationSuccess();
      }, 1200);
    }
  };

  // Demo auto-fill helper
  const handleQuickFillDemo = () => {
    setFullName('Anil Kumar');
    setMobileNumber('9876543210');
    setEmail('anil.kumar@example.in');
    setState('Telangana');
    setCity('Hyderabad');
    setConsentGiven(true);
    setErrors({});
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Registration Card */}
      <div className="bg-card rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header Title & Subtitle */}
        <div className="space-y-1.5 pb-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Citizen Registration
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Register to submit environmental evidence that can support VectorGuard verification.
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-Fill Button */}
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg border border-violet-200 transition shrink-0"
              title="Auto-fill verified demo profile"
            >
              Quick Demo Fill
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-extrabold text-sm text-emerald-900">Registration Successful ✓</div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your citizen profile has been registered for environmental evidence submission. Redirecting to submission portal...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="e.g. Anil Kumar"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-card focus:ring-2 ${
                    errors.fullName ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: '' }));
                  }}
                  placeholder="e.g. 9876543210"
                  maxLength={13}
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-card focus:ring-2 ${
                    errors.mobileNumber ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.mobileNumber}</span>
                </div>
              )}
            </div>

          </div>

          {/* Email Address (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Email Address
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="e.g. anil.kumar@example.in"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-card focus:ring-2 ${
                  errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                }`}
              />
            </div>
            {errors.email && (
              <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Geographic Location (State & City) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* State */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                State / Union Territory <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 appearance-none cursor-pointer"
                >
                  <option value="">Select State</option>
                  {ALL_INDIAN_STATES_AND_UTS.map(s => (
                    <option key={s.name} value={s.name}>{s.name} ({s.type === 'STATE' ? 'State' : 'UT'})</option>
                  ))}
                </select>
              </div>
              {errors.state && (
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.state}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                City / Municipal Corporation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                {cityList.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 appearance-none cursor-pointer"
                  >
                    <option value="">Select City</option>
                    {cityList.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    placeholder="Enter city name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                )}
              </div>
              {errors.city && (
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </div>
              )}
            </div>

          </div>

          {/* Privacy & Masking Assurance Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-800">Privacy Protection:</strong> VectorGuard masks citizen identity in public & control room audit records (e.g. <span className="font-mono text-slate-700 bg-slate-200/80 px-1 py-0.2 rounded">A*** K*****</span>, <span className="font-mono text-slate-700 bg-slate-200/80 px-1 py-0.2 rounded">******4321</span>). No Aadhaar, government ID, or passwords are ever requested.
            </div>
          </div>

          {/* Mandatory Consent Checkbox */}
          <div className={`p-4 rounded-xl border transition ${
            errors.consent ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-300' : 'bg-violet-50/40 border-violet-200/80'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                  if (errors.consent) setErrors(prev => ({ ...prev, consent: '' }));
                }}
                className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer"
              />
              <div className="text-xs text-slate-800 leading-relaxed font-medium">
                I consent to VectorGuard using the submitted environmental evidence for environmental verification and public-health planning. <span className="text-rose-500 font-bold">*</span>
              </div>
            </label>
            {errors.consent && (
              <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-2 pl-7">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.consent}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="citizen-register-submit-btn"
              type="submit"
              disabled={showSuccessBanner}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition shadow-md shadow-violet-600/20 disabled:opacity-50"
            >
              <span>REGISTER & CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
