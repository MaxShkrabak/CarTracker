import { Component } from '@angular/core';
import { VehicleCard } from '../../components/vehicles/vehicle-card/vehicle-card';
import { Obd } from '../../components/obd/obd';
import { VehicleAdd } from '../../components/vehicles/vehicle-add/vehicle-add';

@Component({
  selector: 'app-dashboard',
  imports: [VehicleAdd, Obd, VehicleCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  name = 'Max'; // TODO: fix hardcode
}
