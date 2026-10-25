import { Component, computed, inject, signal } from '@angular/core';
import { ObdConnection } from '../obd-connection';

export type Wheel = 'fl' | 'fr' | 'bl' | 'br';
type WheelState = 'normal' | 'warn' | 'event';

export interface WheelSpeeds {
  fl: number;
  fr: number;
  bl: number;
  br: number;
}

// Full lock on 1B0 is ~±470 units; drawn tires turn at most 25°
const MAX_STEER_UNITS = 470;
const MAX_STEER_DEG = 25;
// A wheel this far off the average is flagged amber
const WARN_PCT = 3;

@Component({
  selector: 'app-wheel-diagram',
  imports: [],
  templateUrl: './wheel-diagram.html',
  styleUrl: './wheel-diagram.css',
})
export class WheelDiagram {
  private readonly obd = inject(ObdConnection);

  readonly wheels = this.obd.wheelSpeeds;
  readonly steeringAngle = this.obd.steeringAngle;
  readonly eventWheel = signal<Wheel | null>(null);

  readonly steerDeg = computed(() => (-this.steeringAngle() / MAX_STEER_UNITS) * MAX_STEER_DEG);

  // % difference of each wheel from the four-wheel average
  readonly diff = computed(() => {
    const w = this.wheels();
    const avg = (w.fl + w.fr + w.bl + w.br) / 4;
    const pct = (v: number) => (avg < 3 ? 0 : ((v - avg) / avg) * 100);
    return { fl: pct(w.fl), fr: pct(w.fr), bl: pct(w.bl), br: pct(w.br) };
  });

  readonly state = computed(() => {
    const d = this.diff();
    const spin = this.eventWheel();
    const s = (k: Wheel): WheelState =>
      spin === k ? 'event' : Math.abs(d[k]) > WARN_PCT ? 'warn' : 'normal';
    return { fl: s('fl'), fr: s('fr'), bl: s('bl'), br: s('br') };
  });

  fmt(pct: number): string {
    // U+2212 minus lines up with the + sign in tabular figures
    return `${pct >= 0 ? '+' : '-'}${Math.abs(pct).toFixed(1)}%`;
  }
}
