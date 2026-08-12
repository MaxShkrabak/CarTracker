import { Component, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../../core/vehicle-service';
import { Vehicle } from '../../models/vehicle';
import 'iconify-icon';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.css',
})
export class VehicleCard implements OnInit {
  vehicle = signal<Vehicle | null>(null);
  errorMessage = signal('');
  loading = signal(false);

  ngOnInit() {
    this.getVehicle();
  }

  constructor(
    private vehicleService: VehicleService
  ) {}

  /* Assuming 1 vehicle per user right now
     TODO: Fix later 
  */
  getVehicle() {
    this.loading.set(true);
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicle.set(data[0] ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Could not load vehicle data.");
        this.loading.set(false);
      }
    })
  }
}
