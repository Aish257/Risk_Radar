import type { Habitation, SafeSite, RelocationPlan } from '@/types';

// Sample habitations across Kerala, with heavy focus on Wayanad
// Risk scores and vulnerability are pre-calculated by the demo risk engine
export const HABITATIONS: Habitation[] = [
  // === WAYANAD (high-risk district — detailed) ===
  {
    id: 'meppadi', name: 'Meppadi', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.45, lng: 76.18, population: 4250, elevation_m: 850, slope_deg: 32,
    distanceRiver_km: 1.2, distanceHospital_km: 8.5, distanceSchool_km: 1.8, distanceRoad_km: 0.8,
    roadAccessibility: 'MODERATE', infrastructureScore: 42, historicalEvents: 6,
    riskScore: 87, riskLevel: 'CRITICAL', vulnerabilityScore: 82,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 85, floodSusceptibility: 65, landslideSusceptibility: 92,
    nearestHospital: 'Meppadi PHC (8.5 km)', nearestSchool: 'Meppadi GHSS (1.8 km)',
    historicalEventList: ['2018 Landslide', '2019 Flood', '2020 Landslide', '2021 Heavy Rainfall', '2024 Landslide', '2024 Debris Flow'],
  },
  {
    id: 'chooralmala', name: 'Chooralmala', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.52, lng: 76.22, population: 3100, elevation_m: 780, slope_deg: 28,
    distanceRiver_km: 0.8, distanceHospital_km: 12.0, distanceSchool_km: 3.2, distanceRoad_km: 1.5,
    roadAccessibility: 'POOR', infrastructureScore: 35, historicalEvents: 5,
    riskScore: 84, riskLevel: 'CRITICAL', vulnerabilityScore: 79,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'EVACUATE',
    rainfall_mm: 78, floodSusceptibility: 70, landslideSusceptibility: 88,
    nearestHospital: 'Kalpetta District Hospital (12 km)', nearestSchool: 'Chooralmala UPS (3.2 km)',
    historicalEventList: ['2018 Landslide', '2019 Flood', '2020 Mudslide', '2024 Landslide', '2024 Debris Flow'],
  },
  {
    id: 'mundakkai', name: 'Mundakkai', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.48, lng: 76.20, population: 2800, elevation_m: 920, slope_deg: 35,
    distanceRiver_km: 1.0, distanceHospital_km: 15.0, distanceSchool_km: 4.0, distanceRoad_km: 2.0,
    roadAccessibility: 'POOR', infrastructureScore: 28, historicalEvents: 7,
    riskScore: 91, riskLevel: 'CRITICAL', vulnerabilityScore: 88,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 92, floodSusceptibility: 60, landslideSusceptibility: 95,
    nearestHospital: 'Kalpetta District Hospital (15 km)', nearestSchool: 'Mundakkai LP School (4 km)',
    historicalEventList: ['2018 Landslide (severe)', '2019 Flood', '2020 Landslide', '2021 Heavy Rainfall', '2023 Landslide', '2024 Landslide (severe)', '2024 Debris Flow'],
  },
  {
    id: 'puthalmala', name: 'Puthalmala', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.62, lng: 76.15, population: 1800, elevation_m: 1100, slope_deg: 38,
    distanceRiver_km: 2.0, distanceHospital_km: 18.0, distanceSchool_km: 5.5, distanceRoad_km: 3.0,
    roadAccessibility: 'POOR', infrastructureScore: 22, historicalEvents: 4,
    riskScore: 89, riskLevel: 'CRITICAL', vulnerabilityScore: 85,
    relocationPriority: 'IMMEDIATE', recommendedAction: 'RELOCATE',
    rainfall_mm: 88, floodSusceptibility: 45, landslideSusceptibility: 94,
    nearestHospital: 'Mananthavady Hospital (18 km)', nearestSchool: 'Puthalmala LP School (5.5 km)',
    historicalEventList: ['2018 Landslide', '2020 Landslide', '2023 Heavy Rainfall', '2024 Landslide'],
  },
  {
    id: 'vellarimala', name: 'Vellarimala', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.55, lng: 76.08, population: 1500, elevation_m: 1000, slope_deg: 30,
    distanceRiver_km: 1.5, distanceHospital_km: 14.0, distanceSchool_km: 4.5, distanceRoad_km: 2.5,
    roadAccessibility: 'POOR', infrastructureScore: 30, historicalEvents: 3,
    riskScore: 76, riskLevel: 'HIGH', vulnerabilityScore: 72,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 70, floodSusceptibility: 50, landslideSusceptibility: 82,
    nearestHospital: 'Kalpetta District Hospital (14 km)', nearestSchool: 'Vellarimala LP School (4.5 km)',
    historicalEventList: ['2018 Landslide', '2020 Heavy Rainfall', '2024 Landslide'],
  },
  {
    id: 'kalpetta-rural', name: 'Kalpetta Rural', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.63, lng: 76.08, population: 5200, elevation_m: 720, slope_deg: 15,
    distanceRiver_km: 1.0, distanceHospital_km: 3.0, distanceSchool_km: 1.0, distanceRoad_km: 0.3,
    roadAccessibility: 'GOOD', infrastructureScore: 65, historicalEvents: 2,
    riskScore: 52, riskLevel: 'HIGH', vulnerabilityScore: 48,
    relocationPriority: 'MEDIUM_TERM', recommendedAction: 'MONITOR',
    rainfall_mm: 55, floodSusceptibility: 55, landslideSusceptibility: 45,
    nearestHospital: 'Kalpetta District Hospital (3 km)', nearestSchool: 'Kalpetta GHSS (1 km)',
    historicalEventList: ['2019 Flood', '2024 Heavy Rainfall'],
  },
  {
    id: 'mananthavady-rural', name: 'Mananthavady Rural', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.80, lng: 76.00, population: 3800, elevation_m: 650, slope_deg: 12,
    distanceRiver_km: 0.5, distanceHospital_km: 2.5, distanceSchool_km: 1.2, distanceRoad_km: 0.4,
    roadAccessibility: 'GOOD', infrastructureScore: 58, historicalEvents: 2,
    riskScore: 45, riskLevel: 'MODERATE', vulnerabilityScore: 40,
    relocationPriority: 'NONE', recommendedAction: 'MONITOR',
    rainfall_mm: 48, floodSusceptibility: 60, landslideSusceptibility: 25,
    nearestHospital: 'Mananthavady Hospital (2.5 km)', nearestSchool: 'Mananthavady GHSS (1.2 km)',
    historicalEventList: ['2019 Flood', '2024 Flood'],
  },
  {
    id: 'sulthan-bathery-rural', name: 'Sulthan Bathery Rural', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.66, lng: 76.27, population: 4500, elevation_m: 900, slope_deg: 18,
    distanceRiver_km: 2.5, distanceHospital_km: 4.0, distanceSchool_km: 1.5, distanceRoad_km: 0.5,
    roadAccessibility: 'GOOD', infrastructureScore: 60, historicalEvents: 1,
    riskScore: 38, riskLevel: 'MODERATE', vulnerabilityScore: 35,
    relocationPriority: 'NONE', recommendedAction: 'MONITOR',
    rainfall_mm: 42, floodSusceptibility: 35, landslideSusceptibility: 40,
    nearestHospital: 'Sulthan Bathery Hospital (4 km)', nearestSchool: 'Sulthan Bathery GHSS (1.5 km)',
    historicalEventList: ['2024 Heavy Rainfall'],
  },
  {
    id: 'panamaram', name: 'Panamaram', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.72, lng: 76.05, population: 2800, elevation_m: 680, slope_deg: 14,
    distanceRiver_km: 0.3, distanceHospital_km: 6.0, distanceSchool_km: 1.0, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 48, historicalEvents: 2,
    riskScore: 58, riskLevel: 'HIGH', vulnerabilityScore: 52,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 62, floodSusceptibility: 72, landslideSusceptibility: 35,
    nearestHospital: 'Kalpetta District Hospital (6 km)', nearestSchool: 'Panamaram GHSS (1 km)',
    historicalEventList: ['2019 Flood', '2024 Flood'],
  },

  // === IDUKKI (high landslide risk) ===
  {
    id: 'munnar', name: 'Munnar', districtId: 'idukki', districtName: 'Idukki',
    lat: 10.09, lng: 77.06, population: 3200, elevation_m: 1600, slope_deg: 25,
    distanceRiver_km: 1.0, distanceHospital_km: 5.0, distanceSchool_km: 1.5, distanceRoad_km: 0.5,
    roadAccessibility: 'MODERATE', infrastructureScore: 50, historicalEvents: 4,
    riskScore: 72, riskLevel: 'HIGH', vulnerabilityScore: 65,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 68, floodSusceptibility: 40, landslideSusceptibility: 85,
    nearestHospital: 'Munnar General Hospital (5 km)', nearestSchool: 'Munnar GHSS (1.5 km)',
    historicalEventList: ['2018 Flood', '2019 Landslide', '2020 Heavy Rainfall', '2024 Landslide'],
  },
  {
    id: 'pallivasal', name: 'Pallivasal', districtId: 'idukki', districtName: 'Idukki',
    lat: 10.05, lng: 77.03, population: 1600, elevation_m: 1450, slope_deg: 30,
    distanceRiver_km: 0.5, distanceHospital_km: 7.0, distanceSchool_km: 2.5, distanceRoad_km: 1.0,
    roadAccessibility: 'MODERATE', infrastructureScore: 38, historicalEvents: 3,
    riskScore: 78, riskLevel: 'HIGH', vulnerabilityScore: 70,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'EVACUATE',
    rainfall_mm: 72, floodSusceptibility: 50, landslideSusceptibility: 88,
    nearestHospital: 'Munnar General Hospital (7 km)', nearestSchool: 'Pallivasal UPS (2.5 km)',
    historicalEventList: ['2018 Flood', '2019 Landslide', '2024 Landslide'],
  },

  // === KOZHIKODE ===
  {
    id: 'thamarassery-rural', name: 'Thamarassery Rural', districtId: 'kozhikode', districtName: 'Kozhikode',
    lat: 11.32, lng: 75.88, population: 3600, elevation_m: 350, slope_deg: 18,
    distanceRiver_km: 0.8, distanceHospital_km: 4.0, distanceSchool_km: 1.2, distanceRoad_km: 0.3,
    roadAccessibility: 'GOOD', infrastructureScore: 55, historicalEvents: 2,
    riskScore: 55, riskLevel: 'HIGH', vulnerabilityScore: 45,
    relocationPriority: 'MEDIUM_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 58, floodSusceptibility: 65, landslideSusceptibility: 50,
    nearestHospital: 'Kozhikode Medical College (15 km)', nearestSchool: 'Thamarassery GHSS (1.2 km)',
    historicalEventList: ['2019 Flood', '2024 Flood'],
  },

  // === PALAKKAD ===
  {
    id: 'attappadi-rural', name: 'Attappadi Rural', districtId: 'palakkad', districtName: 'Palakkad',
    lat: 10.92, lng: 76.70, population: 2200, elevation_m: 600, slope_deg: 22,
    distanceRiver_km: 1.5, distanceHospital_km: 10.0, distanceSchool_km: 3.0, distanceRoad_km: 1.2,
    roadAccessibility: 'MODERATE', infrastructureScore: 32, historicalEvents: 2,
    riskScore: 61, riskLevel: 'HIGH', vulnerabilityScore: 58,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 52, floodSusceptibility: 45, landslideSusceptibility: 65,
    nearestHospital: 'Agali PHC (3 km)', nearestSchool: 'Attappadi UPS (3 km)',
    historicalEventList: ['2019 Flood', '2024 Landslide'],
  },

  // === ALAPPUZHA (coastal flood) ===
  {
    id: 'kuttanad-rural', name: 'Kuttanad Rural', districtId: 'alappuzha', districtName: 'Alappuzha',
    lat: 9.48, lng: 76.38, population: 5800, elevation_m: 5, slope_deg: 2,
    distanceRiver_km: 0.2, distanceHospital_km: 8.0, distanceSchool_km: 1.5, distanceRoad_km: 0.5,
    roadAccessibility: 'MODERATE', infrastructureScore: 45, historicalEvents: 3,
    riskScore: 67, riskLevel: 'HIGH', vulnerabilityScore: 62,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 60, floodSusceptibility: 88, landslideSusceptibility: 5,
    nearestHospital: 'Alappuzha Medical College (8 km)', nearestSchool: 'Kuttanad GHSS (1.5 km)',
    historicalEventList: ['2018 Flood', '2019 Flood', '2024 Flood'],
  },

  // === PATHANAMTHITTA ===
  {
    id: 'ranni-rural', name: 'Ranni Rural', districtId: 'pathanamthitta', districtName: 'Pathanamthitta',
    lat: 9.38, lng: 76.78, population: 3400, elevation_m: 50, slope_deg: 8,
    distanceRiver_km: 0.3, distanceHospital_km: 6.0, distanceSchool_km: 1.0, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 50, historicalEvents: 3,
    riskScore: 63, riskLevel: 'HIGH', vulnerabilityScore: 55,
    relocationPriority: 'SHORT_TERM', recommendedAction: 'PREPARE',
    rainfall_mm: 65, floodSusceptibility: 82, landslideSusceptibility: 15,
    nearestHospital: 'Ranni Taluk Hospital (6 km)', nearestSchool: 'Ranni GHSS (1 km)',
    historicalEventList: ['2018 Flood', '2019 Flood', '2024 Flood'],
  },

  // === THIRUVANANTHAPURAM ===
  {
    id: 'nedumangad-rural', name: 'Nedumangad Rural', districtId: 'thiruvananthapuram', districtName: 'Thiruvananthapuram',
    lat: 8.62, lng: 77.00, population: 4200, elevation_m: 80, slope_deg: 10,
    distanceRiver_km: 1.0, distanceHospital_km: 5.0, distanceSchool_km: 1.2, distanceRoad_km: 0.3,
    roadAccessibility: 'GOOD', infrastructureScore: 62, historicalEvents: 1,
    riskScore: 35, riskLevel: 'MODERATE', vulnerabilityScore: 30,
    relocationPriority: 'NONE', recommendedAction: 'MONITOR',
    rainfall_mm: 38, floodSusceptibility: 50, landslideSusceptibility: 20,
    nearestHospital: 'Nedumangad District Hospital (5 km)', nearestSchool: 'Nedumangad GHSS (1.2 km)',
    historicalEventList: ['2024 Flood'],
  },

  // === KOTTAYAM ===
  {
    id: 'kanjirappally-rural', name: 'Kanjirappally Rural', districtId: 'kottayam', districtName: 'Kottayam',
    lat: 9.50, lng: 76.78, population: 3100, elevation_m: 100, slope_deg: 12,
    distanceRiver_km: 0.8, distanceHospital_km: 7.0, distanceSchool_km: 1.5, distanceRoad_km: 0.4,
    roadAccessibility: 'MODERATE', infrastructureScore: 52, historicalEvents: 2,
    riskScore: 48, riskLevel: 'MODERATE', vulnerabilityScore: 42,
    relocationPriority: 'NONE', recommendedAction: 'MONITOR',
    rainfall_mm: 45, floodSusceptibility: 68, landslideSusceptibility: 30,
    nearestHospital: 'Kanjirappally Taluk Hospital (7 km)', nearestSchool: 'Kanjirappally GHSS (1.5 km)',
    historicalEventList: ['2018 Flood', '2024 Flood'],
  },

  // === ERNAKULAM ===
  {
    id: 'muvattupuzha-rural', name: 'Muvattupuzha Rural', districtId: 'ernakulam', districtName: 'Ernakulam',
    lat: 9.98, lng: 76.57, population: 4800, elevation_m: 30, slope_deg: 5,
    distanceRiver_km: 0.4, distanceHospital_km: 4.0, distanceSchool_km: 1.0, distanceRoad_km: 0.2,
    roadAccessibility: 'GOOD', infrastructureScore: 68, historicalEvents: 1,
    riskScore: 32, riskLevel: 'LOW', vulnerabilityScore: 25,
    relocationPriority: 'NONE', recommendedAction: 'MONITOR',
    rainfall_mm: 35, floodSusceptibility: 55, landslideSusceptibility: 8,
    nearestHospital: 'Muvattupuzha Taluk Hospital (4 km)', nearestSchool: 'Muvattupuzha GHSS (1 km)',
    historicalEventList: ['2018 Flood'],
  },
];

