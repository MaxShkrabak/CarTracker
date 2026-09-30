import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriveSession } from '../features/dashboard/components/vehicles/models/drive-session';
import { DriveSampleRequest } from '../features/dashboard/components/vehicles/models/drive-sample-request';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private apiUrl = '/api/drive';

  constructor(private http: HttpClient) {}

    startSession(vid: number) : Observable<DriveSession> {
        return this.http.post<DriveSession>(`${this.apiUrl}/vehicle/${vid}/session`, { startedAt: new Date().toISOString() }, {withCredentials: true});
    }

    addSamples(sessionId: number, samples: DriveSampleRequest[]): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/session/${sessionId}/samples`, samples, {withCredentials: true});
    }

    endSession(sessionId: number): Observable<DriveSession> {
        return this.http.patch<DriveSession>(`${this.apiUrl}/session/${sessionId}/end`, {endedAt: new Date().toISOString() }, {withCredentials: true});
    }

    getVehicleSessions(vid: number): Observable<DriveSession[]> {
        return this.http.get<DriveSession[]>(`${this.apiUrl}/vehicle/${vid}/sessions`, { withCredentials: true});
    }
  
}
