/**
 * REALISTIC ENVIRONMENTAL EVIDENCE IMAGERY & STANDALONE ASSETS
 * 
 * Provides guaranteed-loading, zero-latency visual evidence for municipal operations:
 * 1. Drone Before: Overhead / aerial survey of construction excavation pit with stagnant water
 * 2. Field Before: Ground level capture of foundation sump with murky water & debris
 * 3. Standing Water Close-up: High-resolution surface pool with debris & reflection
 * 4. Construction Pit: Excavation trench retaining monsoon runoff
 * 5. Intervention Evidence: Suction pump de-watering in progress & debris clearance
 * 6. After Intervention: Same site evacuated, dry foundation gravel base exposed
 * 7. Treatment / Cleanup Proof: Bio-larvicide barrier application verified on-site
 */

export interface AdditionalAngleEvidence {
  id: string;
  title: string;
  category: 'BEFORE' | 'AFTER' | 'CONTEXT' | 'TREATMENT';
  imageUrl: string;
  caption: string;
  coordinates: string;
  timestamp: string;
}

// Helper to encode SVG into Data URI
function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
}

// 1. Hero Hotspot VG-1042 BEFORE (Overhead / Drone Surveillance of Excavation Pit with Stagnant Water)
export const SVG_VG1042_BEFORE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a3728"/>
      <stop offset="50%" stop-color="#38291e"/>
      <stop offset="100%" stop-color="#2a1d14"/>
    </linearGradient>
    <linearGradient id="pitDepth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e150f"/>
      <stop offset="100%" stop-color="#120c08"/>
    </linearGradient>
    <linearGradient id="stagnantWater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d4a3e"/>
      <stop offset="40%" stop-color="#1e382b"/>
      <stop offset="80%" stop-color="#354823"/>
      <stop offset="100%" stop-color="#15281e"/>
    </linearGradient>
    <linearGradient id="concrete" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#78716c"/>
      <stop offset="50%" stop-color="#a8a29e"/>
      <stop offset="100%" stop-color="#57534e"/>
    </linearGradient>
    <radialGradient id="algaeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4d7c0f" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#14532d" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Surrounding Construction Site Ground -->
  <rect width="800" height="600" fill="url(#groundGrad)"/>
  
  <!-- Soil Strata & Gravel Texture -->
  <g opacity="0.3" stroke="#854d0e" stroke-width="1.5">
    <path d="M0,80 Q200,60 400,90 T800,70" fill="none"/>
    <path d="M0,150 Q300,170 600,140 T800,160" fill="none"/>
    <path d="M0,480 Q250,510 500,470 T800,500" fill="none"/>
    <path d="M0,550 Q400,530 800,560" fill="none"/>
  </g>

  <!-- Concrete Foundation Piers (Site Geometry Anchor) -->
  <rect x="70" y="70" width="80" height="120" rx="4" fill="url(#concrete)" stroke="#44403c" stroke-width="2"/>
  <rect x="650" y="70" width="80" height="120" rx="4" fill="url(#concrete)" stroke="#44403c" stroke-width="2"/>
  <rect x="70" y="410" width="80" height="120" rx="4" fill="url(#concrete)" stroke="#44403c" stroke-width="2"/>
  <rect x="650" y="410" width="80" height="120" rx="4" fill="url(#concrete)" stroke="#44403c" stroke-width="2"/>

  <!-- Steel Rebar Grid Columns -->
  <g stroke="#991b1b" stroke-width="2" opacity="0.8">
    <line x1="90" y1="50" x2="90" y2="70"/><line x1="110" y1="40" x2="110" y2="70"/><line x1="130" y1="45" x2="130" y2="70"/>
    <line x1="670" y1="50" x2="670" y2="70"/><line x1="690" y1="40" x2="690" y2="70"/><line x1="710" y1="45" x2="710" y2="70"/>
    <line x1="90" y1="530" x2="90" y2="560"/><line x1="110" y1="530" x2="110" y2="570"/><line x1="130" y1="530" x2="130" y2="555"/>
    <line x1="670" y1="530" x2="670" y2="560"/><line x1="690" y1="530" x2="690" y2="570"/><line x1="710" y1="530" x2="710" y2="555"/>
  </g>

  <!-- Main Excavation Sump Pit (Steep Slopes) -->
  <polygon points="120,130 680,130 730,470 70,470" fill="url(#pitDepth)"/>
  <polygon points="150,160 650,160 690,440 110,440" fill="#0f0a06" stroke="#523218" stroke-width="3"/>

  <!-- POOLED STAGNANT WATER (BEFORE INTERVENTION) -->
  <path d="M 160,200 Q 400,180 640,205 Q 675,320 660,420 Q 400,445 135,420 Q 120,310 160,200 Z" fill="url(#stagnantWater)"/>
  
  <!-- Algae / Bio-film & Murkiness Patches -->
  <ellipse cx="280" cy="270" rx="90" ry="40" fill="url(#algaeGlow)"/>
  <ellipse cx="510" cy="340" rx="110" ry="50" fill="url(#algaeGlow)"/>
  <ellipse cx="380" cy="380" rx="70" ry="30" fill="url(#algaeGlow)"/>

  <!-- Water Surface Ripples & Stagnation Ring Marks -->
  <g stroke="#a3e635" stroke-width="1" opacity="0.35" fill="none">
    <ellipse cx="320" cy="280" rx="55" ry="20"/>
    <ellipse cx="320" cy="280" rx="80" ry="30"/>
    <ellipse cx="490" cy="330" rx="65" ry="25"/>
    <ellipse cx="490" cy="330" rx="95" ry="38"/>
  </g>

  <!-- Floating Construction Debris, Plastic Scraps & Masonry Rubble -->
  <g fill="#78716c" stroke="#292524" stroke-width="1">
    <rect x="230" y="240" width="30" height="15" rx="2" transform="rotate(15 230 240)"/>
    <polygon points="410,290 435,280 440,305 415,310"/>
    <rect x="520" y="260" width="45" height="12" rx="1" fill="#ea580c" opacity="0.9"/>
    <circle cx="340" cy="360" r="8" fill="#0284c7" opacity="0.8"/>
    <polygon points="580,350 605,340 610,360 585,370" fill="#a8a29e"/>
  </g>

  <!-- Soil Erosion Bank & Mud Streaks -->
  <path d="M120,130 Q180,210 160,300" stroke="#713f12" stroke-width="6" fill="none" opacity="0.7"/>
  <path d="M680,130 Q630,220 650,320" stroke="#713f12" stroke-width="5" fill="none" opacity="0.7"/>

  <!-- Safety Warning Ribbon (Torn & Sagging in Before State) -->
  <path d="M60,110 Q400,160 740,110" stroke="#facc15" stroke-width="4" stroke-dasharray="14 6" fill="none"/>
  
  <!-- Optical Vignette -->
  <rect width="800" height="600" fill="none" stroke="#000" stroke-width="20" opacity="0.4"/>