// Safe relocation sites across Kerala
export const SAFE_SITES: SafeSite[] = [
  {
    id: 'site-sulthan-bathery', name: 'Sulthan Bathery Town', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.66, lng: 76.27, suitabilityScore: 91, estimatedCapacity: 4000, existingPopulation: 1200,
    availableCapacity: 2800, floodRisk: 20, landslideRisk: 15, slope_deg: 8, elevation_m: 900,
    roadAccessibility: 'GOOD', nearestHospital: 'Sulthan Bathery Hospital (2 km)', hospitalDistance_km: 2.0,
    nearestSchool: 'Sulthan Bathery GHSS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'GOOD',
    hazardExposure: 18, recommendation: 'Highly recommended for relocation. Good infrastructure and low hazard exposure.',
    feasibility: 'FEASIBLE', usableLand_ha: 50,
  },
  {
    id: 'site-mananthavady', name: 'Mananthavady Town', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.80, lng: 76.00, suitabilityScore: 85, estimatedCapacity: 3500, existingPopulation: 1500,
    availableCapacity: 2000, floodRisk: 25, landslideRisk: 20, slope_deg: 10, elevation_m: 650,
    roadAccessibility: 'GOOD', nearestHospital: 'Mananthavady Hospital (1.5 km)', hospitalDistance_km: 1.5,
    nearestSchool: 'Mananthavady GHSS (0.8 km)', schoolDistance_km: 0.8, waterAvailability: 'GOOD',
    hazardExposure: 22, recommendation: 'Recommended. Good accessibility and adequate capacity.',
    feasibility: 'FEASIBLE', usableLand_ha: 35,
  },
  {
    id: 'site-kalpetta', name: 'Kalpetta Town', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.63, lng: 76.08, suitabilityScore: 78, estimatedCapacity: 3000, existingPopulation: 1800,
    availableCapacity: 1200, floodRisk: 30, landslideRisk: 25, slope_deg: 12, elevation_m: 720,
    roadAccessibility: 'GOOD', nearestHospital: 'Kalpetta District Hospital (1 km)', hospitalDistance_km: 1.0,
    nearestSchool: 'Kalpetta GHSS (0.5 km)', schoolDistance_km: 0.5, waterAvailability: 'MODERATE',
    hazardExposure: 28, recommendation: 'Partially feasible. Limited additional capacity.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 20,
  },
  {
    id: 'site-vythiri', name: 'Vythiri Town', districtId: 'wayanad', districtName: 'Wayanad',
    lat: 11.56, lng: 76.03, suitabilityScore: 72, estimatedCapacity: 2500, existingPopulation: 1000,
    availableCapacity: 1500, floodRisk: 35, landslideRisk: 35, slope_deg: 16, elevation_m: 750,
    roadAccessibility: 'MODERATE', nearestHospital: 'Kalpetta District Hospital (5 km)', hospitalDistance_km: 5.0,
    nearestSchool: 'Vythiri GHSS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'MODERATE',
    hazardExposure: 35, recommendation: 'Partially feasible. Moderate hazard exposure in surrounding areas.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 25,
  },
  {
    id: 'site-munnar', name: 'Munnar Town', districtId: 'idukki', districtName: 'Idukki',
    lat: 10.09, lng: 77.06, suitabilityScore: 75, estimatedCapacity: 2800, existingPopulation: 1500,
    availableCapacity: 1300, floodRisk: 30, landslideRisk: 40, slope_deg: 15, elevation_m: 1600,
    roadAccessibility: 'MODERATE', nearestHospital: 'Munnar General Hospital (1 km)', hospitalDistance_km: 1.0,
    nearestSchool: 'Munnar GHSS (0.5 km)', schoolDistance_km: 0.5, waterAvailability: 'GOOD',
    hazardExposure: 38, recommendation: 'Partially feasible. Good infrastructure but landslide risk in surroundings.',
    feasibility: 'PARTIALLY_FEASIBLE', usableLand_ha: 28,
  },
  {
    id: 'site-kozhikode', name: 'Kozhikode City Outskirts', districtId: 'kozhikode', districtName: 'Kozhikode',
    lat: 11.18, lng: 75.85, suitabilityScore: 88, estimatedCapacity: 5000, existingPopulation: 2000,
    availableCapacity: 3000, floodRisk: 15, landslideRisk: 10, slope_deg: 5, elevation_m: 80,
    roadAccessibility: 'GOOD', nearestHospital: 'Kozhikode Medical College (5 km)', hospitalDistance_km: 5.0,
    nearestSchool: 'Kozhikode GHSS (2 km)', schoolDistance_km: 2.0, waterAvailability: 'GOOD',
    hazardExposure: 12, recommendation: 'Highly recommended. Low hazard exposure, excellent infrastructure.',
    feasibility: 'FEASIBLE', usableLand_ha: 70,
  },
  {
    id: 'site-thrissur', name: 'Thrissur City Outskirts', districtId: 'thrissur', districtName: 'Thrissur',
    lat: 10.55, lng: 76.25, suitabilityScore: 86, estimatedCapacity: 4500, existingPopulation: 2200,
    availableCapacity: 2300, floodRisk: 18, landslideRisk: 8, slope_deg: 6, elevation_m: 50,
    roadAccessibility: 'GOOD', nearestHospital: 'Thrissur Medical College (6 km)', hospitalDistance_km: 6.0,
    nearestSchool: 'Thrissur GHSS (2 km)', schoolDistance_km: 2.0, waterAvailability: 'GOOD',
    hazardExposure: 15, recommendation: 'Highly recommended. Excellent infrastructure and low hazard risk.',
    feasibility: 'FEASIBLE', usableLand_ha: 60,
  },
  {
    id: 'site-ernakulam', name: 'Kakkanad (Ernakulam)', districtId: 'ernakulam', districtName: 'Ernakulam',
    lat: 10.02, lng: 76.37, suitabilityScore: 90, estimatedCapacity: 6000, existingPopulation: 3000,
    availableCapacity: 3000, floodRisk: 12, landslideRisk: 5, slope_deg: 4, elevation_m: 25,
    roadAccessibility: 'GOOD', nearestHospital: 'Ernakulam Medical College (4 km)', hospitalDistance_km: 4.0,
    nearestSchool: 'Kakkanad GHSS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'GOOD',
    hazardExposure: 10, recommendation: 'Highly recommended. Excellent infrastructure and very low hazard risk.',
    feasibility: 'FEASIBLE', usableLand_ha: 80,
  },
  {
    id: 'site-thiruvananthapuram', name: 'Neyyattinkara (TVM)', districtId: 'thiruvananthapuram', districtName: 'Thiruvananthapuram',
    lat: 8.40, lng: 77.08, suitabilityScore: 82, estimatedCapacity: 3800, existingPopulation: 1600,
    availableCapacity: 2200, floodRisk: 20, landslideRisk: 12, slope_deg: 7, elevation_m: 40,
    roadAccessibility: 'GOOD', nearestHospital: 'Neyyattinkara Taluk Hospital (2 km)', hospitalDistance_km: 2.0,
    nearestSchool: 'Neyyattinkara GHSS (1 km)', schoolDistance_km: 1.0, waterAvailability: 'GOOD',
    hazardExposure: 16, recommendation: 'Recommended. Good infrastructure and low hazard risk.',
    feasibility: 'FEASIBLE', usableLand_ha: 45,
  },
];

