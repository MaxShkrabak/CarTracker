import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth-service';
import { DriveSession } from '@features/obd/drive-models';
import { DriveService } from '@features/obd/drive-service';
import { HighchartsChartDirective } from 'highcharts-angular';

interface DailySamples {
  date: Date;
  samples: number;
}

const DAYS_SHOWN = 14;

function dailySamples(sessions: DriveSession[]): DailySamples[] {
  const days: DailySamples[] = [];

  for (let daysAgo = DAYS_SHOWN - 1; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    let samples = 0;
    for (const session of sessions) {
      if (new Date(session.startedAt).toDateString() === date.toDateString()) {
        samples += session.sampleCount ?? 0;
      }
    }

    days.push({ date, samples });
  }
  return days;
}

function samplesChartOptions(days: DailySamples[]): Highcharts.Options {
  return {
    chart: { type: 'column', height: 280, spacing: [8, 0, 0, 0] },
    title: { text: undefined },
    legend: { enabled: false },
    xAxis: {
      categories: days.map((d) =>
        d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ),
      crosshair: false,
      tickLength: 0,
    },
    yAxis: {
      title: { text: undefined },
      min: 0,
      gridLineColor: 'var(--color-surface)',
      gridLineWidth: 1,
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{point.key}</span><br/>',
      pointFormat: '<b>{point.y:,.0f}</b> samples',
    },
    plotOptions: {
      column: {
        color: 'var(--color-accent)',
        borderWidth: 0,
        borderRadius: { radius: 4, where: 'end' },
        maxPointWidth: 24,
      },
    },
    series: [{ type: 'column', name: 'Samples', data: days.map((d) => d.samples) }],
  };
}

@Component({
  selector: 'app-vehicle-samples-chart',
  imports: [HighchartsChartDirective],
  templateUrl: './vehicle-samples-chart.html',
  styleUrl: './vehicle-samples-chart.css',
})
export class VehicleSamplesChart {
  private readonly auth = inject(AuthService);
  private readonly drive = inject(DriveService);

  private readonly sessions = rxResource({
    params: () => this.auth.currentUser()?.primaryVehicleId ?? undefined,
    stream: ({ params: vid }) => this.drive.getVehicleSessions(vid),
  });
  readonly options = computed(() => samplesChartOptions(dailySamples(this.sessions.value() ?? [])));
}
