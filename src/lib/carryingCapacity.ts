import type { SafeSite, Habitation, FeasibilityStatus } from '@/types';
import { clamp } from './riskEngine';

/**
 * Calculate carrying capacity for a safe site.
 * Determines whether the site can accommodate the affected population.
 */
export interface CarryingCapacityResult {
  siteId: string;
  siteName: string;
  currentPopulation: number;
  availableCapacity: number;
  additionalCapacity: number;
  capacityUtilizationPct: number;
  feasibility: FeasibilityStatus;
  waterAvailability: 'GOOD' | 'MODERATE' | 'POOR';
  healthcareFacilities: number;
  roadAccessibility: 'GOOD' | 'MODERATE' | 'POOR';
  maxPopulationDensity: number;
}

export function calculateCarryingCapacity(site: SafeSite): CarryingCapacityResult {
  const additionalCapacity = site.availableCapacity;
  const capacityUtilizationPct = site.existingPopulation > 0
    ? (site.existingPopulation / site.estimatedCapacity) * 100
    : 0;

  let feasibility: FeasibilityStatus;
  if (site.availableCapacity >= 1000 && site.suitabilityScore >= 80) {
    feasibility = 'FEASIBLE';
  } else if (site.availableCapacity >= 500 && site.suitabilityScore >= 60) {
    feasibility = 'PARTIALLY_FEASIBLE';
  } else {
    feasibility = 'NOT_FEASIBLE';
  }

  const maxDensity = Math.round((site.estimatedCapacity / site.usableLand_ha) * 10) / 10;

  return {
    siteId: site.id,
    siteName: site.name,
    currentPopulation: site.existingPopulation,
    availableCapacity: site.availableCapacity,
    additionalCapacity,
    capacityUtilizationPct: Math.round(capacityUtilizationPct * 10) / 10,
    feasibility,
    waterAvailability: site.waterAvailability,
    healthcareFacilities: site.hospitalDistance_km < 3 ? 2 : 1,
    roadAccessibility: site.roadAccessibility,
    maxPopulationDensity: maxDensity,
  };
}

/**
 * Find the best matching safe site for a given habitation.
 */
export function findBestSafeSite(habitation: Habitation, sites: SafeSite[]): SafeSite | null {
  if (habitation.relocationPriority === 'NONE') return null;

  const candidates = sites
    .filter(s => s.feasibility !== 'NOT_FEASIBLE')
    .map(s => {
      const distance = Math.sqrt(
        Math.pow(s.lat - habitation.lat, 2) + Math.pow(s.lng - habitation.lng, 2),
      );
      const capacityFit = s.availableCapacity >= habitation.population ? 100 : (s.availableCapacity / habitation.population) * 100;
      const proximityScore = clamp(100 - distance * 10);
      const matchScore = s.suitabilityScore * 0.4 + capacityFit * 0.35 + proximityScore * 0.25;

      return { site: s, matchScore, distance };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return candidates.length > 0 ? candidates[0].site : null;
}

/**
 * Safe site suitability calculation (prototype).
 * Mirrors what a trained suitability model would output.
 */
export interface SuitabilityInput {
  floodRisk: number;
  landslideRisk: number;
  slope_deg: number;
  elevation_m: number;
  roadAccessibility: 'GOOD' | 'MODERATE' | 'POOR';
  hospitalDistance_km: number;
  schoolDistance_km: number;
  waterAvailability: 'GOOD' | 'MODERATE' | 'POOR';
  usableLand_ha: number;
}

export function calculateSuitability(input: SuitabilityInput): number {
  const floodNorm = clamp(100 - input.floodRisk);
  const landslideNorm = clamp(100 - input.landslideRisk);
  const slopeNorm = clamp(100 - (input.slope_deg / 30) * 100);
  const roadNorm = input.roadAccessibility === 'GOOD' ? 100 : input.roadAccessibility === 'MODERATE' ? 60 : 30;
  const hospitalNorm = clamp(100 - (input.hospitalDistance_km / 10) * 100);
  const schoolNorm = clamp(100 - (input.schoolDistance_km / 5) * 100);
  const waterNorm = input.waterAvailability === 'GOOD' ? 100 : input.waterAvailability === 'MODERATE' ? 60 : 20;
  const landNorm = clamp((input.usableLand_ha / 80) * 100);

  const score =
    floodNorm * 0.20 +
    landslideNorm * 0.20 +
    slopeNorm * 0.10 +
    roadNorm * 0.15 +
    hospitalNorm * 0.10 +
    schoolNorm * 0.05 +
    waterNorm * 0.10 +
    landNorm * 0.10;

  return clamp(score);
}
