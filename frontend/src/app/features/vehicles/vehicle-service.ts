import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle, VinDecodeResponse } from './vehicle-models';
import { map, Observable, switchMap, tap } from 'rxjs';
import { User } from '@core/auth-models';
import { AuthService } from '@core/auth-service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = '/api/vehicle';

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl, { withCredentials: true });
  }

  // https://vpic.nhtsa.dot.gov/api/
  decodeVin(vin: string): Observable<VinDecodeResponse> {
    return this.http.get<VinDecodeResponse>(`${this.apiUrl}/decode/${encodeURIComponent(vin)}`, {
      withCredentials: true,
    });
  }

  saveVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http
      .post<Vehicle>(`${this.apiUrl}/add`, vehicle, { withCredentials: true })
      .pipe(switchMap((saved) => this.auth.me().pipe(map(() => saved))));
  }

  setPrimary(vid: number): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${vid}/primary`, null, { withCredentials: true })
      .pipe(tap((user) => this.auth.currentUser.set(user)));
  }

  getVehicle(vid: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${vid}`, { withCredentials: true });
  }
}
