import type { District } from '@/types';

// All 14 Kerala districts with approximate centroids
export const KERALA_DISTRICTS: District[] = [
  { id: 'kasaragod', name: 'Kasaragod', region: 'North', centroid: [12.5, 75.0], area_km2: 1992, population: 1325656, hazardTypes: ['Flood', 'Landslide'] },
  { id: 'kannur', name: 'Kannur', region: 'North', centroid: [11.87, 75.35], area_km2: 2966, population: 2525673, hazardTypes: ['Flood', 'Landslide'] },
  { id: 'kozhikode', name: 'Kozhikode', region: 'North', centroid: [11.25, 75.78], area_km2: 2206, population: 3089550, hazardTypes: ['Flood', 'Landslide', 'Coastal'] },
  { id: 'wayanad', name: 'Wayanad', region: 'North', centroid: [11.68, 76.13], area_km2: 2131, population: 849000, hazardTypes: ['Landslide', 'Flood', 'Heavy Rainfall'] },
  { id: 'malappuram', name: 'Malappuram', region: 'North', centroid: [11.07, 76.07], area_km2: 3550, population: 4112980, hazardTypes: ['Flood', 'Landslide'] },
  { id: 'palakkad', name: 'Palakkad', region: 'Central', centroid: [10.78, 76.65], area_km2: 4480, population: 2810922, hazardTypes: ['Flood', 'Drought', 'Landslide'] },
  { id: 'thrissur', name: 'Thrissur', region: 'Central', centroid: [10.52, 76.21], area_km2: 3032, population: 3121200, hazardTypes: ['Flood', 'Coastal'] },
  { id: 'ernakulam', name: 'Ernakulam', region: 'Central', centroid: [10.02, 76.30], area_km2: 3068, population: 3377872, hazardTypes: ['Flood', 'Coastal'] },
  { id: 'idukki', name: 'Idukki', region: 'Central', centroid: [9.92, 76.98], area_km2: 4356, population: 1100000, hazardTypes: ['Landslide', 'Flood', 'Heavy Rainfall'] },
  { id: 'kottayam', name: 'Kottayam', region: 'Central', centroid: [9.59, 76.52], area_km2: 2203, population: 1974551, hazardTypes: ['Flood', 'Landslide'] },
  { id: 'alappuzha', name: 'Alappuzha', region: 'South', centroid: [9.54, 76.34], area_km2: 1414, population: 2127789, hazardTypes: ['Flood', 'Coastal'] },
  { id: 'pathanamthitta', name: 'Pathanamthitta', region: 'South', centroid: [9.26, 76.70], area_km2: 2462, population: 1195539, hazardTypes: ['Flood', 'Landslide'] },
  { id: 'kollam', name: 'Kollam', region: 'South', centroid: [8.89, 76.71], area_km2: 2492, population: 2641862, hazardTypes: ['Flood', 'Coastal'] },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', region: 'South', centroid: [8.52, 76.94], area_km2: 2186, population: 3327602, hazardTypes: ['Flood', 'Coastal', 'Landslide'] },
];

export const KERALA_CENTER: [number, number] = [10.0, 76.35];
export const KERALA_BOUNDS: [[number, number], [number, number]] = [[8.0, 74.5], [13.0, 77.5]];

// Approximate polygon for Kerala state boundary (simplified)
export const KERALA_OUTLINE: [number, number][] = [
  [12.68, 74.85], [12.55, 75.05], [12.40, 75.10], [12.15, 75.15],
  [11.92, 75.30], [11.75, 75.45], [11.60, 75.62], [11.50, 75.75],
  [11.35, 75.85], [11.22, 75.88], [11.10, 76.00], [11.00, 76.10],
  [10.85, 76.20], [10.75, 76.40], [10.60, 76.50], [10.45, 76.55],
  [10.30, 76.60], [10.15, 76.70], [10.00, 76.75], [9.85, 76.80],
  [9.70, 76.85], [9.55, 76.90], [9.40, 76.95], [9.25, 76.97],
  [9.10, 76.90], [8.95, 76.85], [8.80, 76.80], [8.65, 76.80],
  [8.50, 76.85], [8.40, 76.95], [8.35, 77.05], [8.30, 77.15],
  [8.35, 77.25], [8.45, 77.30], [8.55, 77.25], [8.60, 77.15],
  [8.65, 77.05], [8.72, 76.95], [8.80, 76.85], [8.85, 76.70],
  [8.90, 76.55], [9.00, 76.45], [9.10, 76.35], [9.20, 76.25],
  [9.30, 76.15], [9.40, 76.05], [9.50, 75.95], [9.60, 75.85],
  [9.70, 75.75], [9.80, 75.65], [9.90, 75.55], [10.00, 75.45],
  [10.10, 75.35], [10.20, 75.25], [10.30, 75.15], [10.40, 75.10],
  [10.50, 75.05], [10.60, 75.00], [10.70, 74.95], [10.80, 74.90],
  [10.90, 74.88], [11.00, 74.85], [11.10, 74.83], [11.20, 74.80],
  [11.30, 74.78], [11.40, 74.76], [11.50, 74.75], [11.60, 74.78],
  [11.70, 74.82], [11.80, 74.85], [11.90, 74.88], [12.00, 74.90],
  [12.10, 74.88], [12.20, 74.85], [12.30, 74.85], [12.40, 74.87],
  [12.50, 74.88], [12.60, 74.87], [12.68, 74.85],
];

