import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  MapPin, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  ImageIcon,
  Compass,
  Link as LinkIcon
} from 'lucide-react';
import { CitizenEvidenceType, CitizenEvidenceSubmission as CitizenEvidenceSubmissionType } from '../../types';
import { ALL_INDIAN_STATES_AND_UTS } from '../../data/indiaGeoData';
import { DEMO_EVIDENCE_IMAGES } from '../../data/evidenceImages';
import { useApp } from '../../context/AppContext';

interface CitizenEvidenceSubmissionProps {
  onSubmissionSuccess: (submission: CitizenEvidenceSubmissionType) => void;
}

const EVIDENCE_TYPE_OPTIONS: { type: CitizenEvidenceType; label: string; desc: string }[] = [
  { type: 'Stagnant Water', label: 'Stagnant Water', desc: 'Standing puddle, ponding runoff, or marshy accumulation' },
  { type: 'Blocked Drain', label: 'Blocked Drain', desc: 'Culvert or open storm drain obstructed with silt/debris' },
  { type: 'Water-Retaining Pothole', label: 'Water-Retaining Pothole', desc: 'Road depression or asphalt hollow retaining rainwater' },
  { type: 'Construction Water Retention', label: 'Construction Water Retention', desc: 'Excavation footing, basement trench, or building site pool' },
  { type: 'Open Container / Debris', label: 'Open Container / Debris', desc: 'Discarded drum, tire, plastic waste, or unsealed tank' },
  { type: 'Other Environmental Condition', label: 'Other Environmental Condition', desc: 'Unlisted environmental water accumulation or blockage' }
];

const PRESET_SAMPLE_PHOTOS = [
  {
    name: 'Excavation Pit Ponding',
    url: DEMO_EVIDENCE_IMAGES.vg1042_before,
    type: 'Construction Water Retention' as CitizenEvidenceType,
    desc: 'Construction excavation trench retaining standing monsoon runoff'
  },
  {
    name: 'Clogged Stormwater Drain',
    url: DEMO_EVIDENCE_IMAGES.vg1018_before,
    type: 'Blocked Drain' as CitizenEvidenceType,
    desc: 'Open culvert blocked by plastic waste and silt buildup'
  },
  {
    name: 'Roadside Puddle Stagnation',
    url: DEMO_EVIDENCE_IMAGES.generic_drain_before,
    type: 'Stagnant Water' as CitizenEvidenceType,
    desc: 'Road shoulder rainwater pooling with visible surface algae'
  },
  {
    name: 'Vacant Plot Retention',
    url: DEMO_EVIDENCE_IMAGES.generic_plot_before,
    type: 'Stagnant Water' as CitizenEvidenceType,
    desc: 'Low-lying plot retaining water for over 48 hours'
  }
];

