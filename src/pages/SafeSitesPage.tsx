import type { SafeSite } from '@/types';
import { FeasibilityBadge } from '@/components/ui/Badges';
import { calculateCarryingCapacity } from '@/lib/carryingCapacity';
import { ShieldCheck, MapPin } from 'lucide-react';

interface SafeSitesPageProps {
  safeSites: SafeSite[];
  onSafeSiteClick: (s: SafeSite) => void;
}

export function SafeSitesPage({ safeSites, onSafeSiteClick }: SafeSitesPageProps) {
  const sorted = [...safeSites].sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-emerald-400" />
        <h1 className="text-lg font-bold text-slate-100">Safe Relocation Sites</h1>
        <span className="text-xs text-slate-400">— Identified safe locations for habitation relocation</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map(s => {
          const cap = calculateCarryingCapacity(s);
          return (
            <button
              key={s.id}
              onClick={() => onSafeSiteClick(s)}
              className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-left transition-all hover:border-slate-600/60 hover:bg-slate-800/60"
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
