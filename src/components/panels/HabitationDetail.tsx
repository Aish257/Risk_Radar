import type { Habitation, SafeSite } from '@/types';
import { calculateRisk } from '@/lib/riskEngine';
import { findBestSafeSite } from '@/lib/carryingCapacity';
import { RiskBadge, PriorityBadge, ActionBadge, RiskScoreBar } from '@/components/ui/Badges';
import { X, CloudRain, Mountain, Waves, Building, Users, Route, Hospital, School, AlertTriangle, MapPin, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface HabitationDetailProps {
  habitation: Habitation;
  safeSites: SafeSite[];
  onClose: () => void;
  onFindSafeSites: () => void;
}

export function HabitationDetail({ habitation, safeSites, onClose, onFindSafeSites }: HabitationDetailProps) {
  const riskInput = {
    rainfall_mm: habitation.rainfall_mm,
    floodSusceptibility: habitation.floodSusceptibility,
    landslideSusceptibility: habitation.landslideSusceptibility,
    slope_deg: habitation.slope_deg,
    elevation_m: habitation.elevation_m,
    distanceRiver_km: habitation.distanceRiver_km,
    distanceHospital_km: habitation.distanceHospital_km,
    distanceRoad_km: habitation.distanceRoad_km,
    population: habitation.population,
    infrastructureScore: habitation.infrastructureScore,
    historicalEvents: habitation.historicalEvents,
  };
  const risk = calculateRisk(riskInput);
  const bestSite = findBestSafeSite(habitation, safeSites);

  const metrics = [
    { label: 'Rainfall', value: `${habitation.rainfall_mm.toFixed(0)} mm`, icon: <CloudRain className="h-4 w-4 text-blue-400" /> },
    { label: 'Flood Risk', value: `${habitation.floodSusceptibility}/100`, icon: <Waves className="h-4 w-4 text-cyan-400" /> },
    { label: 'Landslide Risk', value: `${habitation.landslideSusceptibility}/100`, icon: <Mountain className="h-4 w-4 text-purple-400" /> },
    { label: 'Elevation', value: `${habitation.elevation_m} m`, icon: <TrendingUp className="h-4 w-4 text-slate-400" /> },
    { label: 'Slope', value: `${habitation.slope_deg}°`, icon: <Mountain className="h-4 w-4 text-amber-400" /> },
    { label: 'Population', value: habitation.population.toLocaleString(), icon: <Users className="h-4 w-4 text-sky-400" /> },
    { label: 'Road Access', value: habitation.roadAccessibility, icon: <Route className="h-4 w-4 text-slate-400" /> },
    { label: 'Infrastructure', value: `${habitation.infrastructureScore}/100`, icon: <Building className="h-4 w-4 text-teal-400" /> },
    { label: 'Nearest Hospital', value: habitation.nearestHospital, icon: <Hospital className="h-4 w-4 text-rose-400" /> },
    { label: 'Nearest School', value: habitation.nearestSchool, icon: <School className="h-4 w-4 text-amber-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-700/50 bg-slate-900/95 p-4 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-400" />
              <h2 className="text-lg font-bold text-slate-100">{habitation.name}</h2>
            </div>
            <p className="mt-0.5 text-sm text-slate-400">{habitation.districtName} District · Kerala</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Risk Summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Risk Score</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: riskColorFromLevel(habitation.riskLevel) }}>{habitation.riskScore}</p>
              <div className="mt-1.5"><RiskBadge level={habitation.riskLevel} /></div>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Vulnerability</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{habitation.vulnerabilityScore}</p>
              <p className="text-xs text-slate-500">/100</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Relocation Priority</p>
              <div className="mt-1.5"><PriorityBadge priority={habitation.relocationPriority} /></div>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
              <p className="text-xs text-slate-400">Recommended Action</p>
              <div className="mt-1.5"><ActionBadge action={habitation.recommendedAction} /></div>
            </div>
          </div>

          {/* Risk Score Bar */}
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
            <p className="mb-2 text-xs font-medium text-slate-400">Composite Risk Score</p>
            <RiskScoreBar score={habitation.riskScore} />
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-200">Hazard & Infrastructure Metrics</h3>
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

          {/* Explain Risk Section */}
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
            <h3 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" /> Explain Risk — Main Contributing Factors
            </h3>
            <div className="space-y-2">
              {risk.factors.slice(0, 6).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 ${f.direction === 'positive' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {f.direction === 'positive' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-300">{f.name}</span>
                      <span className="text-slate-500">+{f.contribution.toFixed(1)} pts</span>
                    </div>
                    <p className="text-slate-500">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Prototype explainability layer — mimics SHAP-style factor attribution. Replace with SHAP values when ML model is trained.
            </p>
          </div>

          {/* Historical Events */}
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
            <h3 className="mb-2 text-sm font-semibold text-slate-200">Historical Disaster Events ({habitation.historicalEvents})</h3>
            <div className="flex flex-wrap gap-1.5">
              {habitation.historicalEventList.map((e, i) => (
                <span key={i} className="rounded-md border border-slate-600/40 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-300">
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Safe Site */}
          {bestSite && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <h3 className="mb-2 text-sm font-semibold text-emerald-300">Recommended Safe Relocation Site</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-200">{bestSite.name}</p>
                  <p className="text-xs text-slate-400">{bestSite.districtName} · Suitability: {bestSite.suitabilityScore}/100 · Capacity: {bestSite.availableCapacity.toLocaleString()}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onFindSafeSites}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Find Safe Relocation Sites
          </button>
        </div>
      </div>
    </div>
  );
}

function riskColorFromLevel(level: string): string {
  switch (level) {
    case 'LOW': return '#10b981';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#ef4444';
    default: return '#94a3b8';
  }
}
