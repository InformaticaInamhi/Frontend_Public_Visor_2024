import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ParametroEstacion } from '../../data-core/models/observation-point';
import { PointObservationModel } from '../../data-core/models/point-observation.model';
import { StationForecastPanel } from '../station-forecast-panel/station-forecast-panel';
import { StationChart } from '../station-chart/station-chart';
@Component({
  selector: 'app-station-data-panel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    StationForecastPanel,
    StationChart,
  ],
  templateUrl: './station-data-panel.html',
  styleUrl: './station-data-panel.scss',
})
export class StationDataPanel implements OnInit {
  @Input() parametros: ParametroEstacion[] = [];
  @Input() stationInformation: PointObservationModel | null = null;
  @Output() cerrarPanel = new EventEmitter<void>();

  // Estado actual del menú: 'datos' o 'pronostico'
  selectedTabIndex = 0;

  ngOnInit(): void {}

  cerrar() {
    this.cerrarPanel.emit();
  }
}
