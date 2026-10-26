import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/auth-service';
import { DriveService } from '@features/obd/drive-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { VehicleService } from '../vehicle-service';

@Component({
  selector: 'app-vehicle-stats-card',
  imports: [],
  templateUrl: './vehicle-stats-card.html',
  styleUrl: './vehicle-stats-card.css',
})
export class VehicleStatsCard {
  private readonly auth = inject(AuthService);
  private readonly drive = inject(DriveService);
  private readonly vehicleService = inject(VehicleService);

  readonly stats = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({params: vid}) => this.drive.getVehicleStats(vid),
  })

  readonly vehicle = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({params: vid }) => this.vehicleService.getVehicle(vid),
  })

  readonly maxSpeedMph = computed(() => {
    const kph = this.stats.value()?.maxSpeed?.value;
    return kph == null ? null : Math.round(kph * 0.621371);
  })

  readonly maxCoolantF = computed(() => {
    const coolant = this.stats.value()?.maxCoolant?.value;
    return coolant == null ? null : Math.round((coolant * 9) / 5 + 32);
  })

}
