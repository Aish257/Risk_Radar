import type { Habitation, SafeSite, RelocationPlan } from '@/types';
import { RELOCATION_PLANS } from '@/data/habitations';
import { PriorityBadge, FeasibilityBadge } from '@/components/ui/Badges';
import { findBestSafeSite } from '@/lib/carryingCapacity';
import { Truck, ArrowRight, MapPin, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface RelocationPlanningPageProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  onHabitationClick: (h: Habitation) => void;
  onSafeSiteClick: (s: SafeSite) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  PLANNED: { bg: 'bg-slate-500/15', text: 'text-slate-300', label: 'Planned', icon: <Clock className="h-3 w-3" /> },
  APPROVED: { bg: 'bg-sky-500/15', text: 'text-sky-300', label: 'Approved', icon: <CheckCircle className="h-3 w-3" /> },
  IN_PROGRESS: { bg: 'bg-amber-500/15', text: 'text-amber-300', label: 'In Progress', icon: <AlertCircle className="h-3 w-3" /> },
  COMPLETED: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', label: 'Completed', icon: <CheckCircle className="h-3 w-3" /> },
};

export function RelocationPlanningPage({ habitations, safeSites, onHabitationClick, onSafeSiteClick }: RelocationPlanningPageProps) {
  const needsRelocation = habitations.filter(h => h.relocationPriority !== 'NONE');
  const plans: RelocationPlan[] = RELOCATION_PLANS;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-orange-400" />
        <h1 className="text-lg font-bold text-slate-100">Relocation Planning</h1>
        <span className="text-xs text-slate-400">— Vulnerable habitation to safe site matching</span>
      </div>

      {/* Relocation Flow Diagram */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Relocation Planning Flow</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['Vulnerable Habitation', 'Risk Assessment', 'Relocation Priority', 'Safe Site Search', 'Capacity Assessment', 'Relocation Plan'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="rounded-lg border border-slate-600/40 bg-slate-700/30 px-3 py-2 text-slate-300">
                {step}
              </div>
              {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Relocation Plans */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Active Relocation Plans</h2>
        <div className="space-y-3">
          {plans.map(plan => {
            const status = STATUS_STYLES[plan.status];
            return (
              <div key={plan.id} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Source */}
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">Source Habitation</p>
                    <p className="font-semibold text-slate-100">{plan.habitationName}</p>
                    <p className="text-xs text-slate-400">{plan.districtName} District</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-300">Affected: {plan.affectedPopulation.toLocaleString()}</span>
                      </div>
                      <div><PriorityBadge priority={plan.priority} /></div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">Recommended Safe Site</p>
                    <p className="font-semibold text-slate-100">{plan.recommendedSiteName}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">Capacity: {plan.siteCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">Available: {plan.siteAvailableCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">Suitability: {plan.suitabilityScore}/100</span>
                      </div>
                      <div><FeasibilityBadge status={plan.feasibility} /></div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-700/40 pt-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.icon} {status.label}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const h = habitations.find(h => h.id === plan.habitationId);
                        if (h) onHabitationClick(h);
                      }}
                      className="rounded-md border border-slate-600/40 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700/30"
                    >
                      View Habitation
                    </button>
                    <button
                      onClick={() => {
                        const s = safeSites.find(s => s.id === plan.recommendedSiteId);
                        if (s) onSafeSiteClick(s);
                      }}
                      className="rounded-md border border-emerald-600/40 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-700/20"
                    >
                      View Safe Site
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All habitations needing relocation */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">All Habitations Needing Relocation ({needsRelocation.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="pb-2 pr-3 font-medium">Habitation</th>
                <th className="pb-2 pr-3 font-medium">District</th>
                <th className="pb-2 pr-3 font-medium">Population</th>
                <th className="pb-2 pr-3 font-medium">Priority</th>
                <th className="pb-2 pr-3 font-medium">Recommended Site</th>
                <th className="pb-2 pr-3 font-medium">Suitability</th>
                <th className="pb-2 font-medium">Feasibility</th>
              </tr>
            </thead>
            <tbody>
              {needsRelocation.map(h => {
                const site = findBestSafeSite(h, safeSites);
                return (
                  <tr
                    key={h.id}
                    onClick={() => onHabitationClick(h)}
                    className="cursor-pointer border-b border-slate-700/30 hover:bg-slate-700/20"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-200">{h.name}</td>
                    <td className="py-2 pr-3 text-slate-400">{h.districtName}</td>
                    <td className="py-2 pr-3 text-slate-300">{h.population.toLocaleString()}</td>
                    <td className="py-2 pr-3"><PriorityBadge priority={h.relocationPriority} /></td>
                    <td className="py-2 pr-3 text-slate-300">{site?.name ?? 'No site available'}</td>
                    <td className="py-2 pr-3 text-emerald-400">{site?.suitabilityScore ?? '-'}</td>
                    <td className="py-2">{site ? <FeasibilityBadge status={site.feasibility} /> : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
