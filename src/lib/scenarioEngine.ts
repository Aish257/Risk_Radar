import type { Habitation, ScenarioConfig, ScenarioResult } from '@/types';
import { classifyRisk, calculateRisk, classifyPriority, calculateVulnerabilityScore, recommendAction, type RiskInput } from './riskEngine';

/**
 * Scenario Analysis Engine
 *
 * Allows authorities to model "what-if" scenarios by modifying hazard parameters
 * and seeing the impact on risk scores, affected habitations, and relocation needs.
 */
export function runScenario(habitations: Habitation[], config: ScenarioConfig): ScenarioResult {
  let additionalRedZoneHabitations = 0;
  let affectedHabitations = 0;
  let relocationRequired = 0;
  let requiredCapacity = 0;
  const riskScores: number[] = [];

  habitations.forEach(h => {
    const adjustedRainfall = h.rainfall_mm * config.rainfallMultiplier;
    const adjustedFlood = Math.min(100, h.floodSusceptibility * config.floodSeverityMultiplier);
    const adjustedLandslide = Math.min(100, h.landslideSusceptibility * config.landslideMultiplier);

    const riskInput: RiskInput = {
      rainfall_mm: adjustedRainfall,
      floodSusceptibility: adjustedFlood,
      landslideSusceptibility: adjustedLandslide,
      slope_deg: h.slope_deg,
      elevation_m: h.elevation_m,
      distanceRiver_km: h.distanceRiver_km,
      distanceHospital_km: h.distanceHospital_km,
      distanceRoad_km: h.distanceRoad_km,
      population: h.population,
      infrastructureScore: h.infrastructureScore,
      historicalEvents: h.historicalEvents,
    };

    const risk = calculateRisk(riskInput);
    const newLevel = classifyRisk(risk.score);
    riskScores.push(risk.score);

    const wasRedZone = h.riskLevel === 'CRITICAL';
    const isRedZone = newLevel === 'CRITICAL';
    if (isRedZone && !wasRedZone) additionalRedZoneHabitations++;
    if (newLevel === 'HIGH' || newLevel === 'CRITICAL') affectedHabitations++;

    const vuln = calculateVulnerabilityScore(h);
    const priority = classifyPriority(risk.score, vuln, h.roadAccessibility, h.historicalEvents);
    const action = recommendAction(newLevel, priority);

    if (priority === 'IMMEDIATE' || priority === 'SHORT_TERM' || action === 'EVACUATE' || action === 'RELOCATE') {
      relocationRequired++;
      requiredCapacity += Math.round(h.population * (config.populationAffectedPct / 100));
    }
  });

  const avgRisk = riskScores.length > 0
    ? Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length)
    : 0;
  const newRiskLevel = classifyRisk(avgRisk);

  const summary = `Scenario with ${(config.rainfallMultiplier * 100).toFixed(0)}% rainfall, ${(config.floodSeverityMultiplier * 100).toFixed(0)}% flood severity, and ${(config.landslideMultiplier * 100).toFixed(0)}% landslide susceptibility. Average risk score: ${avgRisk}/100 (${newRiskLevel}). ${additionalRedZoneHabitations} additional habitations enter red zone. ${relocationRequired} habitations require relocation with ${requiredCapacity.toLocaleString()} total capacity needed.`;

  return {
    newRiskScore: avgRisk,
    newRiskLevel,
    affectedHabitations,
    additionalRedZoneHabitations,
    relocationRequired,
    requiredCapacity,
    summary,
  };
}

export const DEFAULT_SCENARIO: ScenarioConfig = {
  rainfallMultiplier: 1.0,
  populationAffectedPct: 80,
  floodSeverityMultiplier: 1.0,
  landslideMultiplier: 1.0,
};

export const EXTREME_RAINFALL_SCENARIO: ScenarioConfig = {
  rainfallMultiplier: 1.5,
  populationAffectedPct: 90,
  floodSeverityMultiplier: 1.3,
  landslideMultiplier: 1.4,
};
