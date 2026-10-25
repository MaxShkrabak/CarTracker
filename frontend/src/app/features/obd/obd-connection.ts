import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { decodeCanSignal, parseBatteryVoltage, parseFuelLevel } from './obd-parser';
import { DriveService } from './drive-service';
import { DriveSampleRequest } from './drive-models';
import { firstValueFrom } from 'rxjs';
import { Wheel, WheelSpeeds } from './wheel-diagram/wheel-diagram';
import { CAN_SIGNALS, CAN_GROUPS, CanGroup } from './can-signals';

// useful: https://afshari.lu/post/213-elm/
const VGATE_SERVICE = 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'; // service id of ELM327 OBD2 BLE
const VGATE_CHARACTERISTIC = 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'; // read and write channel
const CAN_ID_LENGTH = 3;
const CAN_CHECK_EVERY_MS = 50; // time to recheck if data needs to be refetched
const CAN_READ_TIMEOUT_MS = 500;
const CAN_STOP_TIMEOUT_MS = 1000;
const WRITE_TIMEOUT_MS = 5000; // wait for adapter to answer a command
const FLUSH_EVERY_MS = 5000; // how often samples are sent to backend
const VOLTAGE_EVERY_MS = 30000;

@Injectable({ providedIn: 'root' })
export class ObdConnection {
  private readonly drive = inject(DriveService);
  private readonly toastr = inject(ToastrService);
  private readonly decoder = new TextDecoder();
  private readonly encoder = new TextEncoder();

  // Bluetooth connection
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  // Command replies
  private responseBuffer = '';
  private pendingResponse: ((response: string) => void) | null = null;

  // CAN monitoring
  private streaming = false;
  private lineBuffer = '';
  private currentFilter = '';
  private currentIds: string[] = [];
  private readonly seenIds = new Set<string>();
  private adapterStopped = false;
  private onAllSeen: (() => void) | null = null;
  private onStopped: (() => void) | null = null;

  // Drive session
  private sessionId: number | null = null;
  private sampleBuffer: DriveSampleRequest[] = [];
  private lastFlush = Date.now();

  // Connected status
  readonly status = signal('Not connected');
  readonly connected = computed(() => this.status().startsWith('Connected to'));
  readonly lastDriveEnd = signal<string | null>(null);

  // Live OBD2 Data
  readonly speed = signal(0);
  readonly rpm = signal(0);
  readonly steeringAngle = signal(0);
  readonly wheelSpeeds = signal<WheelSpeeds>({ fl: 0, fr: 0, bl: 0, br: 0 });
  readonly coolantTemp = signal(100); // 100 is the lowest temp on graph
  readonly fuelLevel = signal(0);
  readonly voltage = signal(10);

  async connect(vid: number): Promise<void> {
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

      this.status.set(`Connected to ${device.name ?? 'device'}`);
      this.toastr.success(`Connected to ${device.name ?? 'device'}`, 'OBD2');

      await this.write('ATZ'); // reset device
      await this.write('ATE0');
      await this.write('ATSP0');

      // fuel is read once
      const fuel = await this.readFuel();

      await this.write('ATSP6');
      await this.write('ATH1');
      await this.write('ATS0');
      await this.write('ATCAF0');

      const session = await firstValueFrom(this.drive.startSession(vid));
      this.sessionId = session.sessionId;
      this.sampleBuffer = [];
      this.lastFlush = Date.now();

      if (fuel !== null) {
        this.sampleBuffer.push({
          recordedAt: new Date().toISOString(),
          signal: 'fuel',
          value: fuel,
        });
      }

      this.canLoop(); // start reading CAN frames
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
    this.streaming = false;
    this.lineBuffer = '';
    this.currentFilter = '';
    this.status.set('Not connected');
    this.endDriveSession();
  };

  // Sends an AT command and waits for adapter's reply
  async write(request: string): Promise<string> {
    if (this.characteristic === null) {
      throw new Error('Error sending data to OBD2. Check connection.');
    }

    this.responseBuffer = '';

    const response = this.waitFor<string>(WRITE_TIMEOUT_MS, `No response to ${request}`);
    this.pendingResponse = response.done;

    try {
      await this.characteristic.writeValueWithResponse(this.encoder.encode(request + '\r'));
      return await response.promise;
    } finally {
      this.pendingResponse = null;
    }
  }

  private readonly onData = (event: Event): void => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const encodedData = characteristic.value;

    if (encodedData === undefined) {
      return;
    }

    const text = this.decoder.decode(encodedData);

    if (!this.streaming) {
      this.responseBuffer += text;

      if (this.responseBuffer.includes('>')) {
        this.pendingResponse?.(this.responseBuffer);
      }

      return;
    }

    if (text.includes('>')) {
      this.adapterStopped = true;
      this.onStopped?.();
    }

    // streaming
    this.lineBuffer = this.lineBuffer + text;
    const pieces = this.lineBuffer.split(/[\r\n]+/);
    this.lineBuffer = pieces.pop() ?? '';