</svg>
`);

// 2. Hero Hotspot VG-1042 AFTER (Identical Perspective, Completely Dewatered, Dry Foundation Gravel Base)
export const SVG_VG1042_AFTER = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="groundGradAfter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#574334"/>
      <stop offset="50%" stop-color="#443224"/>
      <stop offset="100%" stop-color="#34251a"/>
    </linearGradient>
    <linearGradient id="dryBedrock" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#57534e"/>
      <stop offset="40%" stop-color="#78716c"/>
      <stop offset="80%" stop-color="#a8a29e"/>
      <stop offset="100%" stop-color="#d6d3d1"/>
    </linearGradient>
    <linearGradient id="concreteClean" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a8a29e"/>
      <stop offset="50%" stop-color="#d6d3d1"/>
      <stop offset="100%" stop-color="#78716c"/>
    </linearGradient>
    <pattern id="cleanGravel" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="2.5" fill="#78716c"/>
      <circle cx="15" cy="15" r="3" fill="#a8a29e"/>
      <circle cx="15" cy="5" r="2" fill="#57534e"/>
      <circle cx="5" cy="15" r="2" fill="#d6d3d1"/>
    </pattern>
  </defs>

  <!-- Surrounding Construction Site Ground (Cleaned) -->
  <rect width="800" height="600" fill="url(#groundGradAfter)"/>

  <!-- Concrete Foundation Piers (Exact Same Geometry as Before) -->
  <rect x="70" y="70" width="80" height="120" rx="4" fill="url(#concreteClean)" stroke="#292524" stroke-width="2"/>
  <rect x="650" y="70" width="80" height="120" rx="4" fill="url(#concreteClean)" stroke="#292524" stroke-width="2"/>
  <rect x="70" y="410" width="80" height="120" rx="4" fill="url(#concreteClean)" stroke="#292524" stroke-width="2"/>
  <rect x="650" y="410" width="80" height="120" rx="4" fill="url(#concreteClean)" stroke="#292524" stroke-width="2"/>

  <!-- Steel Rebar Grid Columns (Intact & Cleaned) -->
  <g stroke="#b91c1c" stroke-width="2" opacity="0.9">
    <line x1="90" y1="50" x2="90" y2="70"/><line x1="110" y1="40" x2="110" y2="70"/><line x1="130" y1="45" x2="130" y2="70"/>
    <line x1="670" y1="50" x2="670" y2="70"/><line x1="690" y1="40" x2="690" y2="70"/><line x1="710" y1="45" x2="710" y2="70"/>
    <line x1="90" y1="530" x2="90" y2="560"/><line x1="110" y1="530" x2="110" y2="570"/><line x1="130" y1="530" x2="130" y2="555"/>
    <line x1="670" y1="530" x2="670" y2="560"/><line x1="690" y1="530" x2="690" y2="570"/><line x1="710" y1="530" x2="710" y2="555"/>
  </g>

  <!-- Main Excavation Pit Slopes (Cleaned & Graded) -->
  <polygon points="120,130 680,130 730,470 70,470" fill="#292524"/>
  <polygon points="150,160 650,160 690,440 110,440" fill="#44403c" stroke="#78716c" stroke-width="2"/>

  <!-- EXPOSED DRY PIT FOUNDATION (COMPLETELY DEWATERED) -->
  <path d="M 160,200 Q 400,180 640,205 Q 675,320 660,420 Q 400,445 135,420 Q 120,310 160,200 Z" fill="url(#dryBedrock)"/>
  <path d="M 160,200 Q 400,180 640,205 Q 675,320 660,420 Q 400,445 135,420 Q 120,310 160,200 Z" fill="url(#cleanGravel)" opacity="0.6"/>

  <!-- Dry Drainage Trenches (Engineered Runoff Channels) -->
  <g stroke="#0f172a" stroke-width="4" fill="none" opacity="0.7">
    <path d="M220,220 L350,310 L580,240"/>
    <path d="M350,310 L380,410"/>
    <path d="M480,270 L540,390"/>
  </g>

  <!-- Bio-Larvicide Chalk Boundary & Treatment Proof Markers -->
  <g stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 4" fill="none" opacity="0.9">
    <ellipse cx="400" cy="310" rx="220" ry="100"/>
  </g>
  <text x="320" y="320" font-family="monospace" font-size="12" font-weight="bold" fill="#0284c7" letter-spacing="1">
    ✓ TREATED: Bti BARRIER APPLIED
  </text>

  <!-- Heavy Duty Sump Drainage Grate Installed at Lowest Elevation Point -->
  <rect x="360" y="380" width="80" height="35" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <line x1="375" y1="380" x2="375" y2="415" stroke="#38bdf8" stroke-width="2"/>
  <line x1="390" y1="380" x2="390" y2="415" stroke="#38bdf8" stroke-width="2"/>
  <line x1="405" y1="380" x2="405" y2="415" stroke="#38bdf8" stroke-width="2"/>
  <line x1="420" y1="380" x2="420" y2="415" stroke="#38bdf8" stroke-width="2"/>

  <!-- High-Visibility Protective Perimeter Barrier (Remediated) -->
  <path d="M60,110 Q400,130 740,110" stroke="#f97316" stroke-width="6" stroke-dasharray="16 8" fill="none"/>

  <!-- Verified Stamp Badge Watermark in SVG -->
  <g transform="translate(560, 480)">
    <rect width="180" height="42" rx="6" fill="#052e16" stroke="#10b981" stroke-width="2"/>
    <text x="90" y="18" font-family="sans-serif" font-size="10" font-weight="900" fill="#34d399" text-anchor="middle">
      VECTORGUARD VERIFIED
    </text>
    <text x="90" y="32" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">
      WATER EVACUATED (0L)
    </text>
  </g>

  <!-- Optical Vignette -->
  <rect width="800" height="600" fill="none" stroke="#000" stroke-width="20" opacity="0.3"/>
</svg>
`);

