import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Vehicle } from '../vehicle';
import { MAKES, MODELS_BY_MAKE, TRANSMISSION_TYPES, TRIMS_BY_MAKE } from '../vehicle-options';
import { VehicleService } from '../../../../../core/vehicle-service';
import { ToastrService } from 'ngx-toastr';
import { VinDecodeResponse } from '../vin-decode-response';

@Component({
  selector: 'app-vehicle-form',
  imports: [RouterLink, MatSelectModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {
  private readonly toastr = inject(ToastrService);
  private vehicleService = inject(VehicleService);
  private readonly cdr = inject(ChangeDetectorRef);

  minYear = 1996;
  maxYear = new Date().getFullYear() + 1;

  years = Array.from({ length: this.maxYear - this.minYear + 1 }, (_, i) => this.maxYear - i);

  readonly makes = MAKES;

  newVehicle: Vehicle = {
    vid: 0,
    vin: '',
    make: '',
    model: '',
    modelYear: new Date().getFullYear(),
    bodyClass: '',
    trim: '',
    color: '',
    transmissionStyle: '',
    engineCylinders: 0,
    engineHP: 0,
    mileage: 0,
    licensePlate: '',
  };

  get models(): string[] {
    return MODELS_BY_MAKE[this.newVehicle.make] ?? [];
  }

  get trims(): string[] {
    return TRIMS_BY_MAKE[this.newVehicle.make] ?? [];
  }

  get transmissions(): string[] {
    return TRANSMISSION_TYPES ?? [];
  }

  onMakeChange(): void {
    this.newVehicle.model = '';
  }

  onVinChange(value: string): void {
    this.newVehicle.vin = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
  }

  vehicleDecode(): void {
    if (this.newVehicle.vin.length !== 17) {
      this.toastr.error('VIN must consist of 17 characters.', 'Decode VIN');
      return;
    }

    this.vehicleService.decodeVin(this.newVehicle.vin).subscribe({
      next: (res) => {
        this.applyDecode(res);
        this.toastr.success('VIN has been decoded successfully.', 'Decode VIN');
      },
      error: (err) => {},
    });
  }

  private matchOption(value: string, options: string[]): string {
    if (!value) {
      return '';
    }

    const tokenize = (s: string) =>
      s
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

    const decoded = tokenize(value);
    let best = '';
    let bestLength = 0;

    for (const option of options) {
      const candidate = tokenize(option);
      if (!candidate.length || candidate.length <= bestLength) {
        continue;
      }

      const limit = decoded.length - candidate.length;
      for (let start = 0; start <= limit; start++) {
        if (candidate.every((token, i) => token === decoded[start + i])) {
          best = option;
          bestLength = candidate.length;
          break;
        }
      }
    }

    return best;
  }

  private applyDecode(res: VinDecodeResponse): void {
    if (res.make) {
      this.newVehicle.make = this.matchOption(res.make, MAKES);
    }
    if (res.model) {
      this.newVehicle.model = this.matchOption(res.model, this.models);
    }
    if (res.trim) {
      this.newVehicle.trim = this.matchOption(res.trim, this.trims);
    }
    if (res.transmissionStyle) {
      this.newVehicle.transmissionStyle = this.matchOption(
        res.transmissionStyle,
        TRANSMISSION_TYPES,
      );
    }
    if (res.bodyClass) {
      this.newVehicle.bodyClass = res.bodyClass;
    }
    if (res.engineCylinders) {
      this.newVehicle.engineCylinders = res.engineCylinders;
    }
    if (res.engineHP) {
      this.newVehicle.engineHP = res.engineHP;
    }
    if (res.modelYear) {
      this.newVehicle.modelYear = res.modelYear;
    }
    if (res.vin) {
      this.newVehicle.vin = res.vin;
    }

    this.cdr.markForCheck();
  }
}
