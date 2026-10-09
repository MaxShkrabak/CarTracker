import { Component, computed, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VehicleListCard } from '@features/vehicles/vehicle-list-card/vehicle-list-card';
import { Vehicle } from '../vehicle-models';
import { VehicleService } from '../vehicle-service';
import { AuthService } from '@core/auth-service';

@Component({
  selector: 'app-vehicle-list',
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatSelectModule, VehicleListCard],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList {
  constructor() {
    this.loadVehicles();
  }

  private vehicleService = inject(VehicleService);

  vehicles = signal<Vehicle[]>([]);
  sortBy = 'year-desc';

  applySort(): void {}

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe((vehicles) => {
      this.vehicles.set(vehicles);
    });
  }

  onVehicleDeleted(vid: number): void {
    this.vehicles.update((list) => list.filter((v) => v.vid !== vid));
  }
}
