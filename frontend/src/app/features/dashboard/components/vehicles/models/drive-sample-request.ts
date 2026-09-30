export interface DriveSampleRequest {
  recordedAt: string;
  rpm: number | null;
  kph: number | null;
  coolantTempC: number | null;
}