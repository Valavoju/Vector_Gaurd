import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  Globe2, 
  Compass,
  AlertTriangle,
  Info,
  CheckCircle2,
  Send,
  Sparkles,
  Share2,
  Star,
  Layers,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Thermometer,
  Droplets,
  Camera,
  ShieldCheck,
  Building2,
  Check,
  Download,
  Leaf,
  Navigation,
  Crosshair,
  Satellite,
  Waves,
  Activity,
  Radio,
  MoreVertical,
  Maximize2,
  Mountain,
  Plus,
  Minus,
  Eye,
  Clock,
  CheckSquare,
  ClipboardList,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  History,
  X,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HotspotRecord } from '../../types';
import { DownloadReportButton } from '../common/DownloadReportButton';
import { 
  ALL_INDIAN_STATES_AND_UTS, 
  HYDERABAD_WARD_BOUNDARIES, 
  HYDERABAD_WATER_BODIES, 
  HYDERABAD_ROAD_NETWORK, 
  HYDERABAD_BUILDING_MASSING, 
  HYDERABAD_DRAINAGE_VECTORS,
  HYDERABAD_CONSTRUCTION_ZONES,
  getCompleteHotspotsDataset
} from '../../data/indiaGeoData';
import { 
  SVG_VG1042_BEFORE, 
  SVG_VG1042_AFTER,
  SVG_VG1042_INTERVENTION,
  SVG_CULVERT_BEFORE,
  SVG_CULVERT_AFTER,
  DEMO_EVIDENCE_IMAGES
} from '../../data/evidenceImages';
import { fetchLocationWeather, WeatherTelemetry } from '../../services/weatherService';

type BasemapStyle = 'SATELLITE' | 'HYBRID' | 'TERRAIN' | 'TOPO' | 'DARK';
type GeoHierarchyLevel = 'INDIA' | 'STATE' | 'CITY';
type RightPanelTab = 'OVERVIEW' | 'RISK_FACTORS' | 'EVIDENCE' | 'TASK_HISTORY';

