import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ObdConnection {
  readonly status = signal('Not connected');

  async connect(): Promise<void> {
    try {
      this.status.set('Opening picker…');

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [0xfff0, 0xffe0, 0x18f0],
      });

      this.status.set('Connecting…');
      await device.gatt!.connect();

      this.status.set(`Connected to ${device.name ?? 'device'}`);
    } catch (e) {
      this.status.set(`Failed: ${(e as Error).message}`);
    }
  }
}