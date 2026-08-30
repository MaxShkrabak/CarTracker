import { Component } from '@angular/core';
import { VehicleCard } from '../../components/vehicle-card/vehicle-card';
import { Obd } from '../../components/obd/obd';

@Component({
  selector: 'app-dashboard',
  imports: [VehicleCard, Obd],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  name = 'Max';
}
