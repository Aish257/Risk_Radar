import { useState } from 'react';
import type { Habitation, SafeSite, MapLayerKey, District } from '@/types';
import { KeralaMap, type MapStateConfig } from '@/components/map/KeralaMap';
import { LayerControls, MapLegend, getDefaultLayers } from '@/components/map/MapControls';
import { RiskBadge, RiskScoreBar, riskColor } from '@/components/ui/Badges';
import { Map } from 'lucide-react';

interface RiskMapPageProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  onHabitationClick: (h: Habitation) => void;
  onSafeSiteClick: (s: SafeSite) => void;
  stateConfig: MapStateConfig;
  stateLabel: string;
  districts: District[];
  selectedDistrict: string | null;
  onSelectDistrict: (id: string | null) => void;
}

export function RiskMapPage({ habitations, safeSites, onHabitationClick, onSafeSiteClick, stateConfig, stateLabel, districts, selectedDistrict, onSelectDistrict }: RiskMapPageProps) {
  const [layers, setLayers] = useState<Record<MapLayerKey, boolean>>(getDefaultLayers());

  const toggleLayer = (key: MapLayerKey) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = selectedDistrict
    ? habitations.filter(h => h.districtId === selectedDistrict)
    : habitations;

  const focusedLocation = (() => {
    if (!selectedDistrict) return null;
    const district = districts.find(d => d.id === selectedDistrict);
    if (!district) return null;
    return { lat: district.centroid[0], lng: district.centroid[1], zoom: 10 };
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Map className="h-5 w-5 text-sky-400" />
        <h1 className="text-lg font-bold text-slate-100">Risk Map</h1>
        <span className="text-xs text-slate-400">— Multi-hazard risk visualization for {stateLabel}</span>
      </div>

      {/* District Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectDistrict(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            !selectedDistrict ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:bg-slate-700/30'
          }`}
        >
          All Districts
        </button>
        {districts.map(d => (
          <button
            key={d.id}
            onClick={() => onSelectDistrict(d.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedDistrict === d.id ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:bg-slate-700/30'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <KeralaMap
          habitations={filtered}
          safeSites={safeSites}
          layers={layers}
          stateConfig={stateConfig}
          onHabitationClick={onHabitationClick}
          onSafeSiteClick={onSafeSiteClick}
          onDistrictClick={(id) => onSelectDistrict(id)}
          focusedLocation={focusedLocation}
          height="600px"
        />
        <div className="space-y-3">
          <LayerControls layers={layers} onToggle={toggleLayer} />
          <MapLegend />
        </div>
      </div>

      {/* District Summary */}
      {selectedDistrict && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">
            {districts.find(d => d.id === selectedDistrict)?.name} — Habitation Risk Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/50 text-left text-slate-400">
                  <th className="pb-2 pr-3 font-medium">Habitation</th>
                  <th className="pb-2 pr-3 font-medium">Risk Score</th>
                  <th className="pb-2 pr-3 font-medium">Risk Level</th>
                  <th className="pb-2 pr-3 font-medium">Population</th>
                  <th className="pb-2 pr-3 font-medium">Rainfall</th>
                  <th className="pb-2 pr-3 font-medium">Flood</th>
                  <th className="pb-2 pr-3 font-medium">Landslide</th>
                  <th className="pb-2 font-medium">Slope</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr
                    key={h.id}
                    onClick={() => onHabitationClick(h)}
                    className="cursor-pointer border-b border-slate-700/30 hover:bg-slate-700/20"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-200">{h.name}</td>
                    <td className="py-2 pr-3" style={{ color: riskColor(h.riskLevel), fontWeight: 600 }}>{h.riskScore}</td>
                    <td className="py-2 pr-3"><RiskBadge level={h.riskLevel} /></td>
                    <td className="py-2 pr-3 text-slate-300">{h.population.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-slate-300">{h.rainfall_mm.toFixed(0)} mm</td>
                    <td className="py-2 pr-3 text-slate-300">{h.floodSusceptibility}</td>
                    <td className="py-2 pr-3 text-slate-300">{h.landslideSusceptibility}</td>
                    <td className="py-2 text-slate-300">{h.slope_deg}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
