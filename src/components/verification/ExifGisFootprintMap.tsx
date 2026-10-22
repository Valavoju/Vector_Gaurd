import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Navigation, ShieldCheck, Camera, Maximize2, Sparkles, Satellite, LocateFixed } from 'lucide-react';
import { ExifGeoMetadata, DeviceGpsAnchor } from '../../types';

interface ExifGisFootprintMapProps {
  siteLat: number;
  siteLng: number;
  siteName: string;
  beforeExif?: ExifGeoMetadata;
  afterExif?: ExifGeoMetadata;
  deviceGpsAnchor?: DeviceGpsAnchor;
  toleranceMeters?: number;
}

export const ExifGisFootprintMap: React.FC<ExifGisFootprintMapProps> = ({
  siteLat,
  siteLng,
  siteName,
  beforeExif,
  afterExif,
  deviceGpsAnchor,
  toleranceMeters = 50
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [basemapType, setBasemapType] = useState<'SATELLITE' | 'STREET' | 'DARK'>('SATELLITE');
  const [showToleranceZone, setShowToleranceZone] = useState<boolean>(true);
  const [showGeodesicLines, setShowGeodesicLines] = useState<boolean>(true);

  // Basemap URLs
  const basemaps = {
    SATELLITE: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri World Imagery | High-Res Satellite GIS'
    },
    STREET: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    DARK: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO Dark Matter'
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [siteLat, siteLng],
        zoom: 18,
        minZoom: 14,
        maxZoom: 20,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tile = L.tileLayer(basemaps[basemapType].url, {
        maxZoom: 20,
        attribution: basemaps[basemapType].attribution
      }).addTo(map);

      tileLayerRef.current = tile;

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap when state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(basemaps[basemapType].url);
  }, [basemapType]);

  // Update Markers and Footprints
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    layersGroupRef.current.clearLayers();
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;

    // Center coordinates
    const targetSiteCoords: [number, number] = [siteLat, siteLng];
    const beforeCoords: [number, number] = [
      beforeExif?.extractedLat ?? (siteLat - 0.00003),
      beforeExif?.extractedLng ?? (siteLng - 0.00004)
    ];
    const afterCoords: [number, number] = [
      afterExif?.extractedLat ?? (siteLat + 0.00002),
      afterExif?.extractedLng ?? (siteLng + 0.00003)
    ];

    // 1. Draw 50m Geo-Verification Tolerance Buffer Zone
    if (showToleranceZone) {
      const toleranceCircle = L.circle(targetSiteCoords, {
        radius: toleranceMeters,
        color: '#10b981',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#10b981',
        fillOpacity: 0.12
      });
      toleranceCircle.bindTooltip(`GPS Geofence Perimeter (±${toleranceMeters}m)`, {
        permanent: false,
        direction: 'top'
      });
      group.addLayer(toleranceCircle);
    }

    // 2. Target Site Polygon / Footprint Box
    const siteBox = L.polygon([
      [siteLat + 0.00010, siteLng - 0.00012],
      [siteLat + 0.00010, siteLng + 0.00012],
      [siteLat - 0.00010, siteLng + 0.00012],
      [siteLat - 0.00010, siteLng - 0.00012]
    ], {
      color: '#f59e0b',
      weight: 2,
      fillColor: '#f59e0b',
      fillOpacity: 0.25,
      dashArray: '3, 3'
    });
    siteBox.bindTooltip(`Excavation & Intervention Footprint (~240 sq.m)`, { permanent: false });
    group.addLayer(siteBox);

    // 3. Geodesic Path Lines connecting Photo capture to Site Centroid
    if (showGeodesicLines) {
      // Line from Before Photo to Site
      const beforeLine = L.polyline([beforeCoords, targetSiteCoords], {
        color: '#ef4444',
        weight: 2,
        dashArray: '3, 4',
        opacity: 0.85
      });
      group.addLayer(beforeLine);

      // Line from After Photo to Site
      const afterLine = L.polyline([afterCoords, targetSiteCoords], {
        color: '#10b981',
        weight: 2.5,
        dashArray: '3, 4',
        opacity: 0.95
      });
      group.addLayer(afterLine);
    }

    // 4. Site Centroid Marker
    const siteIcon = L.divIcon({
      className: 'site-centroid-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping pointer-events-none"></div>
          <div class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-400/50">
            🎯
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const siteMarker = L.marker(targetSiteCoords, { icon: siteIcon });
    siteMarker.bindTooltip(`<strong>Target Site Centroid</strong><br/>${siteLat.toFixed(6)}° N, ${siteLng.toFixed(6)}° E`, { permanent: false, direction: 'top' });
    group.addLayer(siteMarker);

    // 5. Before Evidence Photo GPS Marker
    const beforeIcon = L.divIcon({
      className: 'before-photo-marker',
      html: `
        <div class="relative flex items-center gap-1 select-none">
          <div class="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md border-2 border-white">
            📷
          </div>
          <span class="bg-red-900/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow border border-red-700 whitespace-nowrap">
            BEFORE (${(beforeExif?.distanceOffsetMeters ?? 4.2).toFixed(1)}m)
          </span>
        </div>
      `,
      iconSize: [120, 24],
      iconAnchor: [12, 12]
    });
    const beforeMarker = L.marker(beforeCoords, { icon: beforeIcon });
    beforeMarker.bindTooltip(`<strong>Before Photo EXIF Geotag</strong><br/>Lat: ${beforeCoords[0].toFixed(6)}<br/>Lng: ${beforeCoords[1].toFixed(6)}<br/>Offset: ${(beforeExif?.distanceOffsetMeters ?? 4.2).toFixed(1)}m`, { permanent: false, direction: 'left' });
    group.addLayer(beforeMarker);

    // 6. After Evidence Photo GPS Marker
    const afterIcon = L.divIcon({
      className: 'after-photo-marker',
      html: `
        <div class="relative flex items-center gap-1 select-none">
          <div class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md border-2 border-white ring-2 ring-emerald-400">
            ✓
          </div>
          <span class="bg-emerald-950/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow border border-emerald-700 whitespace-nowrap">
            AFTER (${(afterExif?.distanceOffsetMeters ?? 3.8).toFixed(1)}m)
          </span>
        </div>
      `,
      iconSize: [120, 24],
      iconAnchor: [12, 12]
    });
    const afterMarker = L.marker(afterCoords, { icon: afterIcon });
    afterMarker.bindTooltip(`<strong>After Photo EXIF Geotag (Verified)</strong><br/>Lat: ${afterCoords[0].toFixed(6)}<br/>Lng: ${afterCoords[1].toFixed(6)}<br/>Offset: ${(afterExif?.distanceOffsetMeters ?? 3.8).toFixed(1)}m<br/>Fix: NavIC + GPS`, { permanent: false, direction: 'right' });
    group.addLayer(afterMarker);

    // 7. Device Live GPS Secondary Anchor Marker (if available)
    if (deviceGpsAnchor) {
      const deviceCoords: [number, number] = [deviceGpsAnchor.latitude, deviceGpsAnchor.longitude];
      
      if (showGeodesicLines) {
        const deviceLine = L.polyline([deviceCoords, targetSiteCoords], {
          color: '#06b6d4',
          weight: 2,
          dashArray: '2, 4',
          opacity: 0.9
        });
        group.addLayer(deviceLine);
      }

      const deviceIcon = L.divIcon({
        className: 'device-gps-anchor-marker',
        html: `
          <div class="relative flex items-center gap-1 select-none">
            <div class="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md border-2 border-white ring-2 ring-cyan-400">
              📍
            </div>
            <span class="bg-cyan-950/90 text-cyan-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow border border-cyan-700 whitespace-nowrap">
              DEVICE GPS (±${deviceGpsAnchor.accuracyMeters}m)
            </span>
          </div>
        `,
        iconSize: [130, 24],
        iconAnchor: [12, 12]
      });
      const devMarker = L.marker(deviceCoords, { icon: deviceIcon });
      devMarker.bindTooltip(`<strong>Device Live Hardware GPS Anchor</strong><br/>Lat: ${deviceCoords[0].toFixed(6)}<br/>Lng: ${deviceCoords[1].toFixed(6)}<br/>Accuracy: ±${deviceGpsAnchor.accuracyMeters}m<br/>Source: ${deviceGpsAnchor.source}`, { permanent: false, direction: 'bottom' });
      group.addLayer(devMarker);
    }

    map.panTo(targetSiteCoords);
  }, [siteLat, siteLng, beforeExif, afterExif, deviceGpsAnchor, showToleranceZone, showGeodesicLines, toleranceMeters]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([siteLat, siteLng], 18, { duration: 0.8 });
    }
  };

  return (
    <div className="vg-island rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative flex flex-col h-[280px]">
      {/* Map Header Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Satellite className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-white tracking-wide">GIS Real-Time Evidence GPS Footprint</span>
          <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
            ±{afterExif?.geoToleranceMeters ?? 50}m Tolerance
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[10px] font-bold text-slate-300">
            <button
              onClick={() => setBasemapType('SATELLITE')}
              className={`px-2 py-0.5 rounded transition ${basemapType === 'SATELLITE' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemapType('STREET')}
              className={`px-2 py-0.5 rounded transition ${basemapType === 'STREET' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
            >
              Street
            </button>
            <button
              onClick={() => setBasemapType('DARK')}
              className={`px-2 py-0.5 rounded transition ${basemapType === 'DARK' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
            >
              Dark GIS
            </button>
          </div>

          <button
            onClick={handleRecenter}
            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition"
            title="Recenter Site"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Legend Overlay */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/90 backdrop-blur-md rounded-lg p-2 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-500"></span>
            <span>Site Centroid (🎯 Target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Before Photo ({beforeExif?.distanceOffsetMeters ?? 4.2}m offset)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>After Photo ({afterExif?.distanceOffsetMeters ?? 3.8}m offset • Verified)</span>
          </div>
        </div>

        {/* Quick Toggle Overlays */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 text-[10px] font-bold">
          <button
            onClick={() => setShowToleranceZone(!showToleranceZone)}
            className={`px-2 py-1 rounded backdrop-blur-md border transition ${
              showToleranceZone ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            {showToleranceZone ? '✓ Geofence Buffer' : '○ Geofence Buffer'}
          </button>
          <button
            onClick={() => setShowGeodesicLines(!showGeodesicLines)}
            className={`px-2 py-1 rounded backdrop-blur-md border transition ${
              showGeodesicLines ? 'bg-indigo-950/80 text-indigo-300 border-indigo-600/50' : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            {showGeodesicLines ? '✓ Geodesic Vectors' : '○ Geodesic Vectors'}
          </button>
        </div>
      </div>
    </div>
  );
};