export const RiskMap: React.FC = () => {
  const { 
    hotspots: rawHotspots, 
    tasks,
    selectedHotspotId, 
    setSelectedHotspotId, 
    setDispatchModalHotspotId,
    setSelectedDetailHotspotId,
    setActiveView,
    demoStep
  } = useApp();

  // Full hotspots dataset with all 28 states & 8 UTs
  const hotspots = useMemo(() => getCompleteHotspotsDataset(rawHotspots), [rawHotspots]);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Geographic Hierarchy State
  const [geoLevel, setGeoLevel] = useState<GeoHierarchyLevel>('INDIA');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map Controls State
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('TERRAIN');
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [rightTab, setRightTab] = useState<RightPanelTab>('OVERVIEW');
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);
  const [isMobileFiltersExpanded, setIsMobileFiltersExpanded] = useState<boolean>(false);

  // Active filters count for mobile indicator
  const activeFiltersCount = (selectedState !== 'ALL' ? 1 : 0) + 
    (selectedCity !== 'ALL' ? 1 : 0) + 
    (selectedRisk !== 'ALL' ? 1 : 0) + 
    (selectedStatus !== 'ALL' ? 1 : 0);

  // Weather Telemetry State for Selected Hotspot
  const [weatherData, setWeatherData] = useState<WeatherTelemetry | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // Basemap Tile Providers
  const BASEMAPS: Record<BasemapStyle, { name: string; url: string; subdomains?: string; labelsUrl?: string; maxZoom: number; attribution: string }> = {
    TERRAIN: {
      name: 'Terrain',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 20,
      attribution: 'Esri World Topographic'
    },
    SATELLITE: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 20,
      attribution: 'Esri World Imagery'
    },
    HYBRID: {
      name: 'Hybrid',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labelsUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      maxZoom: 20,
      attribution: 'Esri & CARTO'
    },
    TOPO: {
      name: 'Topo',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 18,
      attribution: 'OpenTopoMap'
    },
    DARK: {
      name: 'Dark GIS',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      maxZoom: 20,
      attribution: 'CARTO Dark Matter'
    }
  };

  // State & City Hierarchy data
  const availableCitiesForState = useMemo(() => {
    if (selectedState === 'ALL') {
      const allCities: string[] = [];
      ALL_INDIAN_STATES_AND_UTS.forEach(s => {
        s.cities.forEach(c => allCities.push(c.name));
      });
      return Array.from(new Set(allCities)).sort();
    }
    const stateObj = ALL_INDIAN_STATES_AND_UTS.find(s => s.name === selectedState);
    if (!stateObj) return [];
    return stateObj.cities.map(c => c.name).sort();
  }, [selectedState]);

  // Current Active Hotspot (Default to hero VG-1042)
  const currentHotspotId = selectedHotspotId || 'VG-1042';
  const currentHotspot = useMemo(() => {
    return hotspots.find(h => h.hotspot_id === currentHotspotId) || hotspots[0] || {
      hotspot_id: 'VG-1042',
      location: 'Banjara Hills, Road No. 12',
      ward: 'Ward 12 (Banjara Hills / Jubilee Hills)',
      city: 'Hyderabad',
      state: 'Telangana',
      site_type: 'Construction Site',
      breeding_risk_score: 82,
      risk_level: 'CRITICAL',
      status: 'ACTIVE',
      latitude: 17.4156,
      longitude: 78.4352,
      ai_explanation: 'Recent rainfall of 42 mm, poor drainage, active construction pit and historical stagnation indicate elevated water-retention risk.',
      visual_score: 90,
      water_retention_prediction: 82,
      environmental_score: 75,
      historical_risk: 70
    };
  }, [hotspots, currentHotspotId]);

  // Fetch weather data when selected hotspot changes
  useEffect(() => {
    let isMounted = true;
    setIsWeatherLoading(true);

    fetchLocationWeather(
      currentHotspot.latitude, 
      currentHotspot.longitude, 
      `${currentHotspot.ward || currentHotspot.location}, ${currentHotspot.city}`
    ).then(data => {
      if (isMounted) {
        setWeatherData(data);
        setIsWeatherLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsWeatherLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentHotspot.latitude, currentHotspot.longitude, currentHotspot.city, currentHotspot.ward, currentHotspot.location]);

  // Filtered Hotspots based on top bar search & dropdowns
  const filteredHotspots = useMemo(() => {
    return hotspots.filter(h => {
      const state = h.state || 'Telangana';
      const city = h.city || 'Hyderabad';
      const ward = h.ward || '';
      const id = h.hotspot_id || '';
      const loc = h.location || '';

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        id.toLowerCase().includes(query) ||
        loc.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query) ||
        state.toLowerCase().includes(query) ||
        ward.toLowerCase().includes(query);

      const matchesState = selectedState === 'ALL' || state === selectedState;
      const matchesCity = selectedCity === 'ALL' || city === selectedCity;
      const matchesRisk = selectedRisk === 'ALL' || h.risk_level === selectedRisk;
      const matchesStatus = selectedStatus === 'ALL' || h.status === selectedStatus;

      return matchesSearch && matchesState && matchesCity && matchesRisk && matchesStatus;
    });
  }, [hotspots, searchQuery, selectedState, selectedCity, selectedRisk, selectedStatus]);

  // Statistics for Legend
  const criticalCount = useMemo(() => hotspots.filter(h => h.risk_level === 'CRITICAL').length || 13, [hotspots]);
  const highCount = useMemo(() => hotspots.filter(h => h.risk_level === 'HIGH').length || 29, [hotspots]);
  const moderateCount = useMemo(() => hotspots.filter(h => h.risk_level === 'MODERATE').length || 14, [hotspots]);
  const lowCount = useMemo(() => hotspots.filter(h => h.risk_level === 'LOW').length || 9, [hotspots]);
  const totalCount = hotspots.length || 65;

  // Zoom handlers
  const handleZoomIndia = () => {
    setSelectedState('ALL');
    setSelectedCity('ALL');
    setGeoLevel('INDIA');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.5000, 79.5000], 5, { animate: true });
    }
  };

  const handleZoomState = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity('ALL');
    setGeoLevel('STATE');

    const stateObj = ALL_INDIAN_STATES_AND_UTS.find(s => s.name === stateName);
    if (stateObj && mapInstanceRef.current) {
      mapInstanceRef.current.setView([stateObj.lat, stateObj.lng], stateObj.zoom || 8, { animate: true });
    }
  };

  const handleZoomCity = (cityName: string) => {
    setSelectedCity(cityName);
    setGeoLevel('CITY');

    let cityFound = false;
    for (const stateObj of ALL_INDIAN_STATES_AND_UTS) {
      const cityObj = stateObj.cities.find(c => c.name === cityName);
      if (cityObj && mapInstanceRef.current) {
        setSelectedState(stateObj.name);
        mapInstanceRef.current.setView([cityObj.lat, cityObj.lng], cityObj.zoom || 14, { animate: true });
        cityFound = true;
        break;
      }
    }

    if (!cityFound) {
      const h = hotspots.find(item => item.city === cityName);
      if (h && mapInstanceRef.current) {
        mapInstanceRef.current.setView([h.latitude, h.longitude], 14, { animate: true });
      }
    }
  };

  // Basemap switcher
  const handleBasemapChange = (style: BasemapStyle) => {
    setBasemapStyle(style);
    if (!mapInstanceRef.current) return;

    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }
    if (labelsTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(labelsTileLayerRef.current);
      labelsTileLayerRef.current = null;
    }

    const config = BASEMAPS[style];
    baseTileLayerRef.current = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
      attribution: config.attribution
    }).addTo(mapInstanceRef.current);

    if (config.labelsUrl) {
      labelsTileLayerRef.current = L.tileLayer(config.labelsUrl, {
        maxZoom: config.maxZoom,
        subdomains: 'abcd',
        pane: 'overlayPane'
      }).addTo(mapInstanceRef.current);
    }
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = currentHotspot ? currentHotspot.latitude : 17.4156;
    const initialLng = currentHotspot ? currentHotspot.longitude : 78.4350;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    const config = BASEMAPS[basemapStyle];
    baseTileLayerRef.current = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
      attribution: config.attribution
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Markers & Teardrop GPS Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    filteredHotspots.forEach(hotspot => {
      const isSelected = hotspot.hotspot_id === currentHotspotId;
      const isHero = hotspot.hotspot_id === 'VG-1042';

      let pinColor = '#22c55e'; // LOW - green
      if (hotspot.risk_level === 'CRITICAL') pinColor = '#ef4444'; // CRITICAL - red
      else if (hotspot.risk_level === 'HIGH') pinColor = '#f97316'; // HIGH - orange
      else if (hotspot.risk_level === 'MODERATE') pinColor = '#eab308'; // MODERATE - yellow

      const iconHtml = `
        <div class="relative cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
          ${isSelected ? `
            <div class="absolute -inset-2.5 rounded-full animate-ping opacity-40 pointer-events-none" style="background-color: ${pinColor}"></div>
            <div class="absolute -inset-1.5 rounded-full opacity-60 pointer-events-none" style="background-color: ${pinColor}"></div>
          ` : ''}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="${isSelected ? '32' : '26'}" height="${isSelected ? '40' : '34'}" class="drop-shadow-md">
            <path d="M12 0 C5.373 0 0 5.373 0 12 C0 21 12 32 12 32 C12 32 24 21 24 12 C24 5.373 18.627 0 12 0 Z" fill="${pinColor}" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="11" r="5" fill="#ffffff" />
            <text x="12" y="13.5" font-size="7" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#0f172a">
              ${hotspot.breeding_risk_score}
            </text>
          </svg>
          <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-sm pointer-events-none border border-slate-700/80">
            ${hotspot.hotspot_id}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-gps-pin',
        iconSize: [isSelected ? 32 : 26, isSelected ? 40 : 34],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 40 : 34]
      });

      const marker = L.marker([hotspot.latitude, hotspot.longitude], { icon: customIcon });
      marker.on('click', () => {
        setSelectedHotspotId(hotspot.hotspot_id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([hotspot.latitude, hotspot.longitude], 16, { animate: true });
        }
      });

      marker.addTo(markersGroupRef.current!);
    });
  }, [filteredHotspots, currentHotspotId, setSelectedHotspotId]);

  return (
    <div className="w-full h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-800 flex flex-col overflow-hidden relative select-none">
      
      {/* ========================================================================= */}
      {/* TOP SEARCH & FILTER BAR (Desktop Row + Mobile Stacked Layout) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 z-20 shrink-0 shadow-2xs">
        
        {/* DESKTOP FILTER BAR (lg and above: exact approved layout) */}
        <div className="hidden lg:flex items-center justify-between gap-3">
          {/* Left Search & Dropdown Filters */}
          <div className="flex items-center gap-2.5 flex-1 flex-wrap">
            
            {/* Search Input */}
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, state, hotspot ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans shadow-2xs"
              />
            </div>

            {/* State Select */}
            <select
              value={selectedState}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'ALL') handleZoomIndia();
                else handleZoomState(val);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs font-medium cursor-pointer"
            >
              <option value="ALL">All States & UTs</option>
              {ALL_INDIAN_STATES_AND_UTS.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* City Select */}
            <select
              value={selectedCity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'ALL') {
                  if (selectedState !== 'ALL') handleZoomState(selectedState);
                  else handleZoomIndia();
                } else {
                  handleZoomCity(val);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs font-medium cursor-pointer"
            >
              <option value="ALL">All Cities</option>
              {availableCitiesForState.map(cityName => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>

            {/* Risk Level Select */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs font-medium cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (81–100)</option>
              <option value="HIGH">High (61–80)</option>
              <option value="MODERATE">Moderate (31–60)</option>
              <option value="LOW">Low (0–30)</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Stagnation</option>
              <option value="INSPECTED">Inspected</option>
              <option value="VERIFIED">Verified</option>
              <option value="RESOLVED">Resolved</option>
            </select>

          </div>

          {/* Right Hierarchy Scale Toggle Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleZoomIndia}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                geoLevel === 'INDIA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              India View
            </button>
            
            <button
              onClick={() => handleZoomState('Telangana')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                geoLevel === 'STATE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              State View
            </button>

            <button
              onClick={() => handleZoomCity('Hyderabad')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                geoLevel === 'CITY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              City View
            </button>
          </div>
        </div>

        {/* MOBILE FILTER BAR (< lg: fully responsive stacked controls) */}
        <div className="lg:hidden flex flex-col gap-2.5">
          {/* Row 1: Search + Filter Toggle Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, state, hotspot ID..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-sans shadow-2xs"
              />
            </div>

            <button
              id="mobile-toggle-filters-btn"
              onClick={() => setIsMobileFiltersExpanded(!isMobileFiltersExpanded)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border shrink-0 ${
                isMobileFiltersExpanded || activeFiltersCount > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Row 2: Responsive India / State / City View Controls (Horizontal Scroll without page overflow) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              onClick={handleZoomIndia}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                geoLevel === 'INDIA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              India View
            </button>
            
            <button
              onClick={() => handleZoomState('Telangana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                geoLevel === 'STATE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              State View
            </button>

            <button
              onClick={() => handleZoomCity('Hyderabad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                geoLevel === 'CITY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              City View
            </button>
          </div>

          {/* Row 3: Mobile Stacked Filters (Expanded) */}
          {isMobileFiltersExpanded && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
              {/* All States & UTs */}
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'ALL') handleZoomIndia();
                    else handleZoomState(val);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="ALL">All States & UTs</option>
                  {ALL_INDIAN_STATES_AND_UTS.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* All Cities */}
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'ALL') {
                      if (selectedState !== 'ALL') handleZoomState(selectedState);
                      else handleZoomIndia();
                    } else {
                      handleZoomCity(val);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="ALL">All Cities</option>
                  {availableCitiesForState.map(cityName => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                  ))}
                </select>
              </div>

              {/* All Risk Levels */}
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Level</label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="CRITICAL">Critical (81–100)</option>
                  <option value="HIGH">High (61–80)</option>
                  <option value="MODERATE">Moderate (31–60)</option>
                  <option value="LOW">Low (0–30)</option>
                </select>
              </div>

              {/* All Statuses */}
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Stagnation</option>
                  <option value="INSPECTED">Inspected</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MAIN BODY: CENTER GIS MAP + RIGHT INTEL PANEL */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ======================================================================= */}
        {/* CENTER GIS MAP CANVAS */}
        {/* ======================================================================= */}
        <div className="flex-1 h-full relative overflow-hidden bg-slate-900">
          
          {/* 1. Floating Basemap Selector (Top-Left of Map Canvas) */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 bg-slate-900/90 text-white p-1 rounded-xl flex items-center gap-1 border border-slate-700/80 shadow-lg backdrop-blur-xs text-xs overflow-x-auto no-scrollbar">
            {(['SATELLITE', 'HYBRID', 'TERRAIN', 'TOPO', 'DARK'] as BasemapStyle[]).map(style => (
              <button
                key={style}
                onClick={() => handleBasemapChange(style)}
                className={`px-3 py-1 rounded-lg font-medium text-xs transition capitalize whitespace-nowrap shrink-0 ${
                  basemapStyle === style
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {style === 'DARK' ? 'Dark GIS' : style.toLowerCase()}
              </button>
            ))}
          </div>

          {/* 2. Floating Risk Level Legend (Bottom-Left of Map Canvas) */}
          <div className="absolute bottom-20 lg:bottom-4 left-3 lg:left-4 z-10 bg-slate-900/90 text-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xs text-xs w-48 sm:w-52 space-y-2 select-none">
            <div 
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
              className="flex items-center justify-between font-bold text-xs cursor-pointer text-slate-200"
            >
              <span>Risk Level</span>
              {isLegendExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </div>

            {isLegendExpanded && (
              <div className="space-y-1.5 pt-1 text-slate-300 font-sans">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>Critical (81–100)</span>
                  </div>
                  <span className="font-bold text-white">{criticalCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                    <span>High (61–80)</span>
                  </div>
                  <span className="font-bold text-white">{highCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span>Moderate (31–60)</span>
                  </div>
                  <span className="font-bold text-white">{moderateCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Low (0–30)</span>
                  </div>
                  <span className="font-bold text-white">{lowCount}</span>
                </div>

                <div className="border-t border-slate-700/80 pt-1.5 flex items-center justify-between font-bold text-white text-xs">
                  <span>Total Hotspots</span>
                  <span className="text-blue-400">{totalCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Floating Scale & North Indicator (Bottom-Right of Map Canvas) */}
          <div className="absolute bottom-20 lg:bottom-4 right-3 lg:right-4 z-10 bg-slate-900/80 text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 shadow-md backdrop-blur-xs text-[10px] font-mono flex items-center gap-2 sm:gap-3 pointer-events-none">
            <div className="flex items-center gap-1 font-bold text-slate-300">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>N</span>
            </div>
            <div className="text-slate-400">
              0 &nbsp; 250 &nbsp; 500 km
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="w-full h-full relative z-0" />

        </div>

        {/* ======================================================================= */}
        {/* RIGHT HOTSPOT INTELLIGENCE PANEL (Desktop Aside Layout) */}
        {/* ======================================================================= */}
        <div className="hidden lg:flex w-[400px] xl:w-[420px] bg-white border-l border-slate-200 flex-col justify-between shrink-0 h-full overflow-hidden z-20 shadow-xs text-xs">
          
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            
            {/* 1. Header: Risk Badge + Hotspot ID + Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider text-white ${
                  currentHotspot.risk_level === 'CRITICAL' ? 'bg-red-600' :
                  currentHotspot.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                }`}>
                  {currentHotspot.risk_level}
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  Hotspot ID: {currentHotspot.hotspot_id}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition cursor-pointer"
                  title="Bookmark Hotspot"
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Hotspot Title & Location Subtitle */}
            <div className="space-y-0.5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {currentHotspot.hotspot_id}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold">{currentHotspot.ward || 'Ward 12 (Banjara Hills / Jubilee Hills)'}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium ml-5">
                {currentHotspot.location || 'Banjara Hills / Jubilee Hills'}, {currentHotspot.city || 'Hyderabad'}, {currentHotspot.state || 'Telangana'}
              </div>
              <div className="text-xs text-slate-600 font-medium pt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentHotspot.site_type || 'Construction Site'}</span>
              </div>
            </div>

            {/* 3. Breeding Risk Score + Drone Evidence Thumbnail */}
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-red-600 leading-none">
                    {currentHotspot.breeding_risk_score}
                  </span>
                  <span className="text-sm font-medium text-slate-400">/ 100</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1">
                  <span>Breeding Risk Score</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Drone Thumbnail */}
              <div 
                onClick={() => setSelectedDetailHotspotId(currentHotspot.hotspot_id)}
                className="w-36 h-20 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900 cursor-pointer group shadow-2xs"
                title="Click to view full high-resolution evidence"
              >
                <img 
                  src={SVG_VG1042_BEFORE} 
                  alt="Drone Stagnation Survey" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-1.5 text-[9px] font-sans font-semibold text-white">
                  <span>Image: Drone (Recent)</span>
                  <Maximize2 className="w-3 h-3 text-white/80 group-hover:text-white" />
                </div>
              </div>
            </div>

            {/* 4. Four Horizontal Tabs: Overview | Risk Factors | Evidence | Task History */}
            <div className="flex items-center border-b border-slate-200 gap-4 text-xs font-medium pt-1">
              {(['OVERVIEW', 'RISK_FACTORS', 'EVIDENCE', 'TASK_HISTORY'] as RightPanelTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`pb-2 transition capitalize whitespace-nowrap cursor-pointer ${
                    rightTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab === 'OVERVIEW' ? 'Overview' :
                   tab === 'RISK_FACTORS' ? 'Risk Factors' :
                   tab === 'EVIDENCE' ? 'Evidence' : 'Task History'}
                </button>
              ))}
            </div>

            {/* 5. TAB CONTENT: OVERVIEW */}
            {rightTab === 'OVERVIEW' && (
              <div className="space-y-3 pt-1">
                
                {/* AI Risk Explanation (Purple Box) */}
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950 space-y-1">
                  <div className="font-bold text-purple-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Risk Explanation</span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed font-sans">
                    {currentHotspot.ai_explanation || 'Recent rainfall of 42 mm, poor drainage, active construction pit and historical stagnation indicate elevated water-retention risk. Targeted drone imagery was used for visual verification.'}
                  </p>
                </div>

                {/* Two-Column Grid: Key Information vs Recommended Action */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  
                  {/* Column 1: Key Information */}
                  <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800 text-xs">
                      Key Information
                    </div>
                    <div className="space-y-1.5 text-[11px] text-slate-600 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Rainfall (Recent):</span>
                        <strong className="text-slate-900 font-semibold">{weatherData?.current.rainfallRecent48h || 42} mm</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Temperature:</span>
                        <strong className="text-slate-900 font-semibold">{weatherData?.current.temperature || 28.5} °C</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Humidity:</span>
                        <strong className="text-slate-900 font-semibold">{weatherData?.current.humidity || 84} %</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Elevation:</span>
                        <strong className="text-slate-900 font-semibold">542 m</strong>
                      </div>
                      <div className="flex flex-col pt-0.5 text-[10px] text-slate-500 border-t border-slate-200/60">
                        <span>Coordinates:</span>
                        <strong className="text-slate-700 font-mono text-[10px]">{currentHotspot.latitude.toFixed(4)}° N, {currentHotspot.longitude.toFixed(4)}° E</strong>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Recommended Action */}
                  <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800 text-xs">
                      Recommended Action
                    </div>
                    <div className="space-y-1.5 text-[11px] text-slate-700 font-sans">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Remove standing water</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Clear debris</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Improve drainage</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Anti-larval treatment</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Monitor recurrence</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT: RISK FACTORS */}
            {rightTab === 'RISK_FACTORS' && (
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-800">Risk Formula Weighting Breakdown</div>
                  
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Visual Stagnation (40% weight)</span>
                        <strong className="text-red-600 font-bold">{currentHotspot.visual_score || 90} / 100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${currentHotspot.visual_score || 90}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Water Retention Prediction (25% weight)</span>
                        <strong className="text-blue-600 font-bold">{currentHotspot.water_retention_prediction || 82} / 100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${currentHotspot.water_retention_prediction || 82}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Environmental Suitability (20% weight)</span>
                        <strong className="text-amber-600 font-bold">{currentHotspot.environmental_score || 75} / 100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentHotspot.environmental_score || 75}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Historical Recurrence (15% weight)</span>
                        <strong className="text-purple-600 font-bold">{currentHotspot.historical_risk || 70} / 100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${currentHotspot.historical_risk || 70}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs">
                    <span>Computed Breeding Risk Score</span>
                    <span className="text-red-600">{currentHotspot.breeding_risk_score} / 100</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: EVIDENCE */}
            {rightTab === 'EVIDENCE' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <div 
                    onClick={() => setSelectedDetailHotspotId(currentHotspot.hotspot_id)}
                    className="rounded-xl overflow-hidden border border-slate-200 cursor-pointer group bg-slate-100"
                  >
                    <img src={SVG_VG1042_BEFORE} alt="Aerial Stagnation" className="w-full h-24 object-cover group-hover:scale-105 transition" />
                    <div className="p-2 text-[10px] bg-white">
                      <div className="font-bold text-slate-900">Drone Survey (Before)</div>
                      <div className="text-slate-500">120 sq.m Pit</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedDetailHotspotId(currentHotspot.hotspot_id)}
                    className="rounded-xl overflow-hidden border border-slate-200 cursor-pointer group bg-slate-100"
                  >
                    <img src={SVG_VG1042_INTERVENTION} alt="Dewatering Pump Intervention" className="w-full h-24 object-cover group-hover:scale-105 transition" />
                    <div className="p-2 text-[10px] bg-white">
                      <div className="font-bold text-slate-900">Intervention Dewatering</div>
                      <div className="text-slate-500">1200 LPM Pump</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TASK HISTORY */}
            {rightTab === 'TASK_HISTORY' && (
              <div className="space-y-2 pt-1 text-xs">
                {tasks.filter(t => t.hotspot_id === currentHotspot.hotspot_id).length > 0 ? (
                  tasks.filter(t => t.hotspot_id === currentHotspot.hotspot_id).map(t => (
                    <div key={t.task_id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{t.task_id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">{t.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">Assigned: {t.assigned_team} ({t.assigned_officer})</div>
                      <div className="text-[10px] text-slate-500">Action: {t.recommended_action}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                    No prior remediation tasks dispatched for this site yet.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Action Buttons */}
          <div className="p-4 border-t border-slate-200 bg-white flex flex-col gap-2.5 shrink-0">
            <DownloadReportButton
              hotspot={currentHotspot}
              variant="primary"
              buttonId="right-panel-download-report-btn"
              className="w-full justify-center py-2"
            />

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="right-panel-dispatch-task-btn"
                onClick={() => setDispatchModalHotspotId(currentHotspot.hotspot_id)}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-95"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Dispatch Task</span>
              </button>

              <button
                id="right-panel-view-hotspots-btn"
                onClick={() => setActiveView('HOTSPOTS')}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <span>View Hotspots</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* MOBILE BOTTOM FLOATING BAR (Collapsed Summary) */}
        {/* ======================================================================= */}
        <div className="lg:hidden absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3 flex items-center justify-between gap-2">
          <div 
            className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
            onClick={() => setIsMobilePanelOpen(true)}
          >
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white shrink-0 ${
              currentHotspot.risk_level === 'CRITICAL' ? 'bg-red-600' :
              currentHotspot.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
            }`}>
              {currentHotspot.risk_level}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate font-mono">
                {currentHotspot.hotspot_id} — {currentHotspot.breeding_risk_score}/100
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentHotspot.ward || currentHotspot.location}
              </div>
            </div>
          </div>
          <button
            id="mobile-open-intel-btn"
            onClick={() => setIsMobilePanelOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm active:scale-95 transition cursor-pointer"
          >
            <span>Intel & Action</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ======================================================================= */}
        {/* MOBILE SLIDE-UP BOTTOM SHEET (Expanded) */}
        {/* ======================================================================= */}
        {isMobilePanelOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div 
              className="fixed inset-0"
              onClick={() => setIsMobilePanelOpen(false)}
            />
            <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="font-bold text-xs text-slate-900">Hotspot Intelligence & Dispatch</span>
                </div>
                <button
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
                {/* 1. Header: Risk Badge + Hotspot ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider text-white ${
                      currentHotspot.risk_level === 'CRITICAL' ? 'bg-red-600' :
                      currentHotspot.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                    }`}>
                      {currentHotspot.risk_level}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      Hotspot ID: {currentHotspot.hotspot_id}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-red-600 font-mono">{currentHotspot.breeding_risk_score}<span className="text-xs text-slate-400 font-sans font-normal">/100</span></span>
                </div>

                {/* 2. Hotspot Title & Location Subtitle */}
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                    {currentHotspot.hotspot_id}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold">{currentHotspot.ward || 'Ward 12 (Banjara Hills)'}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium ml-5">
                    {currentHotspot.location}, {currentHotspot.city}, {currentHotspot.state}
                  </div>
                </div>

                {/* 3. AI Risk Explanation */}
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950 space-y-1">
                  <div className="font-bold text-purple-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Risk Explanation</span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed font-sans">
                    {currentHotspot.ai_explanation || 'Elevated water retention risk based on recent rainfall and soil saturation.'}
                  </p>
                </div>

                {/* 4. Telemetry Highlights */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-[10px] font-semibold">Rainfall (48h)</div>
                    <div className="text-sm font-bold text-slate-800">{weatherData?.current.rainfallRecent48h || 42} mm</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-[10px] font-semibold">Temperature</div>
                    <div className="text-sm font-bold text-slate-800">{weatherData?.current.temperature || 28.5} °C</div>
                  </div>
                </div>

                {/* 5. Drone Evidence Preview */}
                <div 
                  onClick={() => {
                    setSelectedDetailHotspotId(currentHotspot.hotspot_id);
                    setIsMobilePanelOpen(false);
                  }}
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer relative h-28 group"
                >
                  <img src={SVG_VG1042_BEFORE} alt="Drone Evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2 text-white font-medium text-xs">
                    <span>Drone CV Survey Evidence (Click to inspect)</span>
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Actions for Mobile */}
              <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shrink-0">
                <button
                  id="mobile-sheet-dispatch-task-btn"
                  onClick={() => {
                    setDispatchModalHotspotId(currentHotspot.hotspot_id);
                    setIsMobilePanelOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-95"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Dispatch Task</span>
                </button>

                <button
                  id="mobile-sheet-view-hotspots-btn"
                  onClick={() => {
                    setActiveView('HOTSPOTS');
                    setIsMobilePanelOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                >
                  <span>All Hotspots</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
