import { Component, computed, inject, signal } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';
import { ObdConnection } from '../../../../obd/obd-connection';
import { DriveService } from '../../../../../core/drive-service';
import { DatePipe } from '@angular/common';

const gaugeChart: Highcharts.ChartOptions = {
  type: 'gauge',
  height: '100%',
  spacing: [0, 0, 2, 0],
};

const gaugePane: Highcharts.PaneOptions = {
  startAngle: -120,
  endAngle: 120,
  center: ['50%', '50%'],
  size: '92%',
  background: null,
};

const gaugeAxis: Highcharts.YAxisOptions = {
  tickLength: 0,
  tickWidth: 0,
  labels: { distance: 6, style: { fontSize: '9px' } },
};

function readout(unit: string, inline = false) {
  return {
    useHTML: true,
    borderWidth: 0,
    y: 15,
    format:
      '<div style="text-align:center;line-height:1.15">' +
      '<div style="font-size:20px;font-weight:700">{y}</div>' +
      `<div style="font-size:9px">${unit}</div>` +
      '</div>',
  };
}

@Component({
  selector: 'app-vehicle-data',
  imports: [HighchartsChartDirective, DatePipe ],
  templateUrl: './vehicle-data.html',
  styleUrl: './vehicle-data.css',
})
export class VehicleData {
  readonly obd = inject(ObdConnection);
  private readonly drive = inject(DriveService);

  private readonly lastSessionEnd = signal<string | null>(null);
  readonly lastUsed = computed(() => this.obd.lastDriveEnd() ?? this.lastSessionEnd());

  // TODO: hardcoded (1) need to fix
  constructor() {
    this.drive.getVehicleSessions(1).subscribe((sessions) => {
      this.lastSessionEnd.set(sessions.find((s) => s.endedAt !== null)?.endedAt ?? null);
    })
  }

  /* Speed Gauge */
  speedOptions = computed((): Highcharts.Options => ({
    chart: gaugeChart,
    title: { text: undefined },
    credits: { enabled: false },
    pane: gaugePane,
    yAxis: {
      ...gaugeAxis,
      min: 0,
      max: 220,
      tickPositions: [0, 220],
      plotBands: [
        { from: 0, to: 69.5, color: '#00A96B' },
        { from: 70.5, to: 109.5, color: '#FFBF00' },
        { from: 110.5, to: 220, color: '#a90025' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'Speed',
        data: [this.obd.speed()],
        dataLabels: readout('MPH'),
      },
    ],
  }));

  /* RPM */
  rpmOptions = computed((): Highcharts.Options => ({
    chart: gaugeChart,
    title: { text: undefined },
    credits: { enabled: false },
    pane: gaugePane,
    yAxis: {
      ...gaugeAxis,
      min: 0,
      max: 8000,
      tickPositions: [0, 8000],
      plotBands: [
        { from: 0, to: 5975, color: '#00A96B' },
        { from: 6025, to: 6975, color: '#FFBF00' },
        { from: 7025, to: 8000, color: '#a90025' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'RPM',
        data: [this.obd.rpm()],
        dataLabels: readout('RPM'),
      },
    ],
  }));

  /* Coolant Temp */
  coolantOptions = computed((): Highcharts.Options => ({
    chart: gaugeChart,
    title: { text: undefined },
    credits: { enabled: false },
    pane: gaugePane,
    yAxis: {
      ...gaugeAxis,
      min: 100,
      max: 260,
      tickPositions: [100, 260],
      plotBands: [
        { from: 0, to: 159.5, color: '#0074a9' },
        { from: 160.5, to: 229.5, color: '#00A96B' },
        { from: 230.5, to: 260, color: '#a90025' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'temp',
        data: [this.obd.coolantTemp()],
        dataLabels: readout('\u00B0F'),
      },
    ],
  }));

  /* Fuel Level */
  fuelOptions = computed((): Highcharts.Options => ({
    chart: gaugeChart,
    title: { text: undefined },
    credits: { enabled: false },
    pane: gaugePane,
    yAxis: {
      ...gaugeAxis,
      min: 0,
      max: 100,
      tickPositions: [0, 100],
      minorTickWidth: 0,
      labels: {
        distance: 6,
        style: { fontSize: '9px' },
        formatter: (ctx) => (ctx.value === 0 ? 'E' : ctx.value === 100 ? 'F' : ''),
      },
      plotBands: [
        { from: 0, to: this.obd.fuelLevel(), color: '#b0cf26' },
        { from: this.obd.fuelLevel(), to: 100, color: '#464543' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'Fuel',
        data: [this.obd.fuelLevel()],
        dataLabels: readout('%'),
      },
    ],
  }));

  /* Battery Voltage */
  batteryOptions = computed((): Highcharts.Options => ({
    chart: gaugeChart,
    title: { text: undefined },
    credits: { enabled: false },
    pane: gaugePane,
    yAxis: {
      ...gaugeAxis,
      min: 10,
      max: 16,
      tickPositions: [10, 16],
      minorTickWidth: 0,
      plotBands: [
        { from: 10, to: this.obd.voltage(), color: '#00A96B' },
        { from: this.obd.voltage(), to: 16, color: '#464543' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'Battery Voltage',
        data: [this.obd.voltage()],
        dataLabels: readout('V'),
      },
    ],
  }));
}
