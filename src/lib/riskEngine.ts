import type { Habitation, RiskFactor, RiskLevel, RelocationPriority, RecommendedAction, HazardUpdate } from '@/types';

/**
 * RiskRadar Prototype Risk Scoring Engine
 *
 * This is a documented prototype scoring engine — NOT a trained ML model.
 * It uses a weighted feature-combination approach that mimics the structure
 * of a trained classifier (e.g., XGBoost / Random Forest) so it can be
 * replaced once labelled historical disaster data is available.
 *
 * Features mirror those that would be fed to a real ML model:
 *  - Rainfall / rainfall intensity
 *  - Elevation, slope
 *  - Distance from river
 *  - Flood susceptibility, landslide susceptibility
 *  - Population density, infrastructure accessibility
 *  - Distance from hospital, distance from road
 *  - Historical disaster frequency
 */

const FEATURE_WEIGHTS = {
  rainfall: 0.22,
  landslideSusceptibility: 0.20,
  floodSusceptibility: 0.15,
  slope: 0.10,
  historicalEvents: 0.08,
  distanceRiver: 0.07,
  distanceHospital: 0.06,
  distanceRoad: 0.05,
  populationDensity: 0.04,
  infrastructureScore: 0.03,
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function classifyRisk(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 70) return 'HIGH';
  return 'CRITICAL';
}

export function classifyPriority(
  riskScore: number,
  vulnerabilityScore: number,
  roadAccessibility: 'GOOD' | 'MODERATE' | 'POOR',
  historicalEvents: number,
): RelocationPriority {
  const composite = riskScore * 0.5 + vulnerabilityScore * 0.35 + (roadAccessibility === 'POOR' ? 15 : roadAccessibility === 'MODERATE' ? 7 : 0) * 0.15;

  if (composite >= 75 || historicalEvents >= 5) return 'IMMEDIATE';
  if (composite >= 60) return 'SHORT_TERM';
  if (composite >= 45) return 'MEDIUM_TERM';
  return 'NONE';
}

export function recommendAction(riskLevel: RiskLevel, priority: RelocationPriority): RecommendedAction {
  if (priority === 'IMMEDIATE') return 'RELOCATE';
  if (riskLevel === 'CRITICAL') return 'EVACUATE';
  if (riskLevel === 'HIGH' || priority === 'SHORT_TERM') return 'PREPARE';
  if (riskLevel === 'MODERATE') return 'MONITOR';
  return 'MONITOR';
}

export interface RiskInput {
  rainfall_mm: number;
  floodSusceptibility: number;
  landslideSusceptibility: number;
  slope_deg: number;
  elevation_m: number;
  distanceRiver_km: number;
  distanceHospital_km: number;
  distanceRoad_km: number;
  population: number;
  infrastructureScore: number;
  historicalEvents: number;
}