// Pre-computed relocation plans
export const RELOCATION_PLANS: RelocationPlan[] = [
  { id: 'rp-1', habitationId: 'meppadi', habitationName: 'Meppadi', districtName: 'Wayanad', affectedPopulation: 4250, priority: 'IMMEDIATE', recommendedSiteId: 'site-sulthan-bathery', recommendedSiteName: 'Sulthan Bathery Town', siteCapacity: 4000, siteAvailableCapacity: 2800, suitabilityScore: 91, feasibility: 'PARTIALLY_FEASIBLE', status: 'PLANNED' },
  { id: 'rp-2', habitationId: 'chooralmala', habitationName: 'Chooralmala', districtName: 'Wayanad', affectedPopulation: 3100, priority: 'IMMEDIATE', recommendedSiteId: 'site-mananthavady', recommendedSiteName: 'Mananthavady Town', siteCapacity: 3500, siteAvailableCapacity: 2000, suitabilityScore: 85, feasibility: 'PARTIALLY_FEASIBLE', status: 'PLANNED' },
  { id: 'rp-3', habitationId: 'mundakkai', habitationName: 'Mundakkai', districtName: 'Wayanad', affectedPopulation: 2800, priority: 'IMMEDIATE', recommendedSiteId: 'site-mananthavady', recommendedSiteName: 'Mananthavady Town', siteCapacity: 3500, siteAvailableCapacity: 2000, suitabilityScore: 85, feasibility: 'FEASIBLE', status: 'APPROVED' },
  { id: 'rp-4', habitationId: 'puthalmala', habitationName: 'Puthalmala', districtName: 'Wayanad', affectedPopulation: 1800, priority: 'IMMEDIATE', recommendedSiteId: 'site-sulthan-bathery', recommendedSiteName: 'Sulthan Bathery Town', siteCapacity: 4000, siteAvailableCapacity: 2800, suitabilityScore: 91, feasibility: 'FEASIBLE', status: 'IN_PROGRESS' },
  { id: 'rp-5', habitationId: 'vellarimala', habitationName: 'Vellarimala', districtName: 'Wayanad', affectedPopulation: 1500, priority: 'SHORT_TERM', recommendedSiteId: 'site-kalpetta', recommendedSiteName: 'Kalpetta Town', siteCapacity: 3000, siteAvailableCapacity: 1200, suitabilityScore: 78, feasibility: 'FEASIBLE', status: 'PLANNED' },
  { id: 'rp-6', habitationId: 'pallivasal', habitationName: 'Pallivasal', districtName: 'Idukki', affectedPopulation: 1600, priority: 'SHORT_TERM', recommendedSiteId: 'site-munnar', recommendedSiteName: 'Munnar Town', siteCapacity: 2800, siteAvailableCapacity: 1300, suitabilityScore: 75, feasibility: 'FEASIBLE', status: 'PLANNED' },
  { id: 'rp-7', habitationId: 'panamaram', habitationName: 'Panamaram', districtName: 'Wayanad', affectedPopulation: 2800, priority: 'SHORT_TERM', recommendedSiteId: 'site-mananthavady', recommendedSiteName: 'Mananthavady Town', siteCapacity: 3500, siteAvailableCapacity: 2000, suitabilityScore: 85, feasibility: 'FEASIBLE', status: 'PLANNED' },
];

