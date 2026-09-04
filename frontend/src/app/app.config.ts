import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', subscriptSizing: 'dynamic' } },
    provideToastr({
      closeButton: true,
      timeOut: 3000, // 3 seconds
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ]
};
