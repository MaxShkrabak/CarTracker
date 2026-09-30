export interface DriveSession {
  sessionId: number;
  vid: number;
  startedAt: string;
  endedAt: string | null;
  distanceKm: number | null;
  maxRPM: number | null;
  maxKPH: number | null;
  avgRPM: number | null;
  avgKPH: number | null;
  maxCoolantTempC: number | null;
  sampleCount: number | null;
}