import { Injectable, signal, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ObdConnection {
  private readonly toastr = inject(ToastrService);
  private device: BluetoothDevice | null = null;

  readonly status = signal('Not connected');

  async connect(): Promise<void> {
    if (this.status() !== 'Not connected') return;

    try {
      this.status.set('Opening picker…');

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [0xfff0, 0xffe0, 0x18f0],
      });

      this.status.set('Connecting…');
      await device.gatt!.connect();

      this.device = device;
      this.status.set(`Connected to ${device.name ?? 'device'}`);
      this.toastr.success(`Connected to ${device.name ?? 'device'}`, 'OBD2');
    } catch (e) {
      const err = e as Error;
      this.status.set('Not connected');
      this.toastr.error(err.message, 'OBD2');
    }
  }

  disconnect(): void {
    this.device?.gatt?.disconnect();
    this.device = null;
    this.status.set('Not connected');
  }
}