    for (const piece of pieces) {
      const line = piece.replace(/\s/g, '').toUpperCase();
      if (line === '') continue;
      this.handleFrame(line);
    }
  };

  private waitFor<T = void>(timeoutMs: number, timeoutMessage: string) {
    let done!: (value: T) => void;

    const promise = new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);

      done = (value: T) => {
        clearTimeout(timeout);
        resolve(value);
      };
    });
    promise.catch(() => {});

    return { promise, done };
  }

  private async canLoop(): Promise<void> {
    const connection = this.characteristic;
    const lastRead = new Map<string, number>(); // group name, last read
    let lastVoltage = 0;

    while (connection !== null && this.characteristic === connection) {
      for (const group of CAN_GROUPS) {
        const last = lastRead.get(group.name) ?? 0;

        if (Date.now() - last >= group.intervalMs) {
          try {
            await this.readCycle(group);
          } catch (e) {
            this.currentFilter = '';
            console.warn('Failed to read CAN', e);
          }

          lastRead.set(group.name, Date.now());
        }
      }

      if (Date.now() - lastVoltage >= VOLTAGE_EVERY_MS) {
        await this.readVoltage();
        lastVoltage = Date.now();
      }

      if (Date.now() - this.lastFlush > FLUSH_EVERY_MS) {
        await this.flushSamples(this.sessionId);
      }

      await new Promise((resolve) => setTimeout(resolve, CAN_CHECK_EVERY_MS));
    }
  }

  private async readCycle(group: CanGroup): Promise<void> {
    if (this.characteristic === null) {
      throw new Error('Error sending data to OBD2.');
    }

    if (this.currentFilter !== group.filter + group.mask) {
      await this.write('ATCF ' + group.filter);
      await this.write('ATCM ' + group.mask);
      this.currentFilter = group.filter + group.mask;
    }

    this.currentIds = group.ids;

    this.seenIds.clear();
    this.adapterStopped = false;
    this.lineBuffer = '';
    this.streaming = true;

    try {
      const allSeen = this.waitFor(CAN_READ_TIMEOUT_MS, 'CAN IDs missing, waiting for all.');
      this.onAllSeen = allSeen.done;

      await this.characteristic.writeValueWithResponse(this.encoder.encode('ATMA\r'));
      await allSeen.promise.catch(() => {});
      this.onAllSeen = null;

      if (!this.adapterStopped) {
        const stopped = this.waitFor(CAN_STOP_TIMEOUT_MS, 'Adapter is still monitoring.');
        this.onStopped = stopped.done;
        await this.characteristic.writeValueWithResponse(this.encoder.encode('\r'));
        await stopped.promise;
      }
    } finally {
      // runs on success and on failure, so the next write() always sees normal mode
      this.streaming = false;
      this.onAllSeen = null;
      this.onStopped = null;
      this.responseBuffer = '';
    }
  }

  private handleFrame(line: string): void {
    const id = line.slice(0, CAN_ID_LENGTH);
    const hex = line.slice(CAN_ID_LENGTH);

    for (const canSignal of CAN_SIGNALS) {
      if (canSignal.id !== id) continue;

      const value = decodeCanSignal(canSignal, hex);
      if (value === null) continue;

      if (!this.seenIds.has(id)) {
        this.sampleBuffer.push({
          recordedAt: new Date().toISOString(),
          signal: canSignal.name,
          value,
        });
      }

      switch (canSignal.name) {
        case 'speed':
          this.speed.set(Math.round(value * 0.621371));
          break;
        case 'rpm':
          this.rpm.set(Math.round(value));
          break;
        case 'coolant':
          this.coolantTemp.set(Math.round((value * 9) / 5 + 32));
          break;
        case 'steering':
          this.steeringAngle.set(value);
          break;
        case 'wheelFL':
        case 'wheelFR':
        case 'wheelBL':
        case 'wheelBR':
          const wheel = canSignal.name.slice(5).toLowerCase() as Wheel;
          this.wheelSpeeds.update((w) => ({ ...w, [wheel]: value }));
          break;
      }
    }

    this.seenIds.add(id);
    if (this.currentIds.every((id) => this.seenIds.has(id))) {
      this.onAllSeen?.();
    }
  }

  private async readVoltage(): Promise<void> {
    try {
      const voltage = parseBatteryVoltage(await this.write('ATRV'));
      if (voltage !== null) {
        this.voltage.set(voltage);
        this.sampleBuffer.push({
          recordedAt: new Date().toISOString(),
          signal: 'voltage',
          value: voltage,
        });
      }
    } catch (e) {
      console.warn('Failed to read voltage', e);
    }
  }

  private async readFuel(): Promise<number | null> {
    try {
      const reply = await this.write('012F');
      const fuel = parseFuelLevel(reply);

      if (fuel === null) {
        console.warn('No fuel level in reply', JSON.stringify(reply));
        return null;
      }

      this.fuelLevel.set(fuel);
      return fuel;
    } catch (e) {
      console.warn('Failed to read fuel level', e);
      return null;
    }
  }

  private async flushSamples(sessionId: number | null): Promise<void> {
    if (sessionId === null || this.sampleBuffer.length === 0) {
      return;
    }
    const batch = this.sampleBuffer.splice(0);
    this.lastFlush = Date.now();

    try {
      await firstValueFrom(this.drive.addSamples(sessionId, batch));
    } catch {
      this.sampleBuffer.unshift(...batch);
    }
  }

  private async endDriveSession(): Promise<void> {
    const id = this.sessionId;
    if (id === null) {
      return;
    }
    this.sessionId = null;

    await this.flushSamples(id);

    try {
      const ended = await firstValueFrom(this.drive.endSession(id));
      this.lastDriveEnd.set(ended.endedAt);
    } catch (e) {
      console.warn('Failed to end drive session', e);
    }
  }
}
