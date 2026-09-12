import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';

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

function readout(unit: string) {
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
  imports: [HighchartsChartDirective],
  templateUrl: './vehicle-data.html',
  styleUrl: './vehicle-data.css',
})
export class VehicleData {
  /* Speed Gauge */
  speedOptions: Highcharts.Options = {
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
        data: [1],
        dataLabels: readout('MPH'),
      },
    ],
  };

  /* RPM */
  rpmOptions: Highcharts.Options = {
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
        data: [1],
        dataLabels: readout('RPM'),
      },
    ],
  };

  /* Coolant Temp */
  coolantOptions: Highcharts.Options = {
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
        data: [150],
        dataLabels: readout('\u00B0F'),
      },
    ],
  };

  /* Fuel Level */
  fuelOptions: Highcharts.Options = {
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
        { from: 0, to: 69.5, color: '#b0cf26' },
        { from: 69.5, to: 100, color: '#464543' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'Fuel',
        data: [69.5],
        dataLabels: readout('%'),
      },
    ],
  };

  /* Battery Voltage */
  batteryOptions: Highcharts.Options = {
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
        { from: 10, to: 13.8, color: '#00A96B' },
        { from: 13.8, to: 16, color: '#464543' },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: 'Battery Voltage',
        data: [13.8],
        dataLabels: readout('V'),
      },
    ],
  };
}
