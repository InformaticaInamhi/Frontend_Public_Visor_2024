import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaMain } from './components/mapa-main/mapa-main';
MapaMain

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRoutingModule { }
