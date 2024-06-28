import { Component } from '@angular/core';
import { itemsLegendStations } from '../config-map-estaciones';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-station-description',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './station-description.component.html',
  styleUrl: './station-description.component.css',
})
export class StationDescriptionComponent {
  itemsLegendStations = itemsLegendStations;
}
