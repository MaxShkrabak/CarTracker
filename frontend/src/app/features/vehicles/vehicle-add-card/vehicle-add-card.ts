import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehicle-add-card',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicle-add-card.html',
  styleUrl: './vehicle-add-card.css',
})
export class VehicleAddCard {}
