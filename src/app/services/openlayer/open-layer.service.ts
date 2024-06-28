import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { FullScreen, defaults as defaultControls } from 'ol/control.js';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { config_OL } from './config-ol';
@Injectable({
  providedIn: 'root',
})
export class OpenLayerService {
  private map!: Map;
  ecuadorExtent4326 = [-98, -6.5, -72.7, 3.5];
  // Transforma el extent al sistema EPSG:3857
  ecuadorExtent3857 = transformExtent(
    this.ecuadorExtent4326,
    'EPSG:4326',
    'EPSG:3857'
  );

  constructor() {
    // Coordenadas del extent [minX, minY, maxX, maxY] en EPSG:4326
  }

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
}
