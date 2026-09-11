import type { SafeSite } from '@/types';
import { calculateCarryingCapacity } from '@/lib/carryingCapacity';
import { FeasibilityBadge } from '@/components/ui/Badges';
import { X, MapPin, ShieldCheck, Users, Building, Route, Hospital, School, Droplets, Mountain, Waves, TrendingUp } from 'lucide-react';

interface SafeSiteDetailProps {
  site: SafeSite;
  onClose: () => void;
}

export function SafeSiteDetail({ site, onClose }: SafeSiteDetailProps) {
  const capacity = calculateCarryingCapacity(site);

  const metrics = [
    { label: 'Flood Risk', value: `${site.floodRisk}/100`, icon: <Waves className="h-4 w-4 text-cyan-400" /> },
    { label: 'Landslide Risk', value: `${site.landslideRisk}/100`, icon: <Mountain className="h-4 w-4 text-purple-400" /> },
    { label: 'Slope', value: `${site.slope_deg}°`, icon: <TrendingUp className="h-4 w-4 text-amber-400" /> },
    { label: 'Elevation', value: `${site.elevation_m} m`, icon: <TrendingUp className="h-4 w-4 text-slate-400" /> },
    { label: 'Road Access', value: site.roadAccessibility, icon: <Route className="h-4 w-4 text-slate-400" /> },
    { label: 'Usable Land', value: `${site.usableLand_ha} ha`, icon: <Building className="h-4 w-4 text-teal-400" /> },
    { label: 'Hospital Distance', value: `${site.hospitalDistance_km} km`, icon: <Hospital className="h-4 w-4 text-rose-400" /> },
    { label: 'School Distance', value: `${site.schoolDistance_km} km`, icon: <School className="h-4 w-4 text-amber-400" /> },
    { label: 'Water Availability', value: site.waterAvailability, icon: <Droplets className="h-4 w-4 text-blue-400" /> },
    { label: 'Hazard Exposure', value: `${site.hazardExposure}/100`, icon: <ShieldCheck className="h-4 w-4 text-slate-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-700/50 bg-slate-900/95 p-4 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">{site.name}</h2>
            </div>
            <p className="mt-0.5 text-sm text-slate-400">{site.districtName} District · Kerala</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Suitability & Capacity Summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Suitability Score</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">{site.suitabilityScore}</p>
              <p className="text-xs text-slate-500">/100</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Est. Capacity</p>
              <p className="mt-1 text-2xl font-bold text-slate-100">{site.estimatedCapacity.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Available</p>
              <p className="mt-1 text-2xl font-bold text-sky-400">{site.availableCapacity.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Feasibility</p>
              <div className="mt-1.5"><FeasibilityBadge status={site.feasibility} /></div>
            </div>
          </div>

          {/* Carrying Capacity Detail */}
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
            <h3 className="mb-2 text-sm font-semibold text-slate-200">Carrying Capacity Assessment</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Population</span>
                <span className="font-medium text-slate-200">{capacity.currentPopulation.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Available Capacity</span>
                <span className="font-medium text-slate-200">{capacity.availableCapacity.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Additional Capacity</span>
                <span className="font-medium text-emerald-400">{capacity.additionalCapacity.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Capacity Utilization</span>
                <span className="font-medium text-slate-200">{capacity.capacityUtilizationPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div className={`h-full rounded-full ${capacity.capacityUtilizationPct > 80 ? 'bg-red-500' : capacity.capacityUtilizationPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacity.capacityUtilizationPct}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Max Population Density</span>
                <span className="font-medium text-slate-200">{capacity.maxPopulationDensity}/ha</span>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-200">Site Assessment Details</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {metrics.map((m, i) => (
                <div key={i} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {m.icon} {m.label}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Facilities */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Hospital className="h-4 w-4 text-rose-400" /> Nearest Hospital
              </div>
              <p className="mt-1 text-sm font-medium text-slate-200">{site.nearestHospital}</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <School className="h-4 w-4 text-amber-400" /> Nearest School
              </div>
              <p className="mt-1 text-sm font-medium text-slate-200">{site.nearestSchool}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3">
            <h3 className="mb-1 text-sm font-semibold text-sky-300">Recommendation</h3>
            <p className="text-xs text-slate-300">{site.recommendation}</p>
          </div>

          {/* Coordinates */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}
