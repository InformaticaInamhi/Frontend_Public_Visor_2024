import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EstacionesComponent } from './components/map/estaciones/estaciones.component';
import { GuiasVisorComponent } from './components/basic/guias-visor/guias-visor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'visor', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'repositorio',
    component: GuiasVisorComponent,
    title: 'repositorio',
  },

  {
    path: 'visor',
    component: EstacionesComponent,
    title: 'visor de estaciones',
  },
];
