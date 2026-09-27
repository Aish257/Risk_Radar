import { useState } from 'react';
import type { SafeSite } from '@/types';
import { FeasibilityBadge } from '@/components/ui/Badges';
import { calculateCarryingCapacity } from '@/lib/carryingCapacity';
import { ShieldCheck, MapPin, Truck, Building2, Droplets, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface SafeSitesPageProps {
  safeSites: SafeSite[];
  onSafeSiteClick: (s: SafeSite) => void;
  onUseForRelocation: (s: SafeSite) => void;
}

export function SafeSitesPage({ safeSites, onSafeSiteClick, onUseForRelocation }: SafeSitesPageProps) {
  const [expandedSite, setExpandedSite] = useState<string | null>(null);

  const sorted = [...safeSites].sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const toggleExpand = (siteId: string) => {
    setExpandedSite(prev => prev === siteId ? null : siteId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-emerald-400" />
        <h1 className="text-lg font-bold text-slate-100">Safe Relocation Sites</h1>
        <span className="text-xs text-slate-400">— Identified safe locations with carrying capacity assessment</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map(s => {
          const cap = calculateCarryingCapacity(s);
          const isExpanded = expandedSite === s.id;
          return (
            <div
              key={s.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 transition-all hover:border-slate-600/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{s.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" /> {s.districtName}
                  </p>
                </div>
                <FeasibilityBadge status={s.feasibility} />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Suitability Score</span>
                  <span className="font-bold text-emerald-400">{s.suitabilityScore}/100</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${s.suitabilityScore}%` }} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Capacity</p>
                  <p className="font-medium text-slate-200">{s.estimatedCapacity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Available</p>
                  <p className="font-medium text-sky-400">{s.availableCapacity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Utilization</p>
                  <p className="font-medium text-slate-200">{cap.capacityUtilizationPct}%</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded border border-slate-600/40 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                  Flood: {s.floodRisk}
                </span>
                <span className="rounded border border-slate-600/40 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                  Landslide: {s.landslideRisk}
                </span>
                <span className="rounded border border-slate-600/40 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                  Water: {s.waterAvailability}
                </span>
                <span className="rounded border border-slate-600/40 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                  Road: {s.roadAccessibility}
                </span>
              </div>

              {/* Carrying capacity expandable section */}
              <button
                onClick={() => toggleExpand(s.id)}
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-700/40 bg-slate-900/30 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/30"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-sky-400" /> Carrying Capacity Details
                </span>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 rounded-lg border border-slate-700/40 bg-slate-900/20 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-500">Max Density:</span>
                      <span className="text-slate-300">{cap.maxPopulationDensity}/ha</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-500">Water:</span>
                      <span className="text-slate-300">{cap.waterAvailability}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Usable Land:</span>{' '}
                      <span className="text-slate-300">{s.usableLand_ha} ha</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Existing Pop:</span>{' '}
                      <span className="text-slate-300">{s.existingPopulation.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Add'l Capacity:</span>{' '}
                      <span className="text-slate-300">{cap.additionalCapacity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Healthcare:</span>{' '}
                      <span className="text-slate-300">{cap.healthcareFacilities} facilit{cap.healthcareFacilities === 1 ? 'y' : 'ies'}</span>
                    </div>
                  </div>
                  <p className="pt-1 text-slate-400">{s.recommendation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onSafeSiteClick(s)}
                  className="flex-1 rounded-lg border border-slate-600/40 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/30"
                >
                  View Details
                </button>
                <button
                  onClick={() => onUseForRelocation(s)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/40 px-3 py-2 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-700/20"
                >
                  <Truck className="h-3.5 w-3.5" /> Use for Relocation
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
