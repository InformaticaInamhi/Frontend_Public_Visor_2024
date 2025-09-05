import { Routes } from '@angular/router';
import { MainRoot } from './main/main-root/main-root';
import { ForecastPanel } from './forecast/components/forecast-panel/forecast-panel';

export const routes: Routes = [
  { path: 'visor', component: MainRoot },
  { path: 'forecast', component: ForecastPanel }, // nueva ruta agregada
  { path: '', redirectTo: 'visor', pathMatch: 'full' },
  { path: '**', redirectTo: 'visor' },
];