// 3. Hero Hotspot VG-1042 INTERVENTION (Suction Pump Active Dewatering in Progress)
export const SVG_VG1042_INTERVENTION = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="groundInt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a3728"/>
      <stop offset="100%" stop-color="#2a1d14"/>
    </linearGradient>
    <linearGradient id="waterDraining" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d4a3e"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#groundInt)"/>
  
  <!-- Foundation Sump Outline -->
  <polygon points="120,130 680,130 730,470 70,470" fill="#1e150f"/>
  <polygon points="150,160 650,160 690,440 110,440" fill="#120c08"/>

  <!-- Water Level Dropping Fast -->
  <ellipse cx="400" cy="330" rx="200" ry="70" fill="url(#waterDraining)" opacity="0.85"/>

  <!-- Heavy-Duty Portable Dewatering Pump Unit on Bank -->
  <g transform="translate(130, 240)">
    <!-- Pump Chassis -->
    <rect width="90" height="60" rx="6" fill="#dc2626" stroke="#450a0a" stroke-width="2"/>
    <rect x="10" y="10" width="30" height="40" rx="2" fill="#1e293b"/>
    <circle cx="65" cy="30" r="14" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>
    <!-- Exhaust & Vibration Lines -->
    <line x1="25" y1="5" x2="25" y2="0" stroke="#64748b" stroke-width="4"/>
    <text x="45" y="55" font-family="monospace" font-size="8" fill="#fff" font-weight="bold" text-anchor="middle">RIT-3 PUMP</text>
  </g>

  <!-- Heavy Corrugated Suction Hose into Water Pit -->
  <path d="M220,270 Q300,290 350,330" stroke="#facc15" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M220,270 Q300,290 350,330" stroke="#000" stroke-width="2" stroke-dasharray="6 6" fill="none"/>

  <!-- Water Vortex at Suction Head -->
  <g transform="translate(350, 330)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8 4"/>
    <circle cx="0" cy="0" r="8" fill="#0284c7"/>
    <text x="0" y="32" font-family="monospace" font-size="9" font-weight="bold" fill="#38bdf8" text-anchor="middle">SUCTION: 1200 LPM</text>
  </g>

  <!-- Discharge Hose going up and out -->
  <path d="M130,280 Q60,290 0,310" stroke="#0284c7" stroke-width="10" stroke-linecap="round" fill="none"/>

  <!-- Field Officer in Safety Gear (High-Vis Vest) Clearing Debris -->
  <g transform="translate(560, 220)">
    <!-- Head / Safety Helmet -->
    <ellipse cx="20" cy="0" rx="9" ry="8" fill="#facc15"/>
    <!-- Body / Safety Vest -->
    <polygon points="8,10 32,10 36,45 4,45" fill="#f97316"/>
    <!-- Reflective Stripes -->
    <line x1="12" y1="20" x2="28" y2="20" stroke="#fff" stroke-width="2.5"/>
    <line x1="10" y1="32" x2="30" y2="32" stroke="#fff" stroke-width="2.5"/>
    <!-- Rake / Debris Tool -->
    <line x1="10" y1="25" x2="-40" y2="70" stroke="#e2e8f0" stroke-width="3"/>
    <polygon points="-45,65 -35,75 -50,85 -60,75" fill="#94a3b8"/>
  </g>

  <!-- Active Intervention Banner -->
  <g transform="translate(240, 60)">
    <rect width="320" height="36" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
    <text x="160" y="22" font-family="monospace" font-size="12" font-weight="900" fill="#fbbf24" text-anchor="middle">
      STAGE 2: RAPID DEWATERING & REMEDIATION
    </text>
  </g>
