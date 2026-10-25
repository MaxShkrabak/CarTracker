import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/auth-service';
import { ObdConnection } from '../obd-connection';

@Component({
  selector: 'app-obd-widget',
  imports: [],
  templateUrl: './obd-widget.html',
  styleUrl: './obd-widget.css',
})
export class ObdWidget {
  readonly obd = inject(ObdConnection);
  private readonly auth = inject(AuthService);

  readonly vehicleId = computed(() => this.auth.currentUser()?.primaryVehicleId ?? null);

  toggle(): void {
    const vid = this.vehicleId();

    if (this.obd.connected()) {
      this.obd.disconnect();
    } else if (vid !== null) {
      this.obd.connect(vid);
    }
  }
}
