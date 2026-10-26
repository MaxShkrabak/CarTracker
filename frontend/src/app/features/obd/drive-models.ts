export interface DriveSampleRequest {
  recordedAt: string;
  signal: string;
  value: number;
}

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

export interface StatRecord {
  value: number;
  sessionId: number;
  StartedAt: string;
}

export interface VehicleStats {
  maxSpeed: StatRecord | null;
  maxRpm: StatRecord | null;
  maxCoolant: StatRecord | null;
}