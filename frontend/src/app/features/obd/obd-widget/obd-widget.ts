import { Component, inject } from '@angular/core';
import { ObdConnection } from '../obd-connection';

@Component({
  selector: 'app-obd-widget',
  imports: [],
  templateUrl: './obd-widget.html',
  styleUrl: './obd-widget.css',
})
export class ObdWidget {
  readonly obd = inject(ObdConnection);
}