// Simplified district boundary polygons (approximate, for visualization)
export const DISTRICT_BOUNDARIES: Record<string, [number, number][]> = {
  kasaragod: [[12.68,74.85],[12.50,74.90],[12.35,75.00],[12.20,75.10],[12.10,75.20],[12.15,75.35],[12.30,75.30],[12.45,75.20],[12.55,75.05],[12.68,74.90]],
  kannur: [[12.20,75.10],[12.10,75.20],[12.00,75.35],[11.90,75.50],[11.85,75.65],[11.95,75.70],[12.10,75.60],[12.20,75.45],[12.30,75.30],[12.35,75.15]],
  kozhikode: [[11.95,75.70],[11.85,75.65],[11.75,75.78],[11.65,75.90],[11.55,76.00],[11.50,76.15],[11.60,76.20],[11.72,76.10],[11.82,75.95],[11.90,75.80]],
  wayanad: [[11.85,75.65],[11.75,75.78],[11.65,75.90],[11.55,76.00],[11.50,76.15],[11.60,76.25],[11.72,76.30],[11.80,76.20],[11.90,76.10],[11.95,75.95],[12.00,75.80],[11.95,75.70]],
  malappuram: [[11.50,76.15],[11.40,76.20],[11.30,76.30],[11.20,76.40],[11.10,76.50],[11.05,76.60],[11.15,76.65],[11.25,76.55],[11.35,76.45],[11.45,76.35],[11.55,76.25],[11.60,76.20]],
  palakkad: [[11.05,76.60],[10.95,76.65],[10.85,76.75],[10.75,76.85],[10.65,76.95],[10.55,77.00],[10.50,77.10],[10.60,77.15],[10.70,77.05],[10.80,76.95],[10.90,76.85],[11.00,76.75],[11.10,76.65],[11.15,76.60]],
  thrissur: [[10.60,76.20],[10.50,76.25],[10.40,76.35],[10.30,76.45],[10.25,76.55],[10.30,76.65],[10.40,76.60],[10.50,76.50],[10.55,76.40],[10.60,76.30]],
  ernakulam: [[10.30,76.65],[10.20,76.70],[10.10,76.75],[10.00,76.80],[9.95,76.90],[10.00,76.95],[10.10,76.90],[10.20,76.85],[10.30,76.80],[10.35,76.70]],
  idukki: [[10.00,76.95],[9.90,77.00],[9.80,77.10],[9.70,77.20],[9.65,77.30],[9.70,77.40],[9.80,77.35],[9.90,77.25],[10.00,77.15],[10.05,77.05]],
  kottayam: [[9.70,76.85],[9.60,76.90],[9.50,76.95],[9.45,77.05],[9.50,77.15],[9.60,77.10],[9.70,77.00],[9.75,76.90]],
  alappuzha: [[9.55,76.90],[9.50,76.95],[9.45,77.05],[9.50,77.15],[9.55,76.95]],
  pathanamthitta: [[9.40,76.95],[9.30,77.00],[9.20,77.05],[9.15,77.15],[9.20,77.25],[9.30,77.20],[9.40,77.10],[9.45,77.00]],
  kollam: [[9.15,77.15],[9.05,77.20],[8.95,77.25],[8.85,77.30],[8.80,77.40],[8.85,77.45],[8.95,77.40],[9.05,77.30],[9.10,77.25],[9.15,77.20]],
  thiruvananthapuram: [[8.85,77.30],[8.75,77.35],[8.65,77.40],[8.60,77.50],[8.55,77.60],[8.50,77.65],[8.45,77.55],[8.50,77.45],[8.55,77.35],[8.65,77.30],[8.75,77.25],[8.80,77.28]],
};
