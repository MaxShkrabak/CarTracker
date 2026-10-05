import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle, VinDecodeResponse } from './vehicle-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = '/api/vehicle';

  constructor(private http: HttpClient) {}

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
    return this.http.post<Vehicle>(`${this.apiUrl}/add`, vehicle, { withCredentials: true });
  }
}
