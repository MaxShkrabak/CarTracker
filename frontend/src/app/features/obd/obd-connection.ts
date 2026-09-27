import { Injectable, signal, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { parseRPM, parseSpeed } from './obd-parser';

// useful: https://afshari.lu/post/213-elm/
const VGATE_SERVICE = 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'; // service id of ELM327 OBD2 BLE
const VGATE_CHARACTERISTIC = 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'; // for read and write

@Injectable({ providedIn: 'root' })
export class ObdConnection {
  private readonly toastr = inject(ToastrService);
  private readonly decoder = new TextDecoder();
  private readonly encoder = new TextEncoder();
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private pendingResponse: ((response: string) => void) | null = null;

  readonly status = signal('Not connected');
  readonly lastResponse = signal('No response.');

  // OBD2 Data
  readonly speed = signal(0);
  readonly rpm = signal(0);

  async connect(): Promise<void> {
    if (this.status() !== 'Not connected') return;

    try {
      this.status.set('Opening picker…');

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [VGATE_SERVICE],
      });
      this.device = device;

      device.addEventListener('gattserverdisconnected', this.disconnect);

      this.status.set('Connecting…');
      const server = await device.gatt!.connect();

      const service = await server.getPrimaryService(VGATE_SERVICE);
      this.characteristic = await service.getCharacteristic(VGATE_CHARACTERISTIC);

      this.characteristic.addEventListener('characteristicvaluechanged', this.onData);

      await this.characteristic.startNotifications();

      console.log('Works without response: ' + this.characteristic.properties.writeWithoutResponse);

      this.status.set(`Connected to ${device.name ?? 'device'}`);
      this.toastr.success(`Connected to ${device.name ?? 'device'}`, 'OBD2');

      await this.write('ATZ');
      await this.write('ATE0');
      await this.write('ATSP0');

      this.pollLoop(); // start polling
    } catch (e) {
      const err = e as Error;
      this.disconnect();
      this.toastr.error(err.message, 'OBD2');
    }
  }

  readonly disconnect = (): void => {
    this.characteristic?.removeEventListener('characteristicvaluechanged', this.onData);
    this.device?.gatt?.disconnect();
    this.device = null;
    this.characteristic = null;
    this.status.set('Not connected');
  };

  // Sending requests to the OBD2 to receive specific data (e.g., RPM or Speed)
  async write(request: string): Promise<string> {
    if (this.characteristic === null) {
      throw new Error('Error sending data to OBD2. Check connection.');
    }

    this.lastResponse.set('');

    // wait for entire response
    const response = new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingResponse = null;
        reject(new Error(`No reponse to ${request}`));
      }, 5000);

      this.pendingResponse = (text) => {
        clearTimeout(timeout);
        resolve(text);
      };
    });

    const encodedRequest = this.encoder.encode(request + '\r');
    await this.characteristic.writeValueWithResponse(encodedRequest);

    return response;
  }

  // Receiving requested DATA from OBD2
  private readonly onData = (event: Event): void => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const encodedData = characteristic.value;

    if (encodedData === undefined) {
      return;
    }

    this.lastResponse.update((current) => current + this.decoder.decode(encodedData));

    const text = this.lastResponse();

    if (this.pendingResponse !== null && text.includes('>')) {
      const done = this.pendingResponse;
      this.pendingResponse = null;
      done(text);
    }
  };

  // Continuously requests speed until this connection ends
  private async pollLoop(): Promise<void> {
    const connection = this.characteristic;

    while (connection !== null && this.characteristic === connection) {
      try {

        // vehicle speed
        const speedResponse = await this.write('010D');
        const kph = parseSpeed(speedResponse);

        if (kph !== null) {
          this.speed.set(Math.round(kph * 0.621371));
        }

        // rpm
        const rpmResponse = await this.write(`010C`);
        const rpm = parseRPM(rpmResponse);

        if (rpm !== null) {
          this.rpm.set(rpm);
        }

      } catch (e) {
        console.warn('OBD2 poll failed:', e);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
}
