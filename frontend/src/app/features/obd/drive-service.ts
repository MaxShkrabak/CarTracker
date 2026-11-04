import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriveSession, DriveSampleRequest, VehicleStats } from './drive-models';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private apiUrl = '/api/drive';

  constructor(private http: HttpClient) {}

  startSession(vid: number, tripMeter: number | null): Observable<DriveSession> {
    return this.http.post<DriveSession>(
      `${this.apiUrl}/vehicle/${vid}/session`,
      { startedAt: new Date().toISOString(), tripMeter },
      { withCredentials: true },
    );
  }

  addSamples(sessionId: number, samples: DriveSampleRequest[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/session/${sessionId}/samples`, samples, {
      withCredentials: true,
    });
  }

  endSession(sessionId: number): Observable<DriveSession> {
    return this.http.patch<DriveSession>(
      `${this.apiUrl}/session/${sessionId}/end`,
      { endedAt: new Date().toISOString() },
      { withCredentials: true },
    );
  }

  getVehicleSessions(vid: number): Observable<DriveSession[]> {
    return this.http.get<DriveSession[]>(`${this.apiUrl}/vehicle/${vid}/sessions`, {
      withCredentials: true,
    });
  }

  getVehicleStats(vid: number): Observable<VehicleStats> {
    return this.http.get<VehicleStats>(`${this.apiUrl}/vehicle/${vid}/stats`, {
      withCredentials: true,
    });
  }
}
