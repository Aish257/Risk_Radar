import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Habitation, SafeSite, MapLayerKey, District } from '@/types';
import { riskFillColor, riskColor, RiskBadge } from '@/components/ui/Badges';

// CARTO basemap configuration.
// If VITE_CARTO_API_KEY is set, use CARTO's authenticated basemap URL.
// Otherwise fall back to CARTO's free dark basemap (no API key required,
// no "API KEY REQUIRED" watermark).
const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY as string | undefined;

const cartoTileProps = CARTO_API_KEY
  ? {
      url: `https://maps-api-direct.carto.com/api/v1/map/named/base-map-dark/all/{z}/{x}/{y}.png?api_key=${CARTO_API_KEY}`,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }
  : {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd' as const,
    };

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ResetViewControl({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(center, zoom)}
      className="absolute right-2 top-20 z-[1000] rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-700"
    >
      Reset View
    </button>
  );
}

export interface MapStateConfig {
  center: [number, number];
  zoom: number;
  outline: [number, number][];
  label: string;
  districts: District[];
  districtBoundaries: Record<string, [number, number][]>;
  riskZones: { coords: [number, number][]; level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }[];
  roads: [number, number][][];
  hospitals: { id: string; name: string; districtId: string; lat: number; lng: number; type: string }[];
  schools: { id: string; name: string; districtId: string; lat: number; lng: number; type: string }[];
  waterBodies: { id: string; name: string; lat: number; lng: number; type: string }[];
}

interface KeralaMapProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  layers: Record<MapLayerKey, boolean>;
  stateConfig: MapStateConfig;
  onHabitationClick?: (h: Habitation) => void;
  onSafeSiteClick?: (s: SafeSite) => void;
  onDistrictClick?: (districtId: string) => void;
  height?: string;
  showDistricts?: boolean;
  showRiskZones?: boolean;
  focusedLocation?: { lat: number; lng: number; zoom?: number } | null;
}

