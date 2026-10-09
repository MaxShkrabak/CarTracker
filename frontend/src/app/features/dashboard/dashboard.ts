import { Component, computed, inject } from '@angular/core';
import { VehicleCard } from '@features/vehicles/vehicle-card/vehicle-card';
import { VehicleAddCard } from '@features/vehicles/vehicle-add-card/vehicle-add-card';
import { VehicleData } from '@features/vehicles/vehicle-data/vehicle-data';
import { ObdWidget } from '@features/obd/obd-widget/obd-widget';
import { WheelDiagram } from '@features/obd/wheel-diagram/wheel-diagram';
import { AuthService } from '@core/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [VehicleAddCard, ObdWidget, VehicleCard, VehicleData, WheelDiagram],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(AuthService);
  firstName = computed(() => this.auth.currentUser()?.firstName ?? '');
}
