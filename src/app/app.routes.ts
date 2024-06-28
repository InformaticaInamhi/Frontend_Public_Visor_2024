import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EstacionesComponent } from './components/map/estaciones/estaciones.component';
import { GuiasVisorComponent } from './components/basic/guias-visor/guias-visor.component';

export const routes: Routes = [
  { path: '', redirectTo: '/visor', pathMatch: 'full' },
  { path: 'visor', component: EstacionesComponent, title: 'Visor de Estaciones' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'repositorio', component: GuiasVisorComponent, title: 'Repositorio' },
];
