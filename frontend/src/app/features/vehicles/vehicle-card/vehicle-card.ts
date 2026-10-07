import { Component, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../vehicle-service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth-service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.css',
})
export class VehicleCard {
  private vehicleService = inject(VehicleService);
  private auth = inject(AuthService);

  vehicle = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({ params: vid }) => this.vehicleService.getVehicle(vid),
  });
}