// Hospitals and infrastructure (for map markers)
export const HOSPITALS = [
  { id: 'hosp-kalpetta', name: 'Kalpetta District Hospital', districtId: 'wayanad', lat: 11.63, lng: 76.08, type: 'District Hospital' },
  { id: 'hosp-mananthavady', name: 'Mananthavady Hospital', districtId: 'wayanad', lat: 11.80, lng: 76.00, type: 'Taluk Hospital' },
  { id: 'hosp-sb', name: 'Sulthan Bathery Hospital', districtId: 'wayanad', lat: 11.66, lng: 76.27, type: 'Taluk Hospital' },
  { id: 'hosp-munnar', name: 'Munnar General Hospital', districtId: 'idukki', lat: 10.09, lng: 77.06, type: 'General Hospital' },
  { id: 'hosp-kozhikode', name: 'Kozhikode Medical College', districtId: 'kozhikode', lat: 11.18, lng: 75.85, type: 'Medical College' },
  { id: 'hosp-thrissur', name: 'Thrissur Medical College', districtId: 'thrissur', lat: 10.55, lng: 76.25, type: 'Medical College' },
  { id: 'hosp-ernakulam', name: 'Ernakulam Medical College', districtId: 'ernakulam', lat: 10.02, lng: 76.37, type: 'Medical College' },
  { id: 'hosp-tvm', name: 'TVM Medical College', districtId: 'thiruvananthapuram', lat: 8.52, lng: 76.94, type: 'Medical College' },
];

