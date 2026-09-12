import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { authErrorInterceptor } from './core/auth-error-interceptor';
import { provideHighcharts } from 'highcharts-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authErrorInterceptor])),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill', subscriptSizing: 'dynamic' },
    },
    provideToastr({
      closeButton: true,
      timeOut: 3000, // 3 seconds
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideHighcharts({
      options: {
        chart: { backgroundColor: 'transparent' },
        title: { style: { color: 'var(--color-text)' } },
        subtitle: { style: { color: 'var(--color-text-secondary)' } },
        credits: { enabled: false },
        yAxis: {
          labels: { style: { color: 'var(--color-text)' } },
          title: { style: { color: 'var(--color-text-secondary)' } },
          lineColor: 'var(--color-surface)',
          tickColor: 'var(--color-surface)',
          minorTickColor: 'var(--color-surface)',
        },
        xAxis: {
          labels: { style: { color: 'var(--color-text)' } },
          lineColor: 'var(--color-surface)',
          tickColor: 'var(--color-surface)',
        },
        legend: { itemStyle: { color: 'var(--color-text)' } },
        tooltip: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-accent)',
          style: { color: 'var(--color-text)' },
        },
        plotOptions: {
          series: { dataLabels: { style: { color: 'var(--color-text)', textOutline: 'none' } } },
        },
      },
      modules: () => [import('highcharts/esm/highcharts-more')],
    }),
  ],
};