export const CitizenEvidenceSubmission: React.FC<CitizenEvidenceSubmissionProps> = ({ onSubmissionSuccess }) => {
  const { registeredCitizen, submitCitizenEvidence, hotspots } = useApp();

  const [evidenceType, setEvidenceType] = useState<CitizenEvidenceType>('Construction Water Retention');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_SAMPLE_PHOTOS[0].url);
  const [state, setState] = useState<string>(registeredCitizen?.state || 'Telangana');
  const [city, setCity] = useState<string>(registeredCitizen?.city || 'Hyderabad');
  const [localArea, setLocalArea] = useState<string>('Road No. 12, Banjara Hills near Metro Station');
  const [gpsCoordinates, setGpsCoordinates] = useState<string>('17.4156° N, 78.4350° E');
  const [description, setDescription] = useState<string>('Excavated basement pit retaining approximately 35cm of standing rainwater following recent monsoonal downpour. Debris floating along the perimeter.');
  const [isDroneRestrictedScenario, setIsDroneRestrictedScenario] = useState<boolean>(true);
  const [linkedHotspotId, setLinkedHotspotId] = useState<string>('VG-1042');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available cities for selected state
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFetchGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates(`${pos.coords.latitude.toFixed(6)}° N, ${pos.coords.longitude.toFixed(6)}° E`);
        },
        () => {
          // Fallback to demo coordinate
          setGpsCoordinates('17.4156° N, 78.4350° E');
        }
      );
    } else {
      setGpsCoordinates('17.4156° N, 78.4350° E');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!imageUrl) errs.image = 'Please upload or select an evidence photograph.';
    if (!state) errs.state = 'Please select the state.';
    if (!city.trim()) errs.city = 'Please select the city.';
    if (!localArea.trim()) errs.localArea = 'Please provide the local area or landmark.';
    if (!description.trim()) errs.description = 'Please describe the observed environmental condition.';
    else if (description.trim().length < 10) errs.description = 'Description should be at least 10 characters.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const submission = submitCitizenEvidence({
      evidenceType,
      imageUrl,
      state,
      city,
      localArea,
      gpsCoordinates,
      description,
      isDroneRestrictedScenario,
      linkedHotspotId: linkedHotspotId || undefined
    });

    setIsSubmitting(false);
    onSubmissionSuccess(submission);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      
      {/* Title Header */}
      <div className="bg-card rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Submit Environmental Evidence
              </span>
              <span className="bg-violet-100 text-violet-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                CITIZEN OBSERVATION
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Help provide supporting visual evidence where authorized surveillance imagery is unavailable or restricted.
            </p>
          </div>

          {registeredCitizen && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-right shrink-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Profile</div>
              <div className="text-xs font-bold text-slate-800">{registeredCitizen.fullName}</div>
              <div className="text-[10px] font-mono text-slate-500">{registeredCitizen.city}, {registeredCitizen.state}</div>
            </div>
          )}
        </div>
      </div>

      {/* DRONE RESTRICTION SCENARIO CALLOUT BANNER */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
            <ShieldAlert className="w-5 h-5 text-slate-950" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-950 tracking-wide uppercase">
                DRONE IMAGERY RESTRICTED
              </span>
              <span className="bg-amber-200/90 text-amber-900 text-[10px] font-bold px-2 py-0.2 rounded">
                Alternative Ground Verification Active
              </span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              When aerial or drone surveillance cannot fly due to airspace, weather, or canopy cover, registered citizen evidence acts as authorized supporting ground intelligence.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 bg-card/80 hover:bg-card px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 cursor-pointer shrink-0 transition">
          <input
            type="checkbox"
            checked={isDroneRestrictedScenario}
            onChange={(e) => setIsDroneRestrictedScenario(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>Tag as Restricted Airspace Fallback</span>
        </label>
      </div>

      {/* MANDATORY CITIZEN DISCLAIMER BOX */}
      <div className="vg-panel-dark rounded-2xl p-4.5 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-wider uppercase">
          <Info className="w-4 h-4" />
          <span>CITIZEN EVIDENCE IS SUPPORTING EVIDENCE ONLY</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Citizen submissions do not determine VectorGuard's AI risk score, do not trigger automated penal actions, and do not replace authorized field verification. Every report is audited by municipal health control personnel before inclusion in local surveillance maps.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        
        {/* Step 1: Evidence Type Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              1. Select Environmental Evidence Type <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">Choose best match</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {EVIDENCE_TYPE_OPTIONS.map(opt => {
              const isSelected = evidenceType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setEvidenceType(opt.type)}
                  className={`text-left p-3.5 rounded-xl border transition ${
                    isSelected 
                      ? 'bg-violet-50/80 border-violet-500 ring-2 ring-violet-500/20 shadow-xs' 
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Photographic Visual Evidence */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              2. Upload or Select Visual Evidence Photo <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">JPG, PNG, WebP supported</span>
          </div>

          {/* Preset Photo Quick Picker */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Quick Demo Samples (Click to select realistic environmental condition):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_SAMPLE_PHOTOS.map((sample, idx) => {
                const isSelected = imageUrl === sample.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(sample.url);
                      setEvidenceType(sample.type);
                      setDescription(sample.desc);
                      if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left transition ${
                      isSelected 
                        ? 'ring-2 ring-violet-600 border-violet-600 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-20 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={sample.url} 
                        alt={sample.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 bg-card">
                      <div className="text-[11px] font-bold text-slate-900 truncate">{sample.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">{sample.type}</div>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 bg-violet-600 text-white rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Evidence Preview & Custom Upload Box */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
            
            {/* Left Preview */}
            <div className="sm:col-span-5 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 flex items-center justify-center">
              {imageUrl ? (
                <>
                  <img 
                    src={imageUrl} 
                    alt="Citizen Evidence Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="vg-island absolute bottom-2 left-2 bg-slate-950/80 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    SELECTED EVIDENCE
                  </span>
                </>
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs">No photo chosen</span>
                </div>
              )}
            </div>

            {/* Right Upload Controls */}
            <div className="sm:col-span-7 space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-violet-50/30 transition space-y-1.5"
              >
                <UploadCloud className="w-6 h-6 mx-auto text-slate-500" />
                <div className="text-xs font-bold text-slate-800">
                  Click or drag photo from your device
                </div>
                <div className="text-[11px] text-slate-400">
                  Capture directly from mobile camera or choose gallery photo
                </div>
              </div>

              {errors.image && (
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.image}</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Step 3: Location Details */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              3. Observation Location & Coordinates <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleFetchGps}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Use Current GPS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* State */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">State / UT</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20"
              >
                {ALL_INDIAN_STATES_AND_UTS.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">City / District</label>
              {cityList.length > 0 ? (
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20"
                >
                  {cityList.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              )}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Local Area / Landmark */}
            <div className="sm:col-span-7 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Local Area / Street / Landmark <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={localArea}
                  onChange={(e) => {
                    setLocalArea(e.target.value);
                    if (errors.localArea) setErrors(prev => ({ ...prev, localArea: '' }));
                  }}
                  placeholder="e.g. Road No. 12, Banjara Hills"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 ${
                    errors.localArea ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
              </div>
              {errors.localArea && (
                <div className="text-[11px] font-semibold text-rose-600 mt-1">
                  {errors.localArea}
                </div>
              )}
            </div>

            {/* GPS Coordinates */}
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                GPS Latitude / Longitude
              </label>
              <input
                type="text"
                value={gpsCoordinates}
                onChange={(e) => setGpsCoordinates(e.target.value)}
                placeholder="e.g. 17.4156° N, 78.4350° E"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-card focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

          </div>
        </div>

        {/* Step 4: Description */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            4. Description of Environmental Observation <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder="Describe what you observed (e.g. standing depth, foul odor, drainage block, visible mosquito larvae)..."
            className={`w-full p-3 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-card focus:ring-2 leading-relaxed ${
              errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
            }`}
          />
          {errors.description && (
            <div className="text-[11px] font-semibold text-rose-600 mt-1">
              {errors.description}
            </div>
          )}
        </div>

        {/* Optional: Link to Specific Demo Hotspot */}
        <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-950 font-bold">
            <LinkIcon className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Link evidence to Hotspot Scenario:</span>
          </div>
          <select
            value={linkedHotspotId}
            onChange={(e) => setLinkedHotspotId(e.target.value)}
            className="bg-card border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">General Area (Unlinked)</option>
            <option value="VG-1042">VG-1042 • Hyderabad (Hero Hotspot)</option>
            <option value="VG-1001">VG-1001 • Delhi (Connaught Place Drain)</option>
            <option value="VG-1008">VG-1008 • Mumbai (Kurla West Culvert)</option>
          </select>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            id="submit-citizen-evidence-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.99] transition shadow-md shadow-violet-600/25 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>SUBMIT EVIDENCE FOR HUMAN VERIFICATION</span>
          </button>
        </div>

      </form>

    </div>
  );
};