export interface RiskOutput {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

/**
 * Core risk inference function.
 * Accepts feature inputs and returns a composite risk score (0-100)
 * with explainable contributing factors.
 */
export function calculateRisk(input: RiskInput): RiskOutput {
  // Normalize each feature to a 0-100 scale
  const normRainfall = clamp((input.rainfall_mm / 120) * 100);
  const normLandslide = clamp(input.landslideSusceptibility);
  const normFlood = clamp(input.floodSusceptibility);
  const normSlope = clamp((input.slope_deg / 45) * 100);
  const normHistorical = clamp((input.historicalEvents / 8) * 100);
  const normRiver = clamp((1 - input.distanceRiver_km / 5) * 100);
  const normHospital = clamp((1 - input.distanceHospital_km / 20) * 100);
  const normRoad = clamp((1 - input.distanceRoad_km / 3) * 100);
  const normInfra = clamp(100 - input.infrastructureScore);

  // Weighted sum
  const rawScore =
    normRainfall * FEATURE_WEIGHTS.rainfall +
    normLandslide * FEATURE_WEIGHTS.landslideSusceptibility +
    normFlood * FEATURE_WEIGHTS.floodSusceptibility +
    normSlope * FEATURE_WEIGHTS.slope +
    normHistorical * FEATURE_WEIGHTS.historicalEvents +
    normRiver * FEATURE_WEIGHTS.distanceRiver +
    normHospital * FEATURE_WEIGHTS.distanceHospital +
    normRoad * FEATURE_WEIGHTS.distanceRoad +
    normInfra * FEATURE_WEIGHTS.infrastructureScore;

  const score = clamp(rawScore);
  const level = classifyRisk(score);

  // Build explainable factors (SHAP-style)
  const contributions: RiskFactor[] = [
    {
      name: 'Heavy Rainfall',
      contribution: normRainfall * FEATURE_WEIGHTS.rainfall,
      direction: 'positive',
      description: `${input.rainfall_mm.toFixed(0)} mm rainfall (normalized: ${normRainfall.toFixed(0)}/100)`,
    },
    {
      name: 'Landslide Susceptibility',
      contribution: normLandslide * FEATURE_WEIGHTS.landslideSusceptibility,
      direction: 'positive',
      description: `Landslide susceptibility index: ${input.landslideSusceptibility}/100`,
    },
    {
      name: 'Flood Susceptibility',
      contribution: normFlood * FEATURE_WEIGHTS.floodSusceptibility,
      direction: 'positive',
      description: `Flood susceptibility index: ${input.floodSusceptibility}/100`,
    },
    {
      name: 'Slope Gradient',
      contribution: normSlope * FEATURE_WEIGHTS.slope,
      direction: 'positive',
      description: `Slope: ${input.slope_deg}° (normalized: ${normSlope.toFixed(0)}/100)`,
    },
    {
      name: 'Historical Disasters',
      contribution: normHistorical * FEATURE_WEIGHTS.historicalEvents,
      direction: 'positive',
      description: `${input.historicalEvents} past disaster events recorded`,
    },
    {
      name: 'Proximity to River',
      contribution: normRiver * FEATURE_WEIGHTS.distanceRiver,
      direction: 'positive',
      description: `${input.distanceRiver_km} km from nearest river`,
    },
    {
      name: 'Hospital Distance',
      contribution: normHospital * FEATURE_WEIGHTS.distanceHospital,
      direction: 'positive',
      description: `${input.distanceHospital_km} km from nearest hospital`,
    },
    {
      name: 'Road Accessibility',
      contribution: normRoad * FEATURE_WEIGHTS.distanceRoad,
      direction: input.distanceRoad_km < 0.5 ? 'negative' : 'positive',
      description: `${input.distanceRoad_km} km from nearest road`,
    },
    {
      name: 'Infrastructure Deficit',
      contribution: normInfra * FEATURE_WEIGHTS.infrastructureScore,
      direction: 'positive',
      description: `Infrastructure score: ${input.infrastructureScore}/100`,
    },
  ];

  // Sort by contribution magnitude
  contributions.sort((a, b) => b.contribution - a.contribution);

  return { score, level, factors: contributions };
}

/**
 * Calculate vulnerability score for a habitation.
 * Combines population, infrastructure, accessibility, and hazard exposure.
 */
export function calculateVulnerabilityScore(h: Habitation): number {
  const populationNorm = clamp((h.population / 6000) * 100);
  const infraNorm = clamp(100 - h.infrastructureScore);
  const accessScore =
    h.roadAccessibility === 'POOR' ? 90 : h.roadAccessibility === 'MODERATE' ? 50 : 20;
  const hazardExposure = (h.floodSusceptibility + h.landslideSusceptibility) / 2;
  const distanceScore = clamp(
    ((h.distanceHospital_km / 20) * 40 + (h.distanceSchool_km / 5) * 30 + (h.distanceRoad_km / 3) * 30),
  );

  const score =
    populationNorm * 0.15 +
    infraNorm * 0.25 +
    accessScore * 0.20 +
    hazardExposure * 0.25 +
    distanceScore * 0.15;

  return clamp(score);
}

/**
 * Generate a HazardUpdate with simulated real-time data.
 * In production, this would be replaced by actual IMD/CWC API calls.
 */
export function generateSimulatedHazardUpdate(): HazardUpdate {
  const baseRainfall = 40 + Math.random() * 50;
  const timestamp = new Date().toISOString();

  const riskInput: RiskInput = {
    rainfall_mm: baseRainfall,
    floodSusceptibility: 65,
    landslideSusceptibility: 80,
    slope_deg: 25,
    elevation_m: 800,
    distanceRiver_km: 1.0,
    distanceHospital_km: 10,
    distanceRoad_km: 1.0,
    population: 3000,
    infrastructureScore: 40,
    historicalEvents: 4,
  };

  const risk = calculateRisk(riskInput);

  return {
    rainfall_mm: Math.round(baseRainfall * 10) / 10,
    rainfall_1h_mm: Math.round((baseRainfall / 24) * 10) / 10,
    rainfall_24h_mm: Math.round(baseRainfall * 10) / 10,
    temperature_c: Math.round((22 + Math.random() * 8) * 10) / 10,
    humidity_pct: Math.round(75 + Math.random() * 20),
    windSpeed_kmph: Math.round(8 + Math.random() * 25),
    weatherWarning: baseRainfall > 70 ? 'RED ALERT: Heavy to Very Heavy Rainfall Warning' : baseRainfall > 50 ? 'ORANGE ALERT: Heavy Rainfall Warning' : 'YELLOW ALERT: Moderate Rainfall Warning',
    floodRisk: baseRainfall > 70 ? 'CRITICAL' : baseRainfall > 50 ? 'HIGH' : baseRainfall > 30 ? 'MODERATE' : 'LOW',
    landslideRisk: baseRainfall > 65 ? 'CRITICAL' : baseRainfall > 45 ? 'HIGH' : baseRainfall > 25 ? 'MODERATE' : 'LOW',
    overallRisk: risk.score,
    overallRiskLevel: risk.level,
    timestamp,
  };
}

/**
 * Recalculate a habitation's risk score with updated hazard data.
 * This demonstrates the "trained model performs new inference" pattern:
 * the model (scoring engine) stays fixed; only the input features change.
 */
export function recalculateHabitationRisk(
  h: Habitation,
  updatedRainfall: number,
  updatedFloodSusceptibility?: number,
  updatedLandslideSusceptibility?: number,
): Habitation {
  const riskInput: RiskInput = {
    rainfall_mm: updatedRainfall,
    floodSusceptibility: updatedFloodSusceptibility ?? h.floodSusceptibility,
    landslideSusceptibility: updatedLandslideSusceptibility ?? h.landslideSusceptibility,
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
  const vulnerabilityScore = calculateVulnerabilityScore(h);
  const priority = classifyPriority(risk.score, vulnerabilityScore, h.roadAccessibility, h.historicalEvents);
  const action = recommendAction(risk.level, priority);

  return {
    ...h,
    rainfall_mm: updatedRainfall,
    floodSusceptibility: updatedFloodSusceptibility ?? h.floodSusceptibility,
    landslideSusceptibility: updatedLandslideSusceptibility ?? h.landslideSusceptibility,
    riskScore: risk.score,
    riskLevel: risk.level,
    vulnerabilityScore,
    relocationPriority: priority,
    recommendedAction: action,
  };
}
