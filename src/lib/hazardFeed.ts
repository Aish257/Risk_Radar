import type { Habitation, HazardUpdate } from '@/types';
import { generateSimulatedHazardUpdate, recalculateHabitationRisk } from './riskEngine';

/**
 * Mock Real-Time Data Ingestion Service
 *
 * Simulates a real-time hazard data feed (IMD rainfall, CWC water levels, etc.)
 * In production, this would be replaced by actual API calls to IMD / CWC / KSDMA.
 * The frontend does not need to change — only this service's implementation.
 *
 * Flow:
 *   New Hazard Data → Ingestion → Validation → Feature Prep →
 *   GIS Processing → AI Risk Inference → Updated Risk Score →
 *   Updated Red-Zone Map → Updated Habitation Priority → Updated Recommendations
 */

export interface IngestionResult {
  hazardUpdate: HazardUpdate;
  updatedHabitations: Habitation[];
  timestamp: string;
}

export class HazardFeedService {
  private listeners: ((result: IngestionResult) => void)[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /**
   * Fetch latest hazard data (simulated).
   * In production: call IMD API, CWC API, KSDMA alerts.
   */
  fetchHazardData(): HazardUpdate {
    return generateSimulatedHazardUpdate();
  }

  /**
   * Run the full ingestion pipeline:
   * 1. Fetch new hazard data
   * 2. Recalculate risk scores for all habitations
   * 3. Return updated data
   */
  ingest(habitations: Habitation[]): IngestionResult {
    // 1. Data Ingestion — simulate fetching from IMD/CWC
    const hazardUpdate = this.fetchHazardData();

    // 2. Validation & Cleaning — in production, validate ranges, check for nulls
    const validatedRainfall = Math.max(0, hazardUpdate.rainfall_mm);

    // 3. Feature Preparation & 4. GIS Processing
    // In production, spatial joins, slope calculations, etc. happen here

    // 5. AI Risk Inference — trained model performs new inference on updated features
    const rainfallMultiplier = validatedRainfall / 50; // scale factor
    const updatedFlood = Math.min(100, 40 + validatedRainfall * 0.5);
    const updatedLandslide = Math.min(100, 30 + validatedRainfall * 0.6);

    const updatedHabitations = habitations.map(h =>
      recalculateHabitationRisk(h, validatedRainfall * rainfallMultiplier * (0.8 + Math.random() * 0.4), updatedFlood, updatedLandslide),
    );

    return {
      hazardUpdate,
      updatedHabitations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Start a simulated live feed that updates every N seconds.
   */
  startLiveFeed(habitations: Habitation[], intervalMs: number, callback: (result: IngestionResult) => void): void {
    this.stopLiveFeed();
    this.intervalId = setInterval(() => {
      callback(this.ingest(habitations));
    }, intervalMs);
  }

  stopLiveFeed(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const hazardFeed = new HazardFeedService();
