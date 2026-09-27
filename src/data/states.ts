import type { Habitation, SafeSite, RelocationPlan, District, AppState } from '@/types';
import type { AppState as AppStateEnum } from '@/lib/supabaseClient';
import { KERALA_DISTRICTS, KERALA_CENTER, KERALA_OUTLINE, DISTRICT_BOUNDARIES } from '@/data/districts';
import { HABITATIONS, SAFE_SITES, RELOCATION_PLANS, HOSPITALS, SCHOOLS, WATER_BODIES, DATA_SOURCES } from '@/data/habitations';

// ─────────────────────────────────────────────────────────
// Multi-state data architecture
//
// Each state has its own map center, zoom, outline, districts,
// habitations, safe sites, risk zones, and infrastructure.
//
// Kerala uses the existing detailed dataset.
// Uttarakhand and Odisha use representative MVP demo data.
//
// To add real data later: replace the demo arrays with data
// from authoritative GIS sources (Survey of India, Bhuvan, etc).
// ─────────────────────────────────────────────────────────

export interface RiskZonePolygon {
  coords: [number, number][];
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface StateData {
  state: AppStateEnum;
  label: string;
  center: [number, number];
  zoom: number;
  outline: [number, number][];
  districts: District[];
  districtBoundaries: Record<string, [number, number][]>;
  habitations: Habitation[];
  safeSites: SafeSite[];
  relocationPlans: RelocationPlan[];
  riskZones: RiskZonePolygon[];
  roads: [number, number][][];
  hospitals: { id: string; name: string; districtId: string; lat: number; lng: number; type: string }[];
  schools: { id: string; name: string; districtId: string; lat: number; lng: number; type: string }[];
  waterBodies: { id: string; name: string; lat: number; lng: number; type: string }[];
  hazardProfile: string[];
  dataSourceLabel: string;
}

// ─── KERALA (existing detailed data) ─────────────────────

const KERALA_RISK_ZONES: RiskZonePolygon[] = [
  { coords: [[11.42,76.15],[11.50,76.15],[11.55,76.22],[11.52,76.28],[11.45,76.28],[11.40,76.22],[11.42,76.15]], level: 'CRITICAL' },
  { coords: [[11.35,76.05],[11.45,76.05],[11.48,76.15],[11.42,76.15],[11.40,76.22],[11.35,76.18],[11.35,76.05]], level: 'HIGH' },
  { coords: [[9.95,76.95],[10.05,76.95],[10.15,77.10],[10.10,77.20],[10.00,77.15],[9.90,77.05],[9.95,76.95]], level: 'HIGH' },
  { coords: [[9.40,76.30],[9.50,76.30],[9.55,76.42],[9.48,76.48],[9.40,76.45],[9.38,76.38],[9.40,76.30]], level: 'HIGH' },
  { coords: [[9.30,76.65],[9.40,76.65],[9.45,76.80],[9.38,76.85],[9.30,76.80],[9.28,76.72],[9.30,76.65]], level: 'HIGH' },
  { coords: [[10.20,76.20],[10.40,76.20],[10.45,76.45],[10.35,76.50],[10.25,76.45],[10.20,76.30],[10.20,76.20]], level: 'MODERATE' },
  { coords: [[8.55,76.85],[8.70,76.85],[8.75,77.05],[8.65,77.10],[8.55,77.00],[8.50,76.90],[8.55,76.85]], level: 'MODERATE' },
  { coords: [[11.80,75.50],[12.00,75.50],[12.05,75.75],[11.95,75.85],[11.85,75.80],[11.80,75.65],[11.80,75.50]], level: 'MODERATE' },
  { coords: [[10.50,76.30],[10.65,76.30],[10.70,76.45],[10.60,76.50],[10.50,76.45],[10.50,76.30]], level: 'LOW' },
  { coords: [[11.00,75.70],[11.15,75.70],[11.20,75.90],[11.10,75.95],[11.00,75.90],[11.00,75.70]], level: 'LOW' },
];

const KERALA_ROADS: [number, number][][] = [
  [[11.63,76.08],[11.45,76.18],[11.52,76.22]],
  [[11.63,76.08],[11.66,76.27]],
  [[11.63,76.08],[11.80,76.00]],
  [[11.25,75.78],[11.32,75.88],[11.45,76.18]],
  [[10.52,76.21],[10.02,76.30],[9.54,76.34]],
  [[10.09,77.06],[9.92,76.98],[9.59,76.52]],
  [[8.52,76.94],[8.89,76.71],[9.54,76.34]],
];

const KERALA_DATA: StateData = {
  state: 'kerala',
  label: 'Kerala',
  center: KERALA_CENTER,
  zoom: 7,
  outline: KERALA_OUTLINE,
  districts: KERALA_DISTRICTS,
  districtBoundaries: DISTRICT_BOUNDARIES,
  habitations: HABITATIONS,
  safeSites: SAFE_SITES,
  relocationPlans: RELOCATION_PLANS,
  riskZones: KERALA_RISK_ZONES,
  roads: KERALA_ROADS,
  hospitals: HOSPITALS,
  schools: SCHOOLS,
  waterBodies: WATER_BODIES,
  hazardProfile: ['Flood', 'Landslide', 'Coastal Flooding', 'Heavy Rainfall'],
  dataSourceLabel: 'MVP Demo Data (Kerala pilot — detailed)',
};

// ─── UTTARAKHAND (representative MVP demo data) ──────────
// Representative districts: Chamoli, Rudraprayag
// Hazards: Landslide, Flash Flood, Earthquake

const UTTARAKHAND_DISTRICTS: District[] = [
  { id: 'chamoli', name: 'Chamoli', region: 'North', centroid: [30.42, 79.33], area_km2: 7520, population: 390605, hazardTypes: ['Landslide', 'Flash Flood', 'Earthquake'] },
  { id: 'rudraprayag', name: 'Rudraprayag', region: 'North', centroid: [30.28, 78.98], area_km2: 1984, population: 242068, hazardTypes: ['Landslide', 'Flash Flood'] },
];

const UTTARAKHAND_BOUNDARIES: Record<string, [number, number][]> = {
  chamoli: [[30.70,79.10],[30.65,79.40],[30.50,79.55],[30.35,79.50],[30.20,79.30],[30.15,79.00],[30.25,78.85],[30.45,78.90],[30.60,79.00],[30.70,79.10]],
  rudraprayag: [[30.45,78.85],[30.40,79.00],[30.30,79.10],[30.15,79.05],[30.10,78.85],[30.15,78.70],[30.25,78.65],[30.35,78.70],[30.45,78.85]],
};

const UTTARAKHAND_OUTLINE: [number, number][] = [
  [30.70,79.10],[30.65,79.40],[30.50,79.55],[30.35,79.50],[30.20,79.30],[30.15,79.00],[30.10,78.70],[30.15,78.55],[30.25,78.55],[30.35,78.65],[30.45,78.70],[30.55,78.80],[30.65,78.95],[30.70,79.10],
];

const UTTARAKHAND_HABITATIONS: Habitation[] = [
  {
    id: 'uk-joshimath', name: 'Joshimath', districtId: 'chamoli', districtName: 'Chamoli',
    lat: 30.55, lng: 79.57, population: 3500, elevation_m: 1875, slope_deg: 35,
    distanceRiver_km: 0.5, distanceHospital_km: 3.0, distanceSchool_km: 1.0, distanceRoad_km: 0.3,
    roadAccessibility: 'MODERATE', infrastructureScore: 45, historicalEvents: 5,
    riskScore: 85, riskLevel: 'CRITICAL', vulnerabilityScore: 80,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 72, floodSusceptibility: 55, landslideSusceptibility: 90,
    nearestHospital: 'Joshimath Base Hospital (3 km)', nearestSchool: 'Joshimath Govt School (1 km)',
    historicalEventList: ['2013 Kedarnath Flood', '2021 Landslide', '2022 Land Subsidence', '2023 Landslide', '2024 Subsidence'],
  },
  {
    id: 'uk-gopeshwar', name: 'Gopeshwar', districtId: 'chamoli', districtName: 'Chamoli',
    lat: 30.42, lng: 79.33, population: 4200, elevation_m: 1550, slope_deg: 28,
    distanceRiver_km: 1.0, distanceHospital_km: 2.0, distanceSchool_km: 0.8, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 55, historicalEvents: 3,
    riskScore: 68, riskLevel: 'HIGH', vulnerabilityScore: 60,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 60, floodSusceptibility: 40, landslideSusceptibility: 78,
    nearestHospital: 'Gopeshwar District Hospital (2 km)', nearestSchool: 'Gopeshwar Inter College (0.8 km)',
    historicalEventList: ['2013 Flash Flood', '2021 Landslide', '2023 Heavy Rainfall'],
  },
  {
    id: 'uk-tungnath', name: 'Tungnath Village', districtId: 'chamoli', districtName: 'Chamoli',
    lat: 30.49, lng: 79.22, population: 1200, elevation_m: 3400, slope_deg: 40,
    distanceRiver_km: 2.0, distanceHospital_km: 12.0, distanceSchool_km: 4.0, distanceRoad_km: 2.5,
    roadAccessibility: 'POOR', infrastructureScore: 25, historicalEvents: 4,
    riskScore: 82, riskLevel: 'CRITICAL', vulnerabilityScore: 78,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'EVACUATE',
    rainfall_mm: 65, floodSusceptibility: 30, landslideSusceptibility: 92,
    nearestHospital: 'Gopeshwar Hospital (12 km)', nearestSchool: 'Chopta PS (4 km)',
    historicalEventList: ['2013 Flash Flood', '2019 Landslide', '2021 Landslide', '2023 Heavy Rainfall'],
  },
  {
    id: 'uk-ukhimath', name: 'Ukhimath', districtId: 'rudraprayag', districtName: 'Rudraprayag',
    lat: 30.50, lng: 79.05, population: 2800, elevation_m: 1311, slope_deg: 25,
    distanceRiver_km: 0.8, distanceHospital_km: 5.0, distanceSchool_km: 1.5, distanceRoad_km: 0.5,
    roadAccessibility: 'MODERATE', infrastructureScore: 48, historicalEvents: 4,
    riskScore: 75, riskLevel: 'HIGH', vulnerabilityScore: 68,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 68, floodSusceptibility: 50, landslideSusceptibility: 82,
    nearestHospital: 'Ukhimath PHC (5 km)', nearestSchool: 'Ukhimath Inter College (1.5 km)',
    historicalEventList: ['2013 Kedarnath Flood', '2017 Landslide', '2021 Flash Flood', '2023 Landslide'],
  },
  {
    id: 'uk-agastyamuni', name: 'Agastyamuni', districtId: 'rudraprayag', districtName: 'Rudraprayag',
    lat: 30.38, lng: 78.95, population: 2100, elevation_m: 1200, slope_deg: 22,
    distanceRiver_km: 0.3, distanceHospital_km: 4.0, distanceSchool_km: 1.0, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 42, historicalEvents: 3,
    riskScore: 71, riskLevel: 'HIGH', vulnerabilityScore: 65,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 64, floodSusceptibility: 62, landslideSusceptibility: 75,
    nearestHospital: 'Agastyamuni PHC (4 km)', nearestSchool: 'Agastyamuni Govt School (1 km)',
    historicalEventList: ['2013 Flash Flood', '2021 Landslide', '2023 Heavy Rainfall'],
  },
  {
    id: 'uk-rudraprayag-town', name: 'Rudraprayag Town', districtId: 'rudraprayag', districtName: 'Rudraprayag',
    lat: 30.28, lng: 78.98, population: 5000, elevation_m: 900, slope_deg: 15,
    distanceRiver_km: 0.2, distanceHospital_km: 1.5, distanceSchool_km: 0.5, distanceRoad_km: 0.2,
    roadAccessibility: 'GOOD', infrastructureScore: 62, historicalEvents: 2,
    riskScore: 50, riskLevel: 'HIGH', vulnerabilityScore: 45,
    relocationPriority: 'MEDIUM_TERM', recommendedAction: 'MONITOR',
    rainfall_mm: 52, floodSusceptibility: 70, landslideSusceptibility: 35,
    nearestHospital: 'Rudraprayag District Hospital (1.5 km)', nearestSchool: 'Rudraprayag Govt School (0.5 km)',
    historicalEventList: ['2013 Flash Flood', '2021 Flood'],
  },
];

const UTTARAKHAND_SAFE_SITES: SafeSite[] = [
  {
    id: 'uk-site-gopeshwar', name: 'Gopeshwar Town', districtId: 'chamoli', districtName: 'Chamoli',
    lat: 30.42, lng: 79.33, suitabilityScore: 84, estimatedCapacity: 3000, existingPopulation: 1200,
    availableCapacity: 1800, floodRisk: 20, landslideRisk: 25, slope_deg: 12, elevation_m: 1550,
    roadAccessibility: 'GOOD', nearestHospital: 'Gopeshwar District Hospital (1 km)', hospitalDistance_km: 1.0,
    nearestSchool: 'Gopeshwar Inter College (0.5 km)', schoolDistance_km: 0.5, waterAvailability: 'GOOD',
    hazardExposure: 22, recommendation: 'Recommended. Good infrastructure and relatively stable ground.',
    feasibility: 'FEASIBLE', usableLand_ha: 30,
  },
  {
    id: 'uk-site-karnaprayag', name: 'Karnaprayag Town', districtId: 'chamoli', districtName: 'Chamoli',
    lat: 30.27, lng: 79.22, suitabilityScore: 78, estimatedCapacity: 2500, existingPopulation: 1000,
    availableCapacity: 1500, floodRisk: 28, landslideRisk: 30, slope_deg: 10, elevation_m: 1100,
    roadAccessibility: 'GOOD', nearestHospital: 'Karnaprayag PHC (2 km)', hospitalDistance_km: 2.0,
    nearestSchool: 'Karnaprayag Govt School (1 km)', schoolDistance_km: 1.0, waterAvailability: 'MODERATE',
    hazardExposure: 28, recommendation: 'Partially feasible. Moderate hazard exposure.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 22,
  },
  {
    id: 'uk-site-rudraprayag', name: 'Rudraprayag Town (Upper)', districtId: 'rudraprayag', districtName: 'Rudraprayag',
    lat: 30.30, lng: 78.99, suitabilityScore: 80, estimatedCapacity: 2800, existingPopulation: 1400,
    availableCapacity: 1400, floodRisk: 22, landslideRisk: 28, slope_deg: 10, elevation_m: 950,
    roadAccessibility: 'GOOD', nearestHospital: 'Rudraprayag District Hospital (0.5 km)', hospitalDistance_km: 0.5,
    nearestSchool: 'Rudraprayag Govt School (0.3 km)', schoolDistance_km: 0.3, waterAvailability: 'GOOD',
    hazardExposure: 25, recommendation: 'Recommended. Good accessibility and infrastructure.',
    feasibility: 'FEASIBLE', usableLand_ha: 25,
  },
  {
    id: 'uk-site-tilwara', name: 'Tilwara Plateau', districtId: 'rudraprayag', districtName: 'Rudraprayag',
    lat: 30.35, lng: 79.02, suitabilityScore: 72, estimatedCapacity: 2000, existingPopulation: 500,
    availableCapacity: 1500, floodRisk: 30, landslideRisk: 35, slope_deg: 14, elevation_m: 1100,
    roadAccessibility: 'MODERATE', nearestHospital: 'Rudraprayag Hospital (5 km)', hospitalDistance_km: 5.0,
    nearestSchool: 'Tilwara PS (2 km)', schoolDistance_km: 2.0, waterAvailability: 'MODERATE',
    hazardExposure: 32, recommendation: 'Partially feasible. Moderate access and some landslide risk.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 18,
  },
];

const UTTARAKHAND_RISK_ZONES: RiskZonePolygon[] = [
  { coords: [[30.50,79.50],[30.58,79.55],[30.60,79.68],[30.52,79.72],[30.45,79.65],[30.48,79.55],[30.50,79.50]], level: 'CRITICAL' },
  { coords: [[30.40,79.15],[30.50,79.15],[30.55,79.30],[30.48,79.40],[30.38,79.35],[30.35,79.25],[30.40,79.15]], level: 'HIGH' },
  { coords: [[30.20,78.80],[30.35,78.80],[30.40,78.95],[30.30,79.05],[30.18,79.00],[30.15,78.88],[30.20,78.80]], level: 'HIGH' },
  { coords: [[30.10,79.00],[30.25,79.00],[30.30,79.20],[30.20,79.25],[30.10,79.15],[30.08,79.05],[30.10,79.00]], level: 'MODERATE' },
  { coords: [[30.30,79.20],[30.42,79.20],[30.45,79.35],[30.35,79.40],[30.28,79.30],[30.30,79.20]], level: 'LOW' },
];

const UTTARAKHAND_ROADS: [number, number][][] = [
  [[30.28,78.98],[30.38,79.02],[30.42,79.33]],
  [[30.42,79.33],[30.50,79.45],[30.55,79.57]],
  [[30.28,78.98],[30.35,78.90],[30.50,79.05]],
  [[30.27,79.22],[30.35,79.28],[30.42,79.33]],
];

const UTTARAKHAND_HOSPITALS = [
  { id: 'uk-hosp-gopeshwar', name: 'Gopeshwar District Hospital', districtId: 'chamoli', lat: 30.42, lng: 79.33, type: 'District Hospital' },
  { id: 'uk-hosp-joshimath', name: 'Joshimath Base Hospital', districtId: 'chamoli', lat: 30.55, lng: 79.57, type: 'Base Hospital' },
  { id: 'uk-hosp-rudraprayag', name: 'Rudraprayag District Hospital', districtId: 'rudraprayag', lat: 30.28, lng: 78.98, type: 'District Hospital' },
];

const UTTARAKHAND_SCHOOLS = [
  { id: 'uk-sch-gopeshwar', name: 'Gopeshwar Inter College', districtId: 'chamoli', lat: 30.42, lng: 79.33, type: 'Inter College' },
  { id: 'uk-sch-joshimath', name: 'Joshimath Govt School', districtId: 'chamoli', lat: 30.55, lng: 79.57, type: 'Govt School' },
  { id: 'uk-sch-ukhimath', name: 'Ukhimath Inter College', districtId: 'rudraprayag', lat: 30.50, lng: 79.05, type: 'Inter College' },
];

const UTTARAKHAND_WATER_BODIES = [
  { id: 'uk-wb-alaknanda', name: 'Alaknanda River', lat: 30.32, lng: 79.10, type: 'River' },
  { id: 'uk-wb-mandakini', name: 'Mandakini River', lat: 30.40, lng: 79.00, type: 'River' },
];

const UTTARAKHAND_DATA: StateData = {
  state: 'uttarakhand',
  label: 'Uttarakhand',
  center: [30.40, 79.15],
  zoom: 9,
  outline: UTTARAKHAND_OUTLINE,
  districts: UTTARAKHAND_DISTRICTS,
  districtBoundaries: UTTARAKHAND_BOUNDARIES,
  habitations: UTTARAKHAND_HABITATIONS,
  safeSites: UTTARAKHAND_SAFE_SITES,
  relocationPlans: [
    { id: 'uk-rp-1', habitationId: 'uk-joshimath', habitationName: 'Joshimath', districtName: 'Chamoli', affectedPopulation: 3500, priority: 'IMMEDIATE', recommendedSiteId: 'uk-site-gopeshwar', recommendedSiteName: 'Gopeshwar Town', siteCapacity: 3000, siteAvailableCapacity: 1800, suitabilityScore: 84, feasibility: 'FEASIBLE', status: 'PLANNED' },
    { id: 'uk-rp-2', habitationId: 'uk-tungnath', habitationName: 'Tungnath Village', districtName: 'Chamoli', affectedPopulation: 1200, priority: 'IMMEDIATE', recommendedSiteId: 'uk-site-karnaprayag', recommendedSiteName: 'Karnaprayag Town', siteCapacity: 2500, siteAvailableCapacity: 1500, suitabilityScore: 78, feasibility: 'PARTIALLY_FEASIBLE', status: 'APPROVED' },
    { id: 'uk-rp-3', habitationId: 'uk-ukhimath', habitationName: 'Ukhimath', districtName: 'Rudraprayag', affectedPopulation: 2800, priority: 'SHORT_TERM', recommendedSiteId: 'uk-site-rudraprayag', recommendedSiteName: 'Rudraprayag Town (Upper)', siteCapacity: 2800, siteAvailableCapacity: 1400, suitabilityScore: 80, feasibility: 'FEASIBLE', status: 'PLANNED' },
    { id: 'uk-rp-4', habitationId: 'uk-agastyamuni', habitationName: 'Agastyamuni', districtName: 'Rudraprayag', affectedPopulation: 2100, priority: 'SHORT_TERM', recommendedSiteId: 'uk-site-tilwara', recommendedSiteName: 'Tilwara Plateau', siteCapacity: 2000, siteAvailableCapacity: 1500, suitabilityScore: 72, feasibility: 'PARTIALLY_FEASIBLE', status: 'PLANNED' },
  ],
  riskZones: UTTARAKHAND_RISK_ZONES,
  roads: UTTARAKHAND_ROADS,
  hospitals: UTTARAKHAND_HOSPITALS,
  schools: UTTARAKHAND_SCHOOLS,
  waterBodies: UTTARAKHAND_WATER_BODIES,
  hazardProfile: ['Landslide', 'Flash Flood', 'Earthquake', 'Land Subsidence'],
  dataSourceLabel: 'MVP Demo Data (Uttarakhand — representative)',
};

// ─── ODISHA (representative MVP demo data) ───────────────
// Representative districts: Kendrapara, Ganjam
// Hazards: Cyclone, Flood, Coastal Surge

const ODISHA_DISTRICTS: District[] = [
  { id: 'kendrapara', name: 'Kendrapara', region: 'Central', centroid: [20.50, 86.42], area_km2: 2693, population: 1437527, hazardTypes: ['Cyclone', 'Flood', 'Coastal Surge'] },
  { id: 'ganjam', name: 'Ganjam', region: 'South', centroid: [19.48, 85.07], area_km2: 8070, population: 3529031, hazardTypes: ['Cyclone', 'Flood', 'Coastal Surge'] },
];

const ODISHA_BOUNDARIES: Record<string, [number, number][]> = {
  kendrapara: [[20.75,86.20],[20.70,86.50],[20.55,86.60],[20.40,86.55],[20.30,86.40],[20.35,86.15],[20.50,86.10],[20.65,86.15],[20.75,86.20]],
  ganjam: [[19.80,84.75],[19.75,85.10],[19.60,85.35],[19.40,85.40],[19.25,85.25],[19.20,85.00],[19.30,84.80],[19.50,84.70],[19.70,84.72],[19.80,84.75]],
};

const ODISHA_OUTLINE: [number, number][] = [
  [20.75,86.20],[20.70,86.50],[20.55,86.60],[20.40,86.55],[20.30,86.40],[20.10,86.20],[19.80,85.80],[19.75,85.40],[19.60,85.35],[19.40,85.40],[19.25,85.25],[19.20,85.00],[19.30,84.75],[19.50,84.65],[19.70,84.70],[19.90,84.80],[20.10,85.00],[20.30,85.30],[20.50,85.60],[20.65,85.90],[20.75,86.05],[20.75,86.20],
];

const ODISHA_HABITATIONS: Habitation[] = [
  {
    id: 'od-kendrapara-coastal', name: 'Kendrapara Coastal', districtId: 'kendrapara', districtName: 'Kendrapara',
    lat: 20.50, lng: 86.42, population: 5500, elevation_m: 8, slope_deg: 2,
    distanceRiver_km: 0.3, distanceHospital_km: 6.0, distanceSchool_km: 1.0, distanceRoad_km: 0.5,
    roadAccessibility: 'MODERATE', infrastructureScore: 40, historicalEvents: 5,
    riskScore: 83, riskLevel: 'CRITICAL', vulnerabilityScore: 78,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 85, floodSusceptibility: 92, landslideSusceptibility: 5,
    nearestHospital: 'Kendrapara District Hospital (6 km)', nearestSchool: 'Kendrapara Govt School (1 km)',
    historicalEventList: ['2013 Phailin Cyclone', '2018 Cyclone Titli', '2019 Cyclone Fani', '2020 Flood', '2023 Cyclone Biparjoy'],
  },
  {
    id: 'od-raghunathpur', name: 'Raghunathpur', districtId: 'kendrapara', districtName: 'Kendrapara',
    lat: 20.58, lng: 86.35, population: 3200, elevation_m: 10, slope_deg: 3,
    distanceRiver_km: 0.5, distanceHospital_km: 4.0, distanceSchool_km: 1.5, distanceRoad_km: 0.3,
    roadAccessibility: 'MODERATE', infrastructureScore: 48, historicalEvents: 4,
    riskScore: 76, riskLevel: 'HIGH', vulnerabilityScore: 70,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 75, floodSusceptibility: 85, landslideSusceptibility: 3,
    nearestHospital: 'Kendrapara Hospital (4 km)', nearestSchool: 'Raghunathpur UPS (1.5 km)',
    historicalEventList: ['2013 Phailin', '2019 Cyclone Fani', '2020 Flood', '2023 Flood'],
  },
  {
    id: 'od-mahakalapada', name: 'Mahakalapada', districtId: 'kendrapara', districtName: 'Kendrapara',
    lat: 20.45, lng: 86.50, population: 2800, elevation_m: 5, slope_deg: 1,
    distanceRiver_km: 0.2, distanceHospital_km: 10.0, distanceSchool_km: 2.0, distanceRoad_km: 1.0,
    roadAccessibility: 'POOR', infrastructureScore: 28, historicalEvents: 6,
    riskScore: 88, riskLevel: 'CRITICAL', vulnerabilityScore: 85,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'EVACUATE',
    rainfall_mm: 90, floodSusceptibility: 95, landslideSusceptibility: 2,
    nearestHospital: 'Kendrapara Hospital (10 km)', nearestSchool: 'Mahakalapada PS (2 km)',
    historicalEventList: ['2013 Phailin', '2018 Titli', '2019 Fani', '2020 Flood', '2021 Yaas', '2023 Flood'],
  },
  {
    id: 'od-gopalpur', name: 'Gopalpur Coastal', districtId: 'ganjam', districtName: 'Ganjam',
    lat: 19.27, lng: 84.92, population: 3800, elevation_m: 12, slope_deg: 3,
    distanceRiver_km: 0.4, distanceHospital_km: 5.0, distanceSchool_km: 1.2, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 45, historicalEvents: 5,
    riskScore: 81, riskLevel: 'CRITICAL', vulnerabilityScore: 75,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 80, floodSusceptibility: 88, landslideSusceptibility: 8,
    nearestHospital: 'Ganjam District Hospital (5 km)', nearestSchool: 'Gopalpur UPS (1.2 km)',
    historicalEventList: ['2013 Phailin', '2018 Titli', '2019 Fani', '2020 Flood', '2023 Flood'],
  },
  {
    id: 'od-berhampur-outskirts', name: 'Berhampur Outskirts', districtId: 'ganjam', districtName: 'Ganjam',
    lat: 19.32, lng: 84.80, population: 6000, elevation_m: 25, slope_deg: 5,
    distanceRiver_km: 0.8, distanceHospital_km: 3.0, distanceSchool_km: 1.0, distanceRoad_km: 0.3,
    roadAccessibility: 'GOOD', infrastructureScore: 60, historicalEvents: 3,
    riskScore: 62, riskLevel: 'HIGH', vulnerabilityScore: 55,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 65, floodSusceptibility: 72, landslideSusceptibility: 12,
    nearestHospital: 'Berhampur Medical College (3 km)', nearestSchool: 'Berhampur GHSS (1 km)',
    historicalEventList: ['2013 Phailin', '2019 Fani', '2023 Flood'],
  },
  {
    id: 'od-chhatrapur', name: 'Chhatrapur', districtId: 'ganjam', districtName: 'Ganjam',
    lat: 19.35, lng: 85.05, population: 4200, elevation_m: 15, slope_deg: 4,
    distanceRiver_km: 0.5, distanceHospital_km: 4.5, distanceSchool_km: 1.0, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 50, historicalEvents: 4,
    riskScore: 70, riskLevel: 'HIGH', vulnerabilityScore: 62,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 70, floodSusceptibility: 80, landslideSusceptibility: 10,
    nearestHospital: 'Chhatrapur Hospital (4.5 km)', nearestSchool: 'Chhatrapur Govt School (1 km)',
    historicalEventList: ['2013 Phailin', '2019 Fani', '2020 Flood', '2023 Flood'],
  },
];

const ODISHA_SAFE_SITES: SafeSite[] = [
  {
    id: 'od-site-kendrapara-town', name: 'Kendrapara Town', districtId: 'kendrapara', districtName: 'Kendrapara',
    lat: 20.50, lng: 86.38, suitabilityScore: 85, estimatedCapacity: 4000, existingPopulation: 1500,
    availableCapacity: 2500, floodRisk: 22, landslideRisk: 5, slope_deg: 4, elevation_m: 15,
    roadAccessibility: 'GOOD', nearestHospital: 'Kendrapara District Hospital (1 km)', hospitalDistance_km: 1.0,
    nearestSchool: 'Kendrapara Govt School (0.5 km)', schoolDistance_km: 0.5, waterAvailability: 'GOOD',
    hazardExposure: 20, recommendation: 'Recommended. Elevated town center with good infrastructure.',
    feasibility: 'FEASIBLE', usableLand_ha: 40,
  },
  {
    id: 'od-site-derabish', name: 'Derabish (Inland)', districtId: 'kendrapara', districtName: 'Kendrapara',
    lat: 20.60, lng: 86.30, suitabilityScore: 80, estimatedCapacity: 3500, existingPopulation: 1200,
    availableCapacity: 2300, floodRisk: 25, landslideRisk: 3, slope_deg: 3, elevation_m: 20,
    roadAccessibility: 'GOOD', nearestHospital: 'Derabish PHC (2 km)', hospitalDistance_km: 2.0,
    nearestSchool: 'Derabish UPS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'MODERATE',
    hazardExposure: 24, recommendation: 'Recommended. Inland location with lower coastal exposure.',
    feasibility: 'FEASIBLE', usableLand_ha: 35,
  },
  {
    id: 'od-site-berhampur', name: 'Berhampur City Center', districtId: 'ganjam', districtName: 'Ganjam',
    lat: 19.30, lng: 84.79, suitabilityScore: 88, estimatedCapacity: 5000, existingPopulation: 2000,
    availableCapacity: 3000, floodRisk: 18, landslideRisk: 8, slope_deg: 6, elevation_m: 30,
    roadAccessibility: 'GOOD', nearestHospital: 'Berhampur Medical College (2 km)', hospitalDistance_km: 2.0,
    nearestSchool: 'Berhampur GHSS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'GOOD',
    hazardExposure: 15, recommendation: 'Highly recommended. Major city with excellent infrastructure.',
    feasibility: 'FEASIBLE', usableLand_ha: 60,
  },
  {
    id: 'od-site-aska', name: 'Aska Town', districtId: 'ganjam', districtName: 'Ganjam',
    lat: 19.60, lng: 84.65, suitabilityScore: 78, estimatedCapacity: 3000, existingPopulation: 1300,
    availableCapacity: 1700, floodRisk: 28, landslideRisk: 10, slope_deg: 5, elevation_m: 25,
    roadAccessibility: 'GOOD', nearestHospital: 'Aska Hospital (1.5 km)', hospitalDistance_km: 1.5,
    nearestSchool: 'Aska Govt School (0.8 km)', schoolDistance_km: 0.8, waterAvailability: 'MODERATE',
    hazardExposure: 28, recommendation: 'Partially feasible. Inland but moderate flood risk.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 25,
  },
];

const ODISHA_RISK_ZONES: RiskZonePolygon[] = [
  { coords: [[20.40,86.45],[20.50,86.45],[20.55,86.55],[20.48,86.60],[20.40,86.55],[20.38,86.48],[20.40,86.45]], level: 'CRITICAL' },
  { coords: [[20.30,86.30],[20.42,86.30],[20.48,86.45],[20.40,86.50],[20.28,86.45],[20.25,86.35],[20.30,86.30]], level: 'HIGH' },
  { coords: [[19.20,84.85],[19.30,84.85],[19.35,85.00],[19.28,85.10],[19.18,85.05],[19.15,84.92],[19.20,84.85]], level: 'CRITICAL' },
  { coords: [[19.30,84.70],[19.45,84.70],[19.50,84.90],[19.40,84.95],[19.28,84.88],[19.25,84.78],[19.30,84.70]], level: 'HIGH' },
  { coords: [[19.45,84.95],[19.60,84.95],[19.65,85.15],[19.55,85.20],[19.45,85.10],[19.42,85.00],[19.45,84.95]], level: 'MODERATE' },
  { coords: [[20.55,86.20],[20.65,86.20],[20.70,86.35],[20.60,86.40],[20.52,86.30],[20.55,86.20]], level: 'MODERATE' },
  { coords: [[20.45,86.35],[20.55,86.35],[20.58,86.48],[20.48,86.50],[20.42,86.42],[20.45,86.35]], level: 'LOW' },
];

const ODISHA_ROADS: [number, number][][] = [
  [[20.50,86.38],[20.45,86.45],[20.40,86.50]],
  [[20.50,86.38],[20.58,86.35],[20.60,86.30]],
  [[19.30,84.79],[19.32,84.85],[19.35,85.00]],
  [[19.30,84.79],[19.40,84.75],[19.50,84.70]],
  [[19.60,84.65],[19.50,84.80],[19.35,85.05]],
];

const ODISHA_HOSPITALS = [
  { id: 'od-hosp-kendrapara', name: 'Kendrapara District Hospital', districtId: 'kendrapara', lat: 20.50, lng: 86.38, type: 'District Hospital' },
  { id: 'od-hosp-berhampur', name: 'Berhampur Medical College', districtId: 'ganjam', lat: 19.30, lng: 84.79, type: 'Medical College' },
  { id: 'od-hosp-chhatrapur', name: 'Chhatrapur Hospital', districtId: 'ganjam', lat: 19.35, lng: 85.05, type: 'District Hospital' },
];

const ODISHA_SCHOOLS = [
  { id: 'od-sch-kendrapara', name: 'Kendrapara Govt School', districtId: 'kendrapara', lat: 20.50, lng: 86.38, type: 'Govt School' },
  { id: 'od-sch-berhampur', name: 'Berhampur GHSS', districtId: 'ganjam', lat: 19.30, lng: 84.79, type: 'GHSS' },
  { id: 'od-sch-gopalpur', name: 'Gopalpur UPS', districtId: 'ganjam', lat: 19.27, lng: 84.92, type: 'UPS' },
];

const ODISHA_WATER_BODIES = [
  { id: 'od-wb-bay-bengal-n', name: 'Bay of Bengal (Kendrapara coast)', lat: 20.40, lng: 86.60, type: 'Sea' },
  { id: 'od-wb-bay-bengal-s', name: 'Bay of Bengal (Ganjam coast)', lat: 19.20, lng: 85.00, type: 'Sea' },
  { id: 'od-wb-rushikulya', name: 'Rushikulya River', lat: 19.40, lng: 84.95, type: 'River' },
  { id: 'od-wb-karbani', name: 'Karbani River', lat: 20.45, lng: 86.35, type: 'River' },
];

const ODISHA_DATA: StateData = {
  state: 'odisha',
  label: 'Odisha',
  center: [19.90, 85.40],
  zoom: 8,
  outline: ODISHA_OUTLINE,
  districts: ODISHA_DISTRICTS,
  districtBoundaries: ODISHA_BOUNDARIES,
  habitations: ODISHA_HABITATIONS,
  safeSites: ODISHA_SAFE_SITES,
  relocationPlans: [
    { id: 'od-rp-1', habitationId: 'od-mahakalapada', habitationName: 'Mahakalapada', districtName: 'Kendrapara', affectedPopulation: 2800, priority: 'IMMEDIATE', recommendedSiteId: 'od-site-kendrapara-town', recommendedSiteName: 'Kendrapara Town', siteCapacity: 4000, siteAvailableCapacity: 2500, suitabilityScore: 85, feasibility: 'FEASIBLE', status: 'APPROVED' },
    { id: 'od-rp-2', habitationId: 'od-kendrapara-coastal', habitationName: 'Kendrapara Coastal', districtName: 'Kendrapara', affectedPopulation: 5500, priority: 'IMMEDIATE', recommendedSiteId: 'od-site-derabish', recommendedSiteName: 'Derabish (Inland)', siteCapacity: 3500, siteAvailableCapacity: 2300, suitabilityScore: 80, feasibility: 'FEASIBLE', status: 'PLANNED' },
    { id: 'od-rp-3', habitationId: 'od-gopalpur', habitationName: 'Gopalpur Coastal', districtName: 'Ganjam', affectedPopulation: 3800, priority: 'IMMEDIATE', recommendedSiteId: 'od-site-berhampur', recommendedSiteName: 'Berhampur City Center', siteCapacity: 5000, siteAvailableCapacity: 3000, suitabilityScore: 88, feasibility: 'FEASIBLE', status: 'IN_PROGRESS' },
    { id: 'od-rp-4', habitationId: 'od-chhatrapur', habitationName: 'Chhatrapur', districtName: 'Ganjam', affectedPopulation: 4200, priority: 'SHORT_TERM', recommendedSiteId: 'od-site-aska', recommendedSiteName: 'Aska Town', siteCapacity: 3000, siteAvailableCapacity: 1700, suitabilityScore: 78, feasibility: 'PARTIALLY_FEASIBLE', status: 'PLANNED' },
  ],
  riskZones: ODISHA_RISK_ZONES,
  roads: ODISHA_ROADS,
  hospitals: ODISHA_HOSPITALS,
  schools: ODISHA_SCHOOLS,
  waterBodies: ODISHA_WATER_BODIES,
  hazardProfile: ['Cyclone', 'Flood', 'Coastal Surge', 'Heavy Rainfall'],
  dataSourceLabel: 'MVP Demo Data (Odisha — representative)',
};

// ─── Registry & accessor ─────────────────────────────────

const STATE_REGISTRY: Record<AppStateEnum, StateData> = {
  kerala: KERALA_DATA,
  uttarakhand: UTTARAKHAND_DATA,
  odisha: ODISHA_DATA,
};

export function getStateData(state: AppStateEnum): StateData {
  return STATE_REGISTRY[state];
}

export function getDistrictsForState(state: AppStateEnum): District[] {
  return STATE_REGISTRY[state].districts;
}

export function getDefaultDistrictForState(state: AppStateEnum): string {
  return STATE_REGISTRY[state].districts[0]?.id ?? '';
}

export { DATA_SOURCES };
