import 'ol/ol.css';

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideNativeDateAdapter } from '@angular/material/core';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideNativeDateAdapter(), //
  ],
}).catch((err) => console.error(err));