</svg>
`);

// 4. Blocked Stormwater Culvert vs Cleared
export const SVG_CULVERT_BEFORE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#334155"/>
  <rect x="150" y="200" width="500" height="260" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
  <ellipse cx="400" cy="330" rx="200" ry="80" fill="#0f172a"/>
  <!-- Blocked Silt & Trash -->
  <path d="M220,320 Q400,380 580,310 L580,440 L220,440 Z" fill="#451a03"/>
  <circle cx="340" cy="360" r="22" fill="#713f12"/>
  <circle cx="450" cy="370" r="18" fill="#166534"/>
  <rect x="290" y="340" width="40" height="20" fill="#dc2626" rx="2"/>
  <!-- Blackwater Retention -->
  <ellipse cx="400" cy="310" rx="140" ry="35" fill="#1e3a2f" opacity="0.9"/>
  <text x="400" y="150" font-family="monospace" font-size="16" font-weight="bold" fill="#ef4444" text-anchor="middle">
    CLOGGED ARTERIAL CULVERT — BLACKWATER STAGNATION
  </text>
</svg>
`);

export const SVG_CULVERT_AFTER = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#334155"/>
  <rect x="150" y="200" width="500" height="260" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="4"/>
  <ellipse cx="400" cy="330" rx="200" ry="80" fill="#0f172a"/>
  <!-- Clean Silt-Free Dry Invert -->
  <path d="M220,350 Q400,370 580,350 L580,440 L220,440 Z" fill="#64748b"/>
  <!-- Flowing Free Low-Volume Clean Channel -->
  <line x1="200" y1="360" x2="600" y2="360" stroke="#0ea5e9" stroke-width="6" stroke-dasharray="16 8"/>
  <text x="400" y="150" font-family="monospace" font-size="16" font-weight="bold" fill="#10b981" text-anchor="middle">
    DE-SILTED & DESCALED CULVERT — FLOW RESTORED ✓
  </text>
