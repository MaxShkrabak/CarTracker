import { Component } from '@angular/core';
import { VehicleCard } from '@features/vehicles/vehicle-card/vehicle-card';
import { VehicleAddCard } from '@features/vehicles/vehicle-add-card/vehicle-add-card';
import { VehicleData } from '@features/vehicles/vehicle-data/vehicle-data';
import { ObdWidget } from '@features/obd/obd-widget/obd-widget';

@Component({
  selector: 'app-dashboard',
  imports: [VehicleAddCard, ObdWidget, VehicleCard, VehicleData],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  name = 'Max'; // TODO: fix hardcode
}
