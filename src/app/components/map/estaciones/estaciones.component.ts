// 📌 Angular Core
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// 📌 Angular Material
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

// 📌 OpenLayers
import Control from 'ol/control/Control';

// 📌 Modelos
import { FormOptionsStations, Station } from '../../../models/station';

// 📌 Servicios
import { TitleService } from '../../../services/header/title.service';
import { DynamicClusterOlService } from '../../../services/openlayer/marker-cluster/dynamic-cluster-ol.service';
import { MarkerService } from '../../../services/openlayer/marker/marker.service';
import { OpenLayerService } from '../../../services/openlayer/open-layer.service';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { FilterService } from '../../../services/stations/filter-stations/filter.service';
import { StationService } from '../../../services/stations/station.service';

// 📌 GeoJSON (Datos)
import { hidros } from '../../../services/openlayer/geojson/hidro-geojson';

// 📌 Componentes
import { ConfigMapComponent } from '../../forms/config-map/config-map.component';
import { MeteoHidroComponent } from '../../graph/station/meteo-hidro/meteo-hidro.component';
import { SearchMarkerComponent } from '../search-marker/search-marker.component';
import { StationDescriptionComponent } from '../station-description/station-description.component';

// 📌 Configuración y Utilidades
import {
  logosInamhi,
  opt_layers_radio,
  valuesFormConfigMap,
} from '../config-map-estaciones';

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
    MatCheckboxModule,
  ],
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.css',
})
export class EstacionesComponent implements AfterViewInit {
  // Configuración de formularios
  formOptions: FormOptionsStations = valuesFormConfigMap;
  layerSelectionControl = new FormControl(1);

  // Referencias de elementos del DOM
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('btnRef') toggleButtonElement!: ElementRef;

  // Variables de datos
  private markerData!: Station[];
  private stationList!: Station[];
  geoHidros = hidros.map((hydro) => ({
    ...hydro,
    id: hydro.id.toString(),
  }));

  selectedHydroFeatures: any[] = [];
  infoStation: Station | null = null;

  // Opciones de Visualización
  isDropdownVisible: boolean = false;
  isGraphVisible: boolean = false;
  isHydroLayerVisible: boolean = false;
  layerOptions = opt_layers_radio;

  // Configuración de botones y elementos del mapa
  isLegendVisible: boolean = false;
  isConfigMapVisible: boolean = false;
  isFormVisible: boolean = true;
  isSearchMarkerVisible: boolean = false;

  // Logos para el mapa
  inamhiLogo = logosInamhi[0];
  isSelectDropdownVisible: boolean = false;
  opt_layers_radio = opt_layers_radio;

  constructor(
    private mapLayerService: OpenLayerService,
    private mapMarkerService: MarkerService,
    private clusterMarkerService: DynamicClusterOlService,
    private stationService: StationService,
    private stationFilterService: FilterService,
    private loadingSpinnerService: SpinnerService,
    private headerTitleService: TitleService
  ) {
    this.headerTitleService.changeTitle(
      'Visor de estaciones meteorológicas e hidrológicas'
    );
    this.mapMarkerService.getMarkerClickedEvent().subscribe((id_station) => {
      const metadata = this.stationList.find(
        (station) => station.id_estacion === id_station
      );

      if (metadata) {
        this.resetAllViews();
        this.infoStation = metadata;
        this.isGraphVisible = true;
      } else {
        console.warn('No se encontró la estación con ID:', id_station);
      }
    });
  }

  ngAfterViewInit(): void {
    // 🔹 Ejecuta el código después de que la vista se haya inicializado completamente
    setTimeout(() => {
      // 🔹 Muestra el spinner de carga (loading) con un pequeño retraso (0ms)
      this.loadingSpinnerService.show(true);
    }, 0);

    // 🔹 Inicializa el mapa dentro del contenedor definido en la plantilla HTML
    this.mapLayerService.initializeMap(this.mapContainer.nativeElement.id);

    // 🔹 Agrega un control personalizado al mapa
    this.addCustomControl();
    this.mapLayerService.loadGeoJsonPichincha(); // 🔹 Centrar Pichincha en el mapa
    // 🔹 Obtiene la lista de estaciones y la carga en el mapa o en la interfaz
    this.loadStationsByProvincia();
  }

  onChangeBaseLayer(layerName: string): void {
    this.mapLayerService.changeBaseLayer(layerName);
  }

  /**
   * Agrega un control personalizado al mapa.
   */
  addCustomControl(): void {
    const map = this.mapLayerService.getMap();
    const toggleButtonElement = this.toggleButtonElement.nativeElement;
    const customControl = new Control({ element: toggleButtonElement });
    map.addControl(customControl);
  }

  /**
   * Carga las estaciones según el ID de provincia y las coloca como marcadores en el mapa.
   */
  loadStationsByProvincia() {
    const idProvincia = '17'; // Puedes hacerlo dinámico con this.formOptions.get('provincia')?.value

    this.stationService
      .getStationsByProvincia(idProvincia)
      .subscribe((data: Station[]) => {
        setTimeout(() => {
          this.loadingSpinnerService.show(false);
        }, 0);
        this.stationList = data;
        this.reloadMarkersStation(this.formOptions);
      });
  }

  reloadMarkersStation(configValues?: any) {
    if (configValues) {
      this.formOptions = configValues;
    }

    this.markerData = this.stationFilterService.filterStations(
      this.stationList,
      this.formOptions
    );
    this.showUnclusteredMarkers();
  }

  showUnclusteredMarkers(): void {
    const map = this.mapLayerService.getMap();
    this.mapMarkerService.addMarkers(map, this.markerData);
  }

  resetAllViews() {
    this.isHydroLayerVisible = false;
    this.isConfigMapVisible = false;
    this.isSearchMarkerVisible = false;
  }

  toggleView(view: 'layersHidro' | 'configMap' | 'searchStation') {
    if (view === 'layersHidro') {
      this.isHydroLayerVisible = !this.isHydroLayerVisible;
      this.isConfigMapVisible = false;
      this.isSearchMarkerVisible = false;
    } else if (view === 'configMap') {
      this.isConfigMapVisible = !this.isConfigMapVisible;
      this.isHydroLayerVisible = false;
      this.isSearchMarkerVisible = false;
    } else if (view === 'searchStation') {
      this.isSearchMarkerVisible = !this.isSearchMarkerVisible;
      this.isHydroLayerVisible = false;
      this.isConfigMapVisible = false;
    }
  }

  toggleLayerSelection(event: MatCheckboxChange, hidro: any) {
    const isChecked = event.checked;
    this.mapLayerService.clearAllLayers();
    if (isChecked) {
      // Agrega el hidro a la lista de seleccionados
      this.selectedHydroFeatures.push(hidro);
    } else {
      // Elimina el hidro de la lista de seleccionados
      this.selectedHydroFeatures = this.selectedHydroFeatures.filter(
        (h) => h.id !== hidro.id
      );
    }

    if (this.selectedHydroFeatures.length > 0) {
      this.selectedHydroFeatures.map((geoPath: { path: string }) => {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        // Carga el GeoJSON de la capa seleccionada
        // this.geoJsonService
        //   .getStateGeoJson(geoPath.path)
        //   .subscribe((res: any) => {
        //     this.mapLayerService.loadGeoJsonLayer(res, randomColor);
        //   });
      });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isSearchMarkerVisible = false;
    }
  }
}

interface OwnerStation {
  id_propietario: number;
  propietario: string;
}
