import { useState } from 'react';
import type { Habitation, SafeSite, HazardUpdate, KPISummary, MapLayerKey } from '@/types';
import { SAFE_SITES } from '@/data/habitations';
import { KERALA_DISTRICTS } from '@/data/districts';
import { KPICards } from '@/components/ui/KPICards';
import { KeralaMap } from '@/components/map/KeralaMap';
import { LayerControls, MapLegend, getDefaultLayers } from '@/components/map/MapControls';
import { RiskBadge, PriorityBadge, ActionBadge, RiskScoreBar, riskColor } from '@/components/ui/Badges';
import { CloudRain, Thermometer, Wind, Droplets, RefreshCw, AlertTriangle, Activity, Radio } from 'lucide-react';

interface DashboardProps {
  habitations: Habitation[];
  hazardUpdate: HazardUpdate;
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onHabitationClick: (h: Habitation) => void;
  onSafeSiteClick: (s: SafeSite) => void;
  onNavigate: (page: string) => void;
}

export function Dashboard({ habitations, hazardUpdate, lastUpdated, onRefresh, isRefreshing, onHabitationClick, onSafeSiteClick, onNavigate }: DashboardProps) {
  const [safeSites] = useState<SafeSite[]>(SAFE_SITES);
  const [layers, setLayers] = useState<Record<MapLayerKey, boolean>>(getDefaultLayers());

  const toggleLayer = (key: MapLayerKey) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute KPIs
  const kpi: KPISummary = {
    totalDistricts: KERALA_DISTRICTS.length,
    highCriticalZones: habitations.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL').length,
    vulnerableHabitations: habitations.filter(h => h.vulnerabilityScore >= 50).length,
    immediateRelocation: habitations.filter(h => h.relocationPriority === 'IMMEDIATE').length,
    availableSafeSites: safeSites.filter(s => s.feasibility !== 'NOT_FEASIBLE').length,
    totalRelocationCapacity: safeSites.reduce((sum, s) => sum + s.availableCapacity, 0),
  };

  const topPriority = [...habitations]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 8);

  const topSafeSites = [...safeSites]
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <KPICards kpi={kpi} />

      {/* Map + Sidebar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">Interactive Kerala Risk Map</h2>
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Demo / Simulated Live Feed
            </span>
          </div>
          <KeralaMap
            habitations={habitations}
            safeSites={safeSites}
            layers={layers}
            onHabitationClick={onHabitationClick}
            onSafeSiteClick={onSafeSiteClick}
            height="480px"
          />
        </div>
        <div className="space-y-3">
          <LayerControls layers={layers} onToggle={toggleLayer} />
          <MapLegend />
        </div>
      </div>

      {/* Live Hazard Status */}
      <LiveHazardPanel
        hazard={hazardUpdate}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Top Priority Habitations & Safe Sites */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Top Priority Habitations</h2>
            <button
              onClick={() => onNavigate('habitation-ranking')}
              className="text-xs text-sky-400 hover:text-sky-300"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/50 text-left text-slate-400">
                  <th className="pb-2 pr-3 font-medium">Habitation</th>
                  <th className="pb-2 pr-3 font-medium">District</th>
                  <th className="pb-2 pr-3 font-medium">Risk</th>
                  <th className="pb-2 pr-3 font-medium">Pop.</th>
                  <th className="pb-2 pr-3 font-medium">Priority</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {topPriority.map(h => (
                  <tr
                    key={h.id}
                    onClick={() => onHabitationClick(h)}
                    className="cursor-pointer border-b border-slate-700/30 transition-colors hover:bg-slate-700/20"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-200">{h.name}</td>
                    <td className="py-2 pr-3 text-slate-400">{h.districtName}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold" style={{ color: riskColor(h.riskLevel) }}>{h.riskScore}</span>
                        <RiskBadge level={h.riskLevel} />
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-slate-300">{h.population.toLocaleString()}</td>
                    <td className="py-2 pr-3"><PriorityBadge priority={h.relocationPriority} /></td>
                    <td className="py-2"><ActionBadge action={h.recommendedAction} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Recommended Safe Sites</h2>
            <button
              onClick={() => onNavigate('safe-sites')}
              className="text-xs text-sky-400 hover:text-sky-300"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/50 text-left text-slate-400">
                  <th className="pb-2 pr-3 font-medium">Site</th>
                  <th className="pb-2 pr-3 font-medium">District</th>
                  <th className="pb-2 pr-3 font-medium">Suitability</th>
                  <th className="pb-2 pr-3 font-medium">Capacity</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {topSafeSites.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => onSafeSiteClick(s)}
                    className="cursor-pointer border-b border-slate-700/30 transition-colors hover:bg-slate-700/20"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-200">{s.name}</td>
                    <td className="py-2 pr-3 text-slate-400">{s.districtName}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.suitabilityScore}%` }} />
                        </div>
                        <span className="font-semibold text-emerald-400">{s.suitabilityScore}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-slate-300">{s.availableCapacity.toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                        s.feasibility === 'FEASIBLE' ? 'bg-emerald-500/15 text-emerald-300' :
                        s.feasibility === 'PARTIALLY_FEASIBLE' ? 'bg-amber-500/15 text-amber-300' :
                        'bg-red-500/15 text-red-300'
                      }`}>
                        {s.feasibility === 'FEASIBLE' ? 'Feasible' : s.feasibility === 'PARTIALLY_FEASIBLE' ? 'Partial' : 'Not Feasible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Decision Support Quick Links */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Decision Support Quick Access</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {[
            { q: 'Where is the danger?', label: 'Risk Map', page: 'risk-map', color: 'text-red-400' },
            { q: 'Who is most vulnerable?', label: 'Habitation Ranking', page: 'habitation-ranking', color: 'text-amber-400' },
            { q: 'Who needs relocation first?', label: 'Relocation Planning', page: 'relocation-planning', color: 'text-orange-400' },
            { q: 'Where can they go?', label: 'Safe Sites', page: 'safe-sites', color: 'text-emerald-400' },
            { q: 'Can it accommodate them?', label: 'Carrying Capacity', page: 'carrying-capacity', color: 'text-sky-400' },
          ].map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3 text-left transition-all hover:border-slate-600/60 hover:bg-slate-700/30"
            >
              <p className="text-xs text-slate-400">{item.q}</p>
              <p className={`mt-1 text-sm font-medium ${item.color}`}>{item.label} →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveHazardPanel({
  hazard,
  onRefresh,
  isRefreshing,
  lastUpdated,
}: {
  hazard: HazardUpdate;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}) {
  const time = new Date(lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const warningColor = hazard.weatherWarning.includes('RED')
    ? 'text-red-400 border-red-500/30 bg-red-500/10'
    : hazard.weatherWarning.includes('ORANGE')
    ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    : 'text-amber-400 border-amber-500/30 bg-amber-500/10';

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-slate-200">Live Hazard Status</h2>
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <Radio className="h-3 w-3" /> Demo / Simulated Live Feed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Last Updated: {time}</span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/30 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Hazard Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {/* Rainfall */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CloudRain className="h-3.5 w-3.5 text-blue-400" /> Rainfall (24h)
          </div>
          <p className="mt-1 text-xl font-bold text-slate-100">{hazard.rainfall_24h_mm}<span className="text-sm font-normal text-slate-400"> mm</span></p>
          <p className="text-xs text-slate-500">1h: {hazard.rainfall_1h_mm} mm</p>
        </div>
        {/* Temperature */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Thermometer className="h-3.5 w-3.5 text-orange-400" /> Temperature
          </div>
          <p className="mt-1 text-xl font-bold text-slate-100">{hazard.temperature_c}<span className="text-sm font-normal text-slate-400"> °C</span></p>
          <p className="text-xs text-slate-500">Humidity: {hazard.humidity_pct}%</p>
        </div>
        {/* Wind */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Wind className="h-3.5 w-3.5 text-teal-400" /> Wind Speed
          </div>
          <p className="mt-1 text-xl font-bold text-slate-100">{hazard.windSpeed_kmph}<span className="text-sm font-normal text-slate-400"> km/h</span></p>
        </div>
        {/* Flood Risk */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Droplets className="h-3.5 w-3.5 text-cyan-400" /> Flood Risk
          </div>
          <p className="mt-1 text-xl font-bold" style={{ color: riskColor(hazard.floodRisk) }}>{hazard.floodRisk}</p>
        </div>
        {/* Landslide Risk */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="h-3.5 w-3.5 text-purple-400" /> Landslide Risk
          </div>
          <p className="mt-1 text-xl font-bold" style={{ color: riskColor(hazard.landslideRisk) }}>{hazard.landslideRisk}</p>
        </div>
        {/* Overall Risk */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Activity className="h-3.5 w-3.5 text-red-400" /> Overall Risk
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold" style={{ color: riskColor(hazard.overallRiskLevel) }}>{hazard.overallRisk}</p>
            <span className="text-sm text-slate-400">/100</span>
          </div>
          <div className="mt-1">
            <RiskBadge level={hazard.overallRiskLevel} />
          </div>
        </div>
      </div>

      <div className={`mt-3 rounded-lg border px-3 py-2 text-xs font-medium ${warningColor}`}>
        {hazard.weatherWarning}
      </div>
    </div>
  );
}
