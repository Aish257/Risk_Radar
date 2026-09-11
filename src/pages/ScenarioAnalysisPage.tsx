import { useState, useMemo } from 'react';
import type { Habitation, ScenarioConfig, ScenarioResult } from '@/types';
import { runScenario, DEFAULT_SCENARIO, EXTREME_RAINFALL_SCENARIO } from '@/lib/scenarioEngine';
import { RiskBadge, riskColor } from '@/components/ui/Badges';
import { classifyRisk } from '@/lib/riskEngine';
import { Radar, CloudRain, Waves, Mountain, Users, Play, RotateCcw } from 'lucide-react';

interface ScenarioAnalysisPageProps {
  habitations: Habitation[];
}

export function ScenarioAnalysisPage({ habitations }: ScenarioAnalysisPageProps) {
  const [config, setConfig] = useState<ScenarioConfig>(DEFAULT_SCENARIO);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = () => {
    setResult(runScenario(habitations, config));
    setHasRun(true);
  };

  const handleReset = () => {
    setConfig(DEFAULT_SCENARIO);
    setResult(null);
    setHasRun(false);
  };

  const handlePreset = (preset: ScenarioConfig, name: string) => {
    setConfig(preset);
    setResult(runScenario(habitations, preset));
    setHasRun(true);
  };

  const sliderClass = "w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-sky-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Radar className="h-5 w-5 text-purple-400" />
        <h1 className="text-lg font-bold text-slate-100">Scenario Analysis</h1>
        <span className="text-xs text-slate-400">— Model "what-if" disaster scenarios for decision support</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Scenario Configuration */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Scenario Parameters</h2>

          {/* Preset Buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => handlePreset(DEFAULT_SCENARIO, 'Current')}
              className="rounded-lg border border-slate-600/40 bg-slate-700/30 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/50"
            >
              Current Conditions
            </button>
            <button
              onClick={() => handlePreset(EXTREME_RAINFALL_SCENARIO, 'Extreme')}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
            >
              Extreme Rainfall (+50%)
            </button>
            <button
              onClick={() => handlePreset({ rainfallMultiplier: 2.0, populationAffectedPct: 100, floodSeverityMultiplier: 1.5, landslideMultiplier: 1.8 }, 'Severe')}
              className="rounded-lg border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/25"
            >
              Severe Disaster (2x)
            </button>
          </div>

          <div className="space-y-4">
            {/* Rainfall */}
            <div>
              <label className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CloudRain className="h-3.5 w-3.5 text-blue-400" /> Rainfall Intensity
                </span>
                <span className="font-medium text-sky-400">{(config.rainfallMultiplier * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range" min="0.5" max="3" step="0.1"
                value={config.rainfallMultiplier}
                onChange={e => setConfig({ ...config, rainfallMultiplier: parseFloat(e.target.value) })}
                className={sliderClass}
              />
            </div>

            {/* Flood */}
            <div>
              <label className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Waves className="h-3.5 w-3.5 text-cyan-400" /> Flood Severity
                </span>
                <span className="font-medium text-sky-400">{(config.floodSeverityMultiplier * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={config.floodSeverityMultiplier}
                onChange={e => setConfig({ ...config, floodSeverityMultiplier: parseFloat(e.target.value) })}
                className={sliderClass}
              />
            </div>

            {/* Landslide */}
            <div>
              <label className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Mountain className="h-3.5 w-3.5 text-purple-400" /> Landslide Susceptibility
                </span>
                <span className="font-medium text-sky-400">{(config.landslideMultiplier * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={config.landslideMultiplier}
                onChange={e => setConfig({ ...config, landslideMultiplier: parseFloat(e.target.value) })}
                className={sliderClass}
              />
            </div>

            {/* Population Affected */}
            <div>
              <label className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Users className="h-3.5 w-3.5 text-amber-400" /> Population Affected
                </span>
                <span className="font-medium text-sky-400">{config.populationAffectedPct}%</span>
              </label>
              <input
                type="range" min="50" max="100" step="5"
                value={config.populationAffectedPct}
                onChange={e => setConfig({ ...config, populationAffectedPct: parseInt(e.target.value) })}
                className={sliderClass}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRun}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              <Play className="h-4 w-4" /> Run Scenario
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-600/40 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/30"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* Scenario Results */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Scenario Results</h2>

          {!hasRun || !result ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500">
              Configure parameters and run the scenario to see results.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Risk Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                  <p className="text-xs text-slate-400">New Average Risk Score</p>
                  <p className="mt-1 text-3xl font-bold" style={{ color: riskColor(result.newRiskLevel) }}>{result.newRiskScore}</p>
                  <div className="mt-1"><RiskBadge level={result.newRiskLevel} /></div>
                </div>
                <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                  <p className="text-xs text-slate-400">Additional Red Zone</p>
                  <p className="mt-1 text-3xl font-bold text-red-400">+{result.additionalRedZoneHabitations}</p>
                  <p className="text-xs text-slate-500">new habitations in critical</p>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                  <span className="text-xs text-slate-400">Affected Habitations (High + Critical)</span>
                  <span className="text-lg font-bold text-orange-400">{result.affectedHabitations}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                  <span className="text-xs text-slate-400">Habitations Requiring Relocation</span>
                  <span className="text-lg font-bold text-red-400">{result.relocationRequired}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                  <span className="text-xs text-slate-400">Total Capacity Required</span>
                  <span className="text-lg font-bold text-amber-400">{result.requiredCapacity.toLocaleString()}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3">
                <p className="text-xs text-slate-300">{result.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {hasRun && result && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Habitation Impact Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/50 text-left text-slate-400">
                  <th className="pb-2 pr-3 font-medium">Habitation</th>
                  <th className="pb-2 pr-3 font-medium">District</th>
                  <th className="pb-2 pr-3 font-medium">Current Risk</th>
                  <th className="pb-2 pr-3 font-medium">Scenario Risk</th>
                  <th className="pb-2 pr-3 font-medium">Change</th>
                  <th className="pb-2 font-medium">New Level</th>
                </tr>
              </thead>
              <tbody>
                {habitations.map(h => {
                  const adjRainfall = h.rainfall_mm * config.rainfallMultiplier;
                  const adjFlood = Math.min(100, h.floodSusceptibility * config.floodSeverityMultiplier);
                  const adjLandslide = Math.min(100, h.landslideSusceptibility * config.landslideMultiplier);
                  const newScore = Math.min(100, Math.round(
                    (adjRainfall / 120) * 100 * 0.22 +
                    adjLandslide * 0.20 +
                    adjFlood * 0.15 +
                    (h.slope_deg / 45) * 100 * 0.10 +
                    (h.historicalEvents / 8) * 100 * 0.08 +
                    (1 - h.distanceRiver_km / 5) * 100 * 0.07 +
                    (1 - h.distanceHospital_km / 20) * 100 * 0.06 +
                    (1 - h.distanceRoad_km / 3) * 100 * 0.05 +
                    (100 - h.infrastructureScore) * 0.04
                  ));
                  const newLevel = classifyRisk(newScore);
                  const change = newScore - h.riskScore;
                  return (
                    <tr key={h.id} className="border-b border-slate-700/30">
                      <td className="py-2 pr-3 font-medium text-slate-200">{h.name}</td>
                      <td className="py-2 pr-3 text-slate-400">{h.districtName}</td>
                      <td className="py-2 pr-3 text-slate-300">{h.riskScore}</td>
                      <td className="py-2 pr-3 font-medium" style={{ color: riskColor(newLevel) }}>{newScore}</td>
                      <td className={`py-2 pr-3 font-medium ${change > 0 ? 'text-red-400' : change < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {change > 0 ? '+' : ''}{change}
                      </td>
                      <td className="py-2"><RiskBadge level={newLevel} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
