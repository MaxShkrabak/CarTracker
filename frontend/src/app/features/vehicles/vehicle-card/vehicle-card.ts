import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../vehicle-service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  vehicle = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({ params: vid }) => this.vehicleService.getVehicle(vid),
  });

  imageMissing = signal(false);
  private imageVersion = signal(0);

  imageUrl(vid: number) {
    return `/api/vehicle/${vid}/image?v=${this.imageVersion()}`;
  }

  onImageSelected(event: Event, vid: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.vehicleService.uploadImage(vid, file).subscribe({
      next: () => {
        this.imageMissing.set(false);
        this.imageVersion.update((v) => v + 1);
      },
      error: () => {
        this.toastr.error(
          'Could not upload image. Make sure it is a JPEG or PNG under 10MB.',
          'Vehicle',
        );
      },
    });
  }
}