export function KeralaMap({
  habitations,
  safeSites,
  layers,
  stateConfig,
  onHabitationClick,
  onSafeSiteClick,
  onDistrictClick,
  height = '500px',
  showDistricts = true,
  showRiskZones = true,
  focusedLocation = null,
}: KeralaMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // When state config changes (center/zoom), recenter the map
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(stateConfig.center, stateConfig.zoom, { animate: true });
    }
  }, [stateConfig.center, stateConfig.zoom]);

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.setView([focusedLocation.lat, focusedLocation.lng], focusedLocation.zoom ?? 12, { animate: true });
    }
  }, [focusedLocation]);

  const stateGeoJSON = {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [stateConfig.outline.map(p => [p[1], p[0]])] },
    properties: { name: stateConfig.label },
  };

  const districtFeatures = stateConfig.districts.map(d => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [stateConfig.districtBoundaries[d.id]?.map(p => [p[1], p[0]]) ?? []],
    },
    properties: { id: d.id, name: d.name },
  }));

  const riskZoneFeatures = stateConfig.riskZones.map((z, i) => ({
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [z.coords.map(p => [p[1], p[0]])] },
    properties: { level: z.level, index: i },
  }));

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/50" style={{ height }}>
      <MapContainer
        center={stateConfig.center}
        zoom={stateConfig.zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        ref={(m) => { if (m) mapRef.current = m; }}
      >
        <TileLayer
          {...cartoTileProps}
        />

        {/* State boundary */}
        <GeoJSON
          data={stateGeoJSON as unknown as GeoJSON.GeoJsonObject}
          style={{ color: '#38bdf8', weight: 2, fillOpacity: 0.03, dashArray: '5,5' }}
        />

        {/* District boundaries */}
        {showDistricts && (
          <GeoJSON
            data={districtFeatures as unknown as GeoJSON.GeoJsonObject}
            style={{ color: '#475569', weight: 1, fillOpacity: 0.02 }}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => {
                onDistrictClick?.(feature.properties.id);
              });
              layer.bindTooltip(feature.properties.name, { sticky: true, className: 'map-tooltip' });
            }}
          />
        )}

        {/* Risk zone polygons */}
        {showRiskZones && layers.riskZones && (
          <GeoJSON
            data={riskZoneFeatures as unknown as GeoJSON.GeoJsonObject}
            style={(feature) => {
              const level = (feature?.properties as { level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }).level;
              return {
                color: riskColor(level),
                weight: 1.5,
                fillColor: riskFillColor(level),
                fillOpacity: 0.5,
              };
            }}
            onEachFeature={(feature, layer) => {
              const level = (feature.properties as { level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }).level;
              layer.bindTooltip(`Risk Zone: ${level}`, { sticky: true, className: 'map-tooltip' });
            }}
          />
        )}

        {/* Rainfall layer — show as colored circles */}
        {layers.rainfall && habitations.map(h => (
          <CircleMarker
            key={`rain-${h.id}`}
            center={[h.lat, h.lng]}
            radius={Math.max(6, h.rainfall_mm / 8)}
            pathOptions={{
              color: h.rainfall_mm > 70 ? '#3b82f6' : h.rainfall_mm > 50 ? '#60a5fa' : '#93c5fd',
              fillColor: h.rainfall_mm > 70 ? '#3b82f6' : h.rainfall_mm > 50 ? '#60a5fa' : '#93c5fd',
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
        ))}

        {/* Flood layer */}
        {layers.flood && habitations.filter(h => h.floodSusceptibility > 50).map(h => (
          <CircleMarker
            key={`flood-${h.id}`}
            center={[h.lat, h.lng]}
            radius={12}
            pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.2, weight: 1, dashArray: '3,3' }}
          />
        ))}

        {/* Landslide layer */}
        {layers.landslide && habitations.filter(h => h.landslideSusceptibility > 50).map(h => (
          <CircleMarker
            key={`land-${h.id}`}
            center={[h.lat, h.lng]}
            radius={10}
            pathOptions={{ color: '#a78bfa', fillColor: '#a78bfa', fillOpacity: 0.2, weight: 1, dashArray: '2,4' }}
          />
        ))}

        {/* Roads */}
        {layers.roads && stateConfig.roads.map((road, i) => (
          <GeoJSON
            key={`road-${i}`}
            data={{
              type: 'LineString',
              coordinates: road.map(p => [p[1], p[0]]),
            } as unknown as GeoJSON.GeoJsonObject}
            style={{ color: '#64748b', weight: 1.5, dashArray: '4,4', opacity: 0.6 }}
          />
        ))}

        {/* Water bodies */}
        {layers.waterBodies && stateConfig.waterBodies.map(wb => (
          <CircleMarker
            key={wb.id}
            center={[wb.lat, wb.lng]}
            radius={6}
            pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.6, weight: 2 }}
          >
            <Popup>
              <div className="text-xs">
                <strong>{wb.name}</strong>
                <br />
                <span className="text-slate-500">{wb.type}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Hospitals */}
        {layers.hospitals && stateConfig.hospitals.map(hosp => (
          <Marker key={hosp.id} position={[hosp.lat, hosp.lng]} icon={createIcon('#f43f5e')}>
            <Popup>
              <div className="text-xs">
                <strong>{hosp.name}</strong>
                <br />
                <span className="text-slate-500">{hosp.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Schools */}
        {layers.schools && stateConfig.schools.map(sch => (
          <Marker key={sch.id} position={[sch.lat, sch.lng]} icon={createIcon('#fbbf24')}>
            <Popup>
              <div className="text-xs">
                <strong>{sch.name}</strong>
                <br />
                <span className="text-slate-500">{sch.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Habitations */}
        {layers.habitations && habitations.map(h => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={Math.max(5, Math.min(12, h.population / 500))}
            pathOptions={{
              color: riskColor(h.riskLevel),
              fillColor: riskColor(h.riskLevel),
              fillOpacity: 0.7,
              weight: 2,
            }}
            eventHandlers={{ click: () => onHabitationClick?.(h) }}
          >
            <Popup>
              <div className="min-w-[180px] text-xs">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <strong className="text-sm text-slate-800">{h.name}</strong>
                  <RiskBadge level={h.riskLevel} />
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div>District: {h.districtName}</div>
                  <div>Population: {h.population.toLocaleString()}</div>
                  <div>Risk Score: {h.riskScore}/100</div>
                  <div>Vulnerability: {h.vulnerabilityScore}/100</div>
                  <div>Rainfall: {h.rainfall_mm.toFixed(0)} mm</div>
                </div>
                <button
                  onClick={() => onHabitationClick?.(h)}
                  className="mt-2 w-full rounded bg-slate-800 px-2 py-1 text-center text-xs font-medium text-white hover:bg-slate-700"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Safe Sites */}
        {layers.safeSites && safeSites.map(s => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={createSafeSiteIcon()}
            eventHandlers={{ click: () => onSafeSiteClick?.(s) }}
          >
            <Popup>
              <div className="min-w-[180px] text-xs">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <strong className="text-sm text-slate-800">{s.name}</strong>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div>District: {s.districtName}</div>
                  <div>Suitability: {s.suitabilityScore}/100</div>
                  <div>Capacity: {s.estimatedCapacity.toLocaleString()}</div>
                  <div>Available: {s.availableCapacity.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onSafeSiteClick?.(s)}
                  className="mt-2 w-full rounded bg-emerald-600 px-2 py-1 text-center text-xs font-medium text-white hover:bg-emerald-500"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <ResetViewControl center={stateConfig.center} zoom={stateConfig.zoom} />
      </MapContainer>
    </div>
  );
}

function createIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function createSafeSiteIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:18px;height:18px;background:#10b981;border:2px solid white;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
