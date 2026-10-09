import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Vehicle } from '../vehicle-models';
import { DriveService } from '@features/obd/drive-service';
import { AuthService } from '@core/auth-service';
import { VehicleService } from '../vehicle-service';

@Component({
  selector: 'app-vehicle-list-card',
  imports: [MatMenuModule, MatButtonModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicle-list-card.html',
  styleUrl: './vehicle-list-card.css',
})
export class VehicleListCard {
  private readonly driveService = inject(DriveService);
  private readonly vehicleService = inject(VehicleService);
  private auth = inject(AuthService);

  deleted = output<number>();
  isPrimary = computed(() => this.auth.currentUser()?.primaryVehicleId === this.vehicle().vid);
  vehicle = input.required<Vehicle>();
  lastUsed = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLastUsed();
  }

  loadLastUsed(): void {
    this.driveService.getVehicleSessions(this.vehicle().vid).subscribe((sessions) => {
      this.lastUsed.set(sessions.find((s) => s.endedAt !== null)?.endedAt ?? 'N/A');
    });
  }

  setPrimary(): void {
    this.vehicleService.setPrimary(this.vehicle().vid).subscribe();
  }

  deleteVehicle(): void {
    if (!confirm('Remove this vehicle?')) return;
    const vid = this.vehicle().vid;
    this.vehicleService.deleteVehicle(vid).subscribe(() => this.deleted.emit(vid));
  }
}
