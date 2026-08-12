import { Component, inject } from '@angular/core';
import { ObdConnection } from '../../../obd/obd-connection';

@Component({
  selector: 'app-obd',
  imports: [],
  templateUrl: './obd.html',
  styleUrl: './obd.css',
})
export class Obd {
  readonly obd = inject(ObdConnection);
}
