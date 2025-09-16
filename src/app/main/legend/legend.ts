import { Component } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-legend',
  imports: [CdkDrag],
  templateUrl: './legend.html',
  styleUrl: './legend.scss',
})
export class Legend {
  panelOpen = false;

  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  estaciones = [
    { tipo: 'Meteorológica', codigo: 'M' },
    { tipo: 'Hidrológica', codigo: 'H' },
    { tipo: 'Hidro-Meteorológica', codigo: 'HM' },
    { tipo: 'Reservorio', codigo: 'R' },
  ];

  estados = [
    { nombre: 'Transmitiendo', color: 'green' },
    { nombre: 'Sin Transmisión', color: 'red' },
    { nombre: 'Mantenimiento', color: 'yellow' },
  ];
}
