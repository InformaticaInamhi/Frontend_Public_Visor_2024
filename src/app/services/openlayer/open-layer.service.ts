import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls, FullScreen } from 'ol/control.js';
import { click } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults as defaultInteractions, Select } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Fill, Stroke, Style } from 'ol/style';
import Text from 'ol/style/Text';
import { config_OL } from './config-ol';

import { HttpClient } from '@angular/common/http'; // 🔹 Añadir en la parte superior

@Injectable({
  providedIn: 'root',
})
export class OpenLayerService {
  private map!: Map;
  private loadedLayers: { [key: string]: VectorLayer<any> } = {};

  ecuadorExtent4326 = [-98, -6.5, -71.7, 3.5];
  // Transforma el extent al sistema EPSG:3857
  ecuadorExtent3857 = transformExtent(
    this.ecuadorExtent4326,
    'EPSG:4326',
    'EPSG:3857'
  );

  constructor(private http: HttpClient) {}
  /**
   * Inicializa el mapa con la configuración proporcionada y lo coloca en el elemento HTML especificado.
   * @param targetId El ID del elemento HTML donde se colocará el mapa.
   * @remarks Este método crea un nuevo mapa con una vista y capas base predeterminadas, además de agregar controles de pantalla completa. También se ajusta el comportamiento de los textos de los overlays en función del nivel de zoom del mapa.
   */
  initializeMap(targetId: string): void {
    const mapCenter = fromLonLat(config_OL.center);

    this.map = new Map({
      target: targetId,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: mapCenter,
        zoom: config_OL.zoom,
        maxZoom: config_OL.maxZoom,
        minZoom: config_OL.minZoom,
        extent: this.ecuadorExtent3857,
      }),
      // Desactivar interacciones de teclado
      interactions: defaultInteractions({
        keyboard: false, // Esta línea desactiva la navegación por teclas
      }),
      controls: defaultControls().extend([new FullScreen()]),
    });

    this.map.getView().on('change:resolution', () => {
      const zoom = this.map.getView().getZoom();

      this.map.getOverlays().forEach((overlay) => {
        const element = overlay.getElement();
        if (element instanceof HTMLElement) {
          const textElement = element.querySelector('div:last-child');
          if (textElement instanceof HTMLElement) {
            if (typeof zoom === 'number') {
              textElement.style.display = zoom > 7 ? 'block' : 'none';
            }
          }
        }
      });
    });
  }

  /**
   * Cambia la capa base del mapa a la especificada por `layerName`.
   *
   * Este método busca la configuración de la capa especificada dentro de un objeto de configuración
   * predefinido (`config_OL`). Si la configuración existe, la función procede a crear una nueva capa utilizando la configuración encontrada.
   *
   * @param {string} layerName - El nombre de la capa base a cambiar.
   */

  changeBaseLayer(layerName: string) {
    let layer;
    const layerConfig = config_OL.baseLayers[layerName];
    if (layerConfig) {
      switch (layerConfig.type) {
        case 'OSM':
          layer = new TileLayer({
            source: new OSM(),
          });
          break;
        case 'XYZ':
          layer = new TileLayer({
            source: new XYZ({
              url: layerConfig.url,
            }),
          });
          break;
        default:
          layer = new TileLayer({
            source: new OSM(),
          });
          break;
      }

      if (this.map.getLayers().getLength() > 0) {
        this.map.getLayers().setAt(0, layer);
      } else {
        this.map.addLayer(layer);
      }
    } else {
      console.warn('Layer name not recognized');
    }
  }

  /**
   * Obtiene el mapa creado y configurado.
   * @returns El objeto Map que representa el mapa creado y configurado.
   */
  getMap(): Map {
    return this.map;
  }

  // Método para eliminar una capa basada en su nombre
  clearAllLayers(): void {
    Object.keys(this.loadedLayers).forEach((key) => {
      this.map.removeLayer(this.loadedLayers[key]);
    });
    this.loadedLayers = {}; // Vacía el objeto de capas cargadas
  }

  /**
   * Carga el GeoJSON de Pichincha, lo agrega al mapa, centra y ajusta el zoom.
   */
  loadGeoJsonPichincha(): void {
    fetch('assets/geojson/pichincha.geojson')
      .then((response) => response.json())
      .then((geojsonData) => {
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonData, {
            featureProjection: 'EPSG:3857',
          }),
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: (feature) => {
            const geometry = feature.getGeometry();
            if (!geometry) return undefined;

            const extent = geometry.getExtent();
            const center = [
              (extent[0] + extent[2]) / 2,
              (extent[1] + extent[3]) / 2,
            ];

            return new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 0, 0.3)', // Amarillo con opacidad 0.4
              }),
              stroke: new Stroke({
                color: '#FF0000', // Borde rojo
                width: 2,
              }),
              text: new Text({
                text: 'PICHINCHA',
                font: 'bold 18px Arial',
                fill: new Fill({ color: '#000000' }), // Negro
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }), // Borde blanco para contraste
                textAlign: 'center',
                textBaseline: 'middle',
                offsetY: 0,
                overflow: true,
              }),
            });
          },
        });

        this.map.addLayer(vectorLayer);
        this.loadedLayers['pichincha'] = vectorLayer;

        // Hacer zoom a la geometría de Pichincha
        const extent = vectorSource.getExtent();
        this.map.getView().fit(extent, {
          padding: [60, 60, 60, 60],
          duration: 1000,
        });
      })
      .catch((error) => {
        console.error('Error al cargar el GeoJSON de Pichincha:', error);
      });
  }
}
