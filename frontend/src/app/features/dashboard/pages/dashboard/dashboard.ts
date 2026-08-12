import { Component } from '@angular/core';
import { VehicleCard } from '../../components/vehicle-card/vehicle-card';

@Component({
  selector: 'app-dashboard',
  imports: [VehicleCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
