import type { SafeSite } from '@/types';
import { calculateCarryingCapacity } from '@/lib/carryingCapacity';
import { FeasibilityBadge } from '@/components/ui/Badges';
import { Building2, Users, Droplets, Activity } from 'lucide-react';

interface CarryingCapacityPageProps {
  safeSites: SafeSite[];
  onSafeSiteClick: (s: SafeSite) => void;
}

export function CarryingCapacityPage({ safeSites, onSafeSiteClick }: CarryingCapacityPageProps) {
  const results = safeSites.map(s => ({ site: s, capacity: calculateCarryingCapacity(s) }));
  const totalCapacity = results.reduce((sum, r) => sum + r.capacity.availableCapacity, 0);
  const totalCurrent = results.reduce((sum, r) => sum + r.capacity.currentPopulation, 0);
  const totalMax = results.reduce((sum, r) => sum + r.site.estimatedCapacity, 0);
  const feasibleCount = results.filter(r => r.capacity.feasibility === 'FEASIBLE').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-teal-400" />
        <h1 className="text-lg font-bold text-slate-100">Carrying Capacity Assessment</h1>
        <span className="text-xs text-slate-400">— Can relocation sites accommodate affected populations?</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Capacity</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-100">{totalMax.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Population</p>
          <p className="mt-1.5 text-2xl font-bold text-amber-400">{totalCurrent.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Available Capacity</p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-400">{totalCapacity.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Feasible Sites</p>
          <p className="mt-1.5 text-2xl font-bold text-sky-400">{feasibleCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="pb-2 pr-3 font-medium">Site</th>
                <th className="pb-2 pr-3 font-medium">District</th>
                <th className="pb-2 pr-3 font-medium">Current Pop.</th>
                <th className="pb-2 pr-3 font-medium">Est. Capacity</th>
                <th className="pb-2 pr-3 font-medium">Available</th>
                <th className="pb-2 pr-3 font-medium">Utilization</th>
                <th className="pb-2 pr-3 font-medium">Water</th>
                <th className="pb-2 pr-3 font-medium">Road</th>
                <th className="pb-2 pr-3 font-medium">Max Density</th>
                <th className="pb-2 font-medium">Feasibility</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ site, capacity }) => (
                <tr
                  key={site.id}
                  onClick={() => onSafeSiteClick(site)}
                  className="cursor-pointer border-b border-slate-700/30 hover:bg-slate-700/20"
                >
                  <td className="py-2 pr-3 font-medium text-slate-200">{site.name}</td>
                  <td className="py-2 pr-3 text-slate-400">{site.districtName}</td>
                  <td className="py-2 pr-3 text-slate-300">{capacity.currentPopulation.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-slate-300">{site.estimatedCapacity.toLocaleString()}</td>
                  <td className="py-2 pr-3 font-medium text-emerald-400">{capacity.availableCapacity.toLocaleString()}</td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700">
                        <div className={`h-full rounded-full ${capacity.capacityUtilizationPct > 80 ? 'bg-red-500' : capacity.capacityUtilizationPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacity.capacityUtilizationPct}%` }} />
                      </div>
                      <span className="text-slate-300">{capacity.capacityUtilizationPct}%</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-slate-300">{capacity.waterAvailability}</td>
                  <td className="py-2 pr-3 text-slate-300">{capacity.roadAccessibility}</td>
                  <td className="py-2 pr-3 text-slate-300">{capacity.maxPopulationDensity}/ha</td>
                  <td className="py-2"><FeasibilityBadge status={capacity.feasibility} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Highlight */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
        <h3 className="mb-2 text-sm font-semibold text-sky-300 flex items-center gap-2">
          <Activity className="h-4 w-4" /> Example: Carrying Capacity Calculation
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
          <div>
            <p className="text-slate-400">Affected Population</p>
            <p className="mt-1 text-lg font-bold text-slate-200">2,500</p>
          </div>
          <div>
            <p className="text-slate-400">Available Capacity</p>
            <p className="mt-1 text-lg font-bold text-emerald-400">4,000</p>
          </div>
          <div>
            <p className="text-slate-400">Utilization</p>
            <p className="mt-1 text-lg font-bold text-amber-400">62.5%</p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p className="mt-1 text-lg font-bold text-emerald-400">FEASIBLE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