export const SCHOOLS = [
  { id: 'sch-meppadi', name: 'Meppadi GHSS', districtId: 'wayanad', lat: 11.45, lng: 76.18, type: 'GHSS' },
  { id: 'sch-kalpetta', name: 'Kalpetta GHSS', districtId: 'wayanad', lat: 11.63, lng: 76.08, type: 'GHSS' },
  { id: 'sch-mananthavady', name: 'Mananthavady GHSS', districtId: 'wayanad', lat: 11.80, lng: 76.00, type: 'GHSS' },
  { id: 'sch-sb', name: 'Sulthan Bathery GHSS', districtId: 'wayanad', lat: 11.66, lng: 76.27, type: 'GHSS' },
  { id: 'sch-munnar', name: 'Munnar GHSS', districtId: 'idukki', lat: 10.09, lng: 77.06, type: 'GHSS' },
  { id: 'sch-kuttanad', name: 'Kuttanad GHSS', districtId: 'alappuzha', lat: 9.48, lng: 76.38, type: 'GHSS' },
];

export const WATER_BODIES = [
  { id: 'wb-kabini', name: 'Kabini River', lat: 11.80, lng: 76.00, type: 'River' },
  { id: 'wb-chaliyar', name: 'Chaliyar River', lat: 11.25, lng: 76.10, type: 'River' },
  { id: 'wb-pamba', name: 'Pamba River', lat: 9.30, lng: 76.75, type: 'River' },
  { id: 'wb-periyar', name: 'Periyar River', lat: 10.05, lng: 76.40, type: 'River' },
  { id: 'wb-vembanad', name: 'Vembanad Lake', lat: 9.62, lng: 76.40, type: 'Lake' },
  { id: 'wb-bharathapuzha', name: 'Bharathapuzha River', lat: 10.80, lng: 76.10, type: 'River' },
];

