import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SpinnerService } from './services/spinner/spinner.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    SpinnerService,
  ],
};
