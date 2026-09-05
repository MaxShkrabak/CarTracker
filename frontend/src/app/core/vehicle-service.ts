  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../features/dashboard/components/vehicles/vehicle';
import { Observable } from 'rxjs';
import { VinDecodeResponse } from '../features/dashboard/components/vehicles/vin-decode-response';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:8080/api/vehicle';

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl, { withCredentials: true });
  }

  decodeVin(vin: string): Observable<VinDecodeResponse> {
    return this.http.get<VinDecodeResponse>(`${this.apiUrl}/decode/${encodeURIComponent(vin)}`, {
      withCredentials: true,
    });
  }

  saveVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/add`, vehicle, { withCredentials: true });
  }
}
