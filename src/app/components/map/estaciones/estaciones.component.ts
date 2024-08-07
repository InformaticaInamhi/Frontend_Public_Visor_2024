import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import Control from 'ol/control/Control';
import { Station } from '../../../models/station';
import { MarkerService } from '../../../services/openlayer/marker/marker.service';

import { MatButtonModule } from '@angular/material/button';
import { TitleService } from '../../../services/header/title.service';
import { DynamicClusterOlService } from '../../../services/openlayer/marker-cluster/dynamic-cluster-ol.service';
import { OpenLayerService } from '../../../services/openlayer/open-layer.service';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { FilterService } from '../../../services/stations/filter-stations/filter.service';
import { StationService } from '../../../services/stations/station.service';
import { ConfigMapComponent } from '../../forms/config-map/config-map.component';
import { MeteoHidroComponent } from '../../graph/stations/meteo-hidro/meteo-hidro.component';
import {
  FormOptionsStations,
  opt_layers_radio,
  valuesFormConfigMap,
} from '../config-map-estaciones';
import { SearchMarkerComponent } from '../search-marker/search-marker.component';
import { StationDescriptionComponent } from '../station-description/station-description.component';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [
    MatRadioModule,
    ReactiveFormsModule,
    ConfigMapComponent,
    StationDescriptionComponent,
    MeteoHidroComponent,
    MatButtonModule,
    SearchMarkerComponent,
  ],
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.css',
})
export class EstacionesComponent implements AfterViewInit {
  valuesFormConfigMap: FormOptionsStations = valuesFormConfigMap;

  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  @ViewChild('btnRef') buttonElement!: ElementRef;

  private markersData!: Station[];
  private stations!: Station[];
  selectVisible: boolean = false;
  opt_layers_radio = opt_layers_radio;
  selectedLayerControl = new FormControl(1);

  //* Botones para el map
  btnLegendStations: boolean = false;
  btnConfigMap: boolean = false;
  btnFormFirms: boolean = true;
  divSearchMarker: boolean = false;

  showHideGraph: boolean = false;

  //opciones para las graficas
  infoStation: any = {};

  stationNetwork: OwnerStation[] = [];

  constructor(
    private openLayerService: OpenLayerService,
    private markerService: MarkerService,
    private clusterService: DynamicClusterOlService,
    private stationService: StationService,
    private filterService: FilterService,
    private spinnerService: SpinnerService,
    private titleService: TitleService
  ) {
    this.titleService.changeTitle(
      'Visor de estaciones meteorológicas e hidrológicas'
    );
    this.markerService.getMarkerClickedEvent().subscribe((id_station) => {
      this.stationService
        .getMetadataStation(id_station)
        .subscribe((metadata) => {
          this.infoStation = metadata;
          this.showHideGraph = true;
        });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.spinnerService.show(true);
    }, 0);
    this.openLayerService.initializeMap(this.mapElement.nativeElement.id);
    this.addCustomControl();
    this.getStations();
  }

  onChangeBaseLayer(layerName: string): void {
    this.openLayerService.changeBaseLayer(layerName);
  }

  /**
   * Agrega un control personalizado al mapa.
   */
  addCustomControl(): void {
    const map = this.openLayerService.getMap();
    const buttonElement = this.buttonElement.nativeElement;
    const customControl = new Control({ element: buttonElement });
    map.addControl(customControl);
  }

  /**
   * Obtiene las estaciones del servicio y las agrega como marcadores en el mapa.
   */
  getStations() {
    this.stationService
      .getAllStationsbyAplication()
      .subscribe((data: Station[]) => {
        setTimeout(() => {
          this.spinnerService.show(false);
        }, 0);
        this.stations = data;
        this.reloadMarkersStation(this.valuesFormConfigMap);
      });
  }

  showClusteredMarkers(): void {
    const map = this.openLayerService.getMap();
    this.clusterService.initcluster(map, this.markersData);
  }

  showUnclusteredMarkers(): void {
    const map = this.openLayerService.getMap();
    this.markerService.addMarkers(map, this.markersData);
  }

  reloadMarkersStation(configValues?: any) {
    if (configValues) {
      this.valuesFormConfigMap = configValues;
    }
    this.markersData = this.filterService.filterStations(
      this.stations,
      this.valuesFormConfigMap
    );
    this.showUnclusteredMarkers();
  }
}

interface OwnerStation {
  id_propietario: number;
  propietario: string;
}
