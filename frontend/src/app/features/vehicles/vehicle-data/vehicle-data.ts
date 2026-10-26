import { Component, computed, inject } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';
import { ObdConnection } from '@features/obd/obd-connection';
import { DriveService } from '@features/obd/drive-service';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/auth-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { WheelDiagram } from '@features/obd/wheel-diagram/wheel-diagram';

const GREEN = '#55a151';
const AMBER = '#d4a13a';
const RED = '#b84040';

type Band = [from: number, to: number, color: string];

function gaugeOptions(
  value: number,
  min: number,
  max: number,
  unit: string,
  decimals: number,
  bands: Band[],
): Highcharts.Options {
  const gap = (max - min) * 0.01;

  return {
    chart: { type: 'solidgauge', height: 150, spacing: [0, 0, 0, 0] },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: { enabled: false },
    pane: {
      startAngle: -120,
      endAngle: 120,
      center: ['50%', '54%'],
      size: '100%',
      background: [
        {
          innerRadius: '70%',
          outerRadius: '86%',
          backgroundColor: 'rgba(0, 0, 0, 0.22)',
          borderWidth: 0,
          shape: 'arc',
        },
      ],
    },
    yAxis: {
      min,
      max,
      lineWidth: 0,
      tickPositions: [],
      minorTickWidth: 0,
      labels: { enabled: false },
      plotBands: bands.map(([from, to, color], i) => ({
        from: i === 0 ? from : from + gap / 2,
        to: i === bands.length - 1 ? to : to - gap / 2,
        color,
        innerRadius: '92%',
        outerRadius: '97%',
      })),
    },
    plotOptions: {
      solidgauge: {
        innerRadius: '70%',
        radius: '86%',
        threshold: min,
        dataLabels: {
          y: 4,
          borderWidth: 0,
          useHTML: false,
          formatter: function () {
            const v = (this.y ?? 0).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            return (
              `<span style="font-size:24px;font-weight:700">${v}</span>` +
              `<span style="font-size:11px;fill:#b0b0bb"> ${unit}</span>`
            );
          },
        },
      },
    },
    series: [{ type: 'solidgauge', name: unit, data: [{ y: value, color: '#e2e1eb' }] }],
  };
}

@Component({
  selector: 'app-vehicle-data',
  imports: [HighchartsChartDirective, DatePipe, WheelDiagram],
  templateUrl: './vehicle-data.html',
  styleUrl: './vehicle-data.css',
})
export class VehicleData {
  readonly obd = inject(ObdConnection);
  private readonly drive = inject(DriveService);
  private readonly auth = inject(AuthService);

  private readonly sessions = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({ params: vid }) => this.drive.getVehicleSessions(vid),
  });

  private readonly lastSessionEnd = computed(
    () => this.sessions.value()?.find((s) => s.endedAt !== null)?.endedAt ?? null,
  );

  readonly lastUsed = computed(() => this.obd.lastDriveEnd() ?? this.lastSessionEnd());

  /* RPM */
  rpmOptions = computed(() =>
    gaugeOptions(this.obd.rpm(), 0, 8000, 'rpm', 0, [
      [0, 5500, GREEN],
      [5500, 6500, AMBER],
      [6500, 8000, RED],
    ]),
  );

  /* Coolant Temp */
  coolantOptions = computed(() =>
    gaugeOptions(this.obd.coolantTemp(), 100, 260, '°F', 0, [
      [100, 160, AMBER],
      [160, 220, GREEN],
      [220, 235, AMBER],
      [235, 260, RED],
    ]),
  );

  /* Fuel Level */
  fuelOptions = computed(() =>
    gaugeOptions(this.obd.fuelLevel(), 0, 100, '%', 0, [
      [0, 12, RED],
      [12, 25, AMBER],
      [25, 100, GREEN],
    ]),
  );

  /* Battery Voltage */
  batteryOptions = computed(() =>
    gaugeOptions(this.obd.voltage(), 10, 16, 'V', 1, [
      [10, 11.8, RED],
      [11.8, 12.4, AMBER],
      [12.4, 14.8, GREEN],
      [14.8, 15.2, AMBER],
      [15.2, 16, RED],
    ]),
  );
}