</svg>
`);

// Master image map with instant zero-latency SVGs as robust reliable source & fallbacks
export const DEMO_EVIDENCE_IMAGES = {
  // Hero Hotspot VG-1042 (Hyderabad - Construction Excavation Pit)
  vg1042_before: SVG_VG1042_BEFORE,
  vg1042_intervention: SVG_VG1042_INTERVENTION,
  vg1042_after: SVG_VG1042_AFTER,

  // Remote Photographic High-Res Alternatives (fallback to SVGs on error)
  vg1042_before_photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=1200&q=80',
  vg1042_after_photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',

  // Stormwater Drain Culvert Clogged vs Cleared
  vg1018_before: SVG_CULVERT_BEFORE,
  vg1018_after: SVG_CULVERT_AFTER,
  drain_blocked_before: SVG_CULVERT_BEFORE,
  drain_cleared_after: SVG_CULVERT_AFTER,

  // Generic Roadside Drainage / Urban Runoff
  generic_drain_before: SVG_VG1042_BEFORE,
  generic_drain_after: SVG_VG1042_AFTER,

  // Low-lying Vacant Plot / Wetland Accumulation
  generic_plot_before: SVG_VG1042_BEFORE,
  generic_plot_after: SVG_VG1042_AFTER,

  // Multi-Angle Evidence Items for Hero Hotspot VG-1042
  additional_angles: [
    {
      id: 'angle-1',
      title: 'Drone Overhead (Before)',
      category: 'BEFORE',
      imageUrl: SVG_VG1042_BEFORE,
      caption: 'Targeted drone survey showing active stagnant water accumulation in 120 sq.m excavation pit',
      coordinates: '17.4156° N, 78.4352° E',
      timestamp: '2026-09-08 06:45 IST'
    },
    {
      id: 'angle-2',
      title: 'Field Level Inspection (Before)',
      category: 'BEFORE',
      imageUrl: SVG_VG1042_BEFORE,
      caption: 'Ground-level validation of murky standing water with plastic debris and foundation sump',
      coordinates: '17.4155° N, 78.4350° E',
      timestamp: '2026-09-08 06:49 IST'
    },
    {
      id: 'angle-3',
      title: 'Active Dewatering (Intervention)',
      category: 'TREATMENT',
      imageUrl: SVG_VG1042_INTERVENTION,
      caption: 'Rapid Intervention Team 3 dewatering pump deployed with 1200 LPM discharge rate',
      coordinates: '17.4156° N, 78.4352° E',
      timestamp: '2026-09-08 09:15 IST'
    },
    {
      id: 'angle-4',
      title: 'Post-Remediation Dry Site (After)',
      category: 'AFTER',
      imageUrl: SVG_VG1042_AFTER,
      caption: 'Excavation footing completely dewatered, dry foundation gravel layer and larvicide barrier verified',
      coordinates: '17.4156° N, 78.4352° E',
      timestamp: '2026-09-08 11:30 IST'
    },
    {
      id: 'angle-5',
      title: 'Biological Barrier (Treatment Proof)',
      category: 'TREATMENT',
      imageUrl: SVG_VG1042_AFTER,
      caption: 'Bti microbial larvicide granules applied along perimeter foundation sumps',
      coordinates: '17.4156° N, 78.4353° E',
      timestamp: '2026-09-08 11:45 IST'
    }
  ] as AdditionalAngleEvidence[]
};
