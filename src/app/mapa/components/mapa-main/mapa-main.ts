import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PointObservationModel } from '../../../data-core/models/point-observation.model';
import { MarkerLayerService } from '../../services/marker-layer';
import { OpenLayersMapService } from '../../services/openlayers-map';
import { GeodataService } from '../../services/geodata';

@Component({
  selector: 'app-mapa-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-main.html',
  styleUrl: './mapa-main.scss',
})
export class MapaMain implements OnInit {
  @Input() observations: PointObservationModel[] = [];

  @ViewChild('mapContainerRef') mapContainerRef!: ElementRef;

  constructor(
    private olService: OpenLayersMapService,
    private markerService: MarkerLayerService,
    private geodataService: GeodataService
  ) {}

  ngOnInit(): void {
    // Espera a que el contenedor esté disponible en el DOM
    setTimeout(() => {
      const container = this.mapContainerRef.nativeElement;
      this.olService.createMap(container);
      this.olService.resizeMap();

      const map = this.olService.getMap();
      if (map) {
        this.markerService.renderMarkers(map, this.observations);
      }

      this.crearMascaraPrincipal();
      console.log(this.observations);
    });
  }

  /**
   * Crea la máscara principal desde un GeoJSON y la agrega al mapa con estilo y etiqueta.
   */
  crearMascaraPrincipal(): void {
    const path = 'assets/geo/mascara_principal.geojson';

    this.geodataService.getData(path).subscribe({
      next: (data) => {
        const map = this.olService.getMap();
        if (map) {
          this.olService.addStyledGeoJsonLayerConEtiqueta(
            data,
            {
              strokeColor: '#ff0000ff',
              strokeOpacity: 0.7,
              strokeWidth: 1,
              fillColor: '#eeff00ff',
              fillOpacity: 0.3,
            },
            'PICHINCHA'
          );
        }
      },
      error: (err) => {
        console.error('Error cargando la máscara principal:', err);
      },
    });
  }
}
