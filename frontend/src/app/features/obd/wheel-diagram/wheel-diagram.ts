import { Component, computed, signal } from '@angular/core';

export type Wheel = 'fl' | 'fr' | 'rl' | 'rr';
type WheelState = 'normal' | 'warn' | 'event';

export interface WheelSpeeds {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

// Full lock on 1B0 is ~±470 units; drawn tyres turn at most 25°
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
  // TODO: hardcoded, replace with live 1D0 (wheel speeds, km/h) and 1B0 (steering angle) data
  readonly wheels = signal<WheelSpeeds>({ fl: 54.12, fr: 54.31, rl: 53.98, rr: 56.6 });
  readonly steeringAngle = signal(0);
  readonly eventWheel = signal<Wheel | null>(null);

  readonly steerDeg = computed(
    () => (-this.steeringAngle() / MAX_STEER_UNITS) * MAX_STEER_DEG,
  );

  // % difference of each wheel from the four-wheel average
  readonly diff = computed(() => {
    const w = this.wheels();
    const avg = (w.fl + w.fr + w.rl + w.rr) / 4;
    const pct = (v: number) => (avg < 3 ? 0 : ((v - avg) / avg) * 100);
    return { fl: pct(w.fl), fr: pct(w.fr), rl: pct(w.rl), rr: pct(w.rr) };
  });

  readonly state = computed(() => {
    const d = this.diff();
    const spin = this.eventWheel();
    const s = (k: Wheel): WheelState =>
      spin === k ? 'event' : Math.abs(d[k]) > WARN_PCT ? 'warn' : 'normal';
    return { fl: s('fl'), fr: s('fr'), rl: s('rl'), rr: s('rr') };
  });

  fmt(pct: number): string {
    // U+2212 minus lines up with the + sign in tabular figures
    return `${pct >= 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`;
  }
}
