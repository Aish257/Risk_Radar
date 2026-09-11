import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Habitation, SafeSite, MapLayerKey } from '@/types';
import { KERALA_CENTER, KERALA_OUTLINE, DISTRICT_BOUNDARIES, KERALA_DISTRICTS } from '@/data/districts';
import { HOSPITALS, SCHOOLS, WATER_BODIES } from '@/data/habitations';
import { riskFillColor, riskColor, RiskBadge } from '@/components/ui/Badges';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RISK_ZONE_POLYGONS: { coords: [number, number][]; level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }[] = [
  // Wayanad critical zone
  { coords: [[11.42,76.15],[11.50,76.15],[11.55,76.22],[11.52,76.28],[11.45,76.28],[11.40,76.22],[11.42,76.15]], level: 'CRITICAL' },
  // Wayanad high zone
  { coords: [[11.35,76.05],[11.45,76.05],[11.48,76.15],[11.42,76.15],[11.40,76.22],[11.35,76.18],[11.35,76.05]], level: 'HIGH' },
  // Idukki high zone
  { coords: [[9.95,76.95],[10.05,76.95],[10.15,77.10],[10.10,77.20],[10.00,77.15],[9.90,77.05],[9.95,76.95]], level: 'HIGH' },
  // Alappuzha flood high zone
  { coords: [[9.40,76.30],[9.50,76.30],[9.55,76.42],[9.48,76.48],[9.40,76.45],[9.38,76.38],[9.40,76.30]], level: 'HIGH' },
  // Pathanamthitta flood high
  { coords: [[9.30,76.65],[9.40,76.65],[9.45,76.80],[9.38,76.85],[9.30,76.80],[9.28,76.72],[9.30,76.65]], level: 'HIGH' },
  // Central Kerala moderate
  { coords: [[10.20,76.20],[10.40,76.20],[10.45,76.45],[10.35,76.50],[10.25,76.45],[10.20,76.30],[10.20,76.20]], level: 'MODERATE' },
  // South Kerala moderate
  { coords: [[8.55,76.85],[8.70,76.85],[8.75,77.05],[8.65,77.10],[8.55,77.00],[8.50,76.90],[8.55,76.85]], level: 'MODERATE' },
  // North Kerala moderate
  { coords: [[11.80,75.50],[12.00,75.50],[12.05,75.75],[11.95,75.85],[11.85,75.80],[11.80,75.65],[11.80,75.50]], level: 'MODERATE' },
  // Safe zones
  { coords: [[10.50,76.30],[10.65,76.30],[10.70,76.45],[10.60,76.50],[10.50,76.45],[10.50,76.30]], level: 'LOW' },
  { coords: [[11.00,75.70],[11.15,75.70],[11.20,75.90],[11.10,75.95],[11.00,75.90],[11.00,75.70]], level: 'LOW' },
  { coords: [[8.75,77.00],[8.85,77.00],[8.90,77.15],[8.80,77.20],[8.72,77.10],[8.75,77.00]], level: 'MODERATE' },
];

// Simple road lines (simplified)
const ROADS: [number, number][][] = [
  [[11.63,76.08],[11.45,76.18],[11.52,76.22]],
  [[11.63,76.08],[11.66,76.27]],
  [[11.63,76.08],[11.80,76.00]],
  [[11.25,75.78],[11.32,75.88],[11.45,76.18]],
  [[10.52,76.21],[10.02,76.30],[9.54,76.34]],
  [[10.09,77.06],[9.92,76.98],[9.59,76.52]],
  [[8.52,76.94],[8.89,76.71],[9.54,76.34]],
];

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

interface KeralaMapProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  layers: Record<MapLayerKey, boolean>;
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
  onHabitationClick,
  onSafeSiteClick,
  onDistrictClick,
  height = '500px',
  showDistricts = true,
  showRiskZones = true,
  focusedLocation = null,
}: KeralaMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.setView([focusedLocation.lat, focusedLocation.lng], focusedLocation.zoom ?? 12, { animate: true });
    }
  }, [focusedLocation]);

  const keralaGeoJSON = {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [KERALA_OUTLINE.map(p => [p[1], p[0]])] },
    properties: { name: 'Kerala' },
  };

  const districtFeatures = KERALA_DISTRICTS.map(d => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [DISTRICT_BOUNDARIES[d.id]?.map(p => [p[1], p[0]]) ?? []],
    },
    properties: { id: d.id, name: d.name },
  }));

  const riskZoneFeatures = RISK_ZONE_POLYGONS.map((z, i) => ({
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [z.coords.map(p => [p[1], p[0]])] },
    properties: { level: z.level, index: i },
  }));

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/50" style={{ height }}>
      <MapContainer
        center={KERALA_CENTER}
        zoom={7}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        ref={(m) => { if (m) mapRef.current = m; }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* Kerala state boundary */}
        <GeoJSON
          data={keralaGeoJSON as unknown as GeoJSON.GeoJsonObject}
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
        {layers.roads && ROADS.map((road, i) => (
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
        {layers.waterBodies && WATER_BODIES.map(wb => (
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
        {layers.hospitals && HOSPITALS.map(hosp => (
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
        {layers.schools && SCHOOLS.map(sch => (
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

        <ResetViewControl center={KERALA_CENTER} zoom={7} />
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
