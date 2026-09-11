// RiskRadar — Core domain types

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RelocationPriority =
  | 'IMMEDIATE'
  | 'SHORT_TERM'
  | 'MEDIUM_TERM'
  | 'NONE';

export type RecommendedAction = 'MONITOR' | 'PREPARE' | 'EVACUATE' | 'RELOCATE';

export type FeasibilityStatus = 'FEASIBLE' | 'PARTIALLY_FEASIBLE' | 'NOT_FEASIBLE';

export interface District {
  id: string;
  name: string;
  region: 'North' | 'Central' | 'South';
  centroid: [number, number];
  area_km2: number;
  population: number;
  hazardTypes: string[];
}

export interface Habitation {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  lat: number;
  lng: number;
  population: number;
  elevation_m: number;
  slope_deg: number;
  distanceRiver_km: number;
  distanceHospital_km: number;
  distanceSchool_km: number;
  distanceRoad_km: number;
  roadAccessibility: 'GOOD' | 'MODERATE' | 'POOR';
  infrastructureScore: number;
  historicalEvents: number;
  riskScore: number;
  riskLevel: RiskLevel;
  vulnerabilityScore: number;
  relocationPriority: RelocationPriority;
  recommendedAction: RecommendedAction;
  rainfall_mm: number;
  floodSusceptibility: number;
  landslideSusceptibility: number;
  nearestHospital: string;
  nearestSchool: string;
  historicalEventList: string[];
}

export interface RiskFactor {
  name: string;
  contribution: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface SafeSite {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  lat: number;
  lng: number;
  suitabilityScore: number;
  estimatedCapacity: number;
  existingPopulation: number;
  availableCapacity: number;
  floodRisk: number;
  landslideRisk: number;
  slope_deg: number;
  elevation_m: number;
  roadAccessibility: 'GOOD' | 'MODERATE' | 'POOR';
  nearestHospital: string;
  hospitalDistance_km: number;
  nearestSchool: string;
  schoolDistance_km: number;
  waterAvailability: 'GOOD' | 'MODERATE' | 'POOR';
  hazardExposure: number;
  recommendation: string;
  feasibility: FeasibilityStatus;
  usableLand_ha: number;
}

export interface CarryingCapacity {
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

export interface RelocationPlan {
  id: string;
  habitationId: string;
  habitationName: string;
  districtName: string;
  affectedPopulation: number;
  priority: RelocationPriority;
  recommendedSiteId: string;
  recommendedSiteName: string;
  siteCapacity: number;
  siteAvailableCapacity: number;
  suitabilityScore: number;
  feasibility: FeasibilityStatus;
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface DataSource {
  id: string;
  name: string;
  fullName: string;
  dataType: string;
  updateFrequency: 'Real-time' | 'Dynamic' | 'Baseline' | 'Static';
  status: 'Connected' | 'Demo' | 'Available' | 'Offline';
  lastUpdated: string;
  description: string;
}

export interface HazardUpdate {
  rainfall_mm: number;
  rainfall_1h_mm: number;
  rainfall_24h_mm: number;
  temperature_c: number;
  humidity_pct: number;
  windSpeed_kmph: number;
  weatherWarning: string;
  floodRisk: RiskLevel;
  landslideRisk: RiskLevel;
  overallRisk: number;
  overallRiskLevel: RiskLevel;
  timestamp: string;
}

export interface ScenarioConfig {
  rainfallMultiplier: number;
  populationAffectedPct: number;
  floodSeverityMultiplier: number;
  landslideMultiplier: number;
}

export interface ScenarioResult {
  newRiskScore: number;
  newRiskLevel: RiskLevel;
  affectedHabitations: number;
  additionalRedZoneHabitations: number;
  relocationRequired: number;
  requiredCapacity: number;
  summary: string;
}

export interface KPISummary {
  totalDistricts: number;
  highCriticalZones: number;
  vulnerableHabitations: number;
  immediateRelocation: number;
  availableSafeSites: number;
  totalRelocationCapacity: number;
}

export type MapLayerKey =
  | 'riskZones'
  | 'rainfall'
  | 'flood'
  | 'landslide'
  | 'habitations'
  | 'safeSites'
  | 'roads'
  | 'hospitals'
  | 'schools'
  | 'waterBodies';

export interface MapLayerConfig {
  key: MapLayerKey;
  label: string;
  icon: string;
  enabled: boolean;
}
