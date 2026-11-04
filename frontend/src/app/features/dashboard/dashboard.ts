import { Component, computed, inject } from '@angular/core';
import { VehicleCard } from '@features/vehicles/vehicle-card/vehicle-card';
import { VehicleAddCard } from '@features/vehicles/vehicle-add-card/vehicle-add-card';
import { VehicleData } from '@features/vehicles/vehicle-data/vehicle-data';
import { ObdWidget } from '@features/obd/obd-widget/obd-widget';
import { AuthService } from '@core/auth-service';
import { VehicleStatsCard } from '@features/vehicles/vehicle-stats-card/vehicle-stats-card';
import { VehicleSamplesChart } from '@features/vehicles/vehicle-samples-chart/vehicle-samples-chart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    VehicleAddCard,
    ObdWidget,
    VehicleCard,
    VehicleData,
    VehicleStatsCard,
    VehicleSamplesChart,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(AuthService);
  private router = inject(Router);

  firstName = computed(() => this.auth.currentUser()?.firstName ?? '');

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