export const DATA_SOURCES = [
  { id: 'imd', name: 'IMD', fullName: 'India Meteorological Department', dataType: 'Rainfall, Weather, Warnings', updateFrequency: 'Dynamic' as const, status: 'Demo' as const, lastUpdated: new Date().toISOString(), description: 'Real-time rainfall, temperature, humidity, and weather warnings from IMD.' },
  { id: 'ksdma', name: 'KSDMA', fullName: 'Kerala State Disaster Management Authority', dataType: 'Hazard Maps, Alerts', updateFrequency: 'Dynamic' as const, status: 'Available' as const, lastUpdated: new Date().toISOString(), description: 'Kerala-specific hazard maps, alerts, and disaster management plans.' },
  { id: 'gsi', name: 'GSI', fullName: 'Geological Survey of India', dataType: 'Landslide Susceptibility Maps', updateFrequency: 'Baseline' as const, status: 'Available' as const, lastUpdated: new Date().toISOString(), description: 'Landslide susceptibility and geological hazard maps for Kerala.' },
  { id: 'nrsc', name: 'NRSC / Bhuvan', fullName: 'National Remote Sensing Centre', dataType: 'Satellite Imagery, Flood Maps', updateFrequency: 'Dynamic' as const, status: 'Available' as const, lastUpdated: new Date().toISOString(), description: 'Satellite-derived flood inundation maps and land-use data.' },
  { id: 'census', name: 'Census India', fullName: 'Office of the Registrar General', dataType: 'Population Data', updateFrequency: 'Static' as const, status: 'Available' as const, lastUpdated: '2011-01-01T00:00:00Z', description: 'Population, demographics, and habitation-level data from Census 2011.' },
  { id: 'osm', name: 'OpenStreetMap', fullName: 'OpenStreetMap Community', dataType: 'Infrastructure, Roads, Buildings', updateFrequency: 'Dynamic' as const, status: 'Connected' as const, lastUpdated: new Date().toISOString(), description: 'Road networks, buildings, hospitals, schools from OpenStreetMap.' },
  { id: 'cwc', name: 'CWC', fullName: 'Central Water Commission', dataType: 'River Water Levels, Flood Forecasts', updateFrequency: 'Real-time' as const, status: 'Demo' as const, lastUpdated: new Date().toISOString(), description: 'River water level monitoring and flood forecasts from CWC.' },
  { id: 'ndma', name: 'NDMA', fullName: 'National Disaster Management Authority', dataType: 'Guidelines, Disaster Alerts', updateFrequency: 'Dynamic' as const, status: 'Available' as const, lastUpdated: new Date().toISOString(), description: 'National disaster management guidelines and multi-hazard alerts.' },
];
