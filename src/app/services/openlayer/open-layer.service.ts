import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls, FullScreen } from 'ol/control.js';
import { click } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import {
  defaults as defaultInteractions,
  Extent,
  Select,
} from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Fill, Stroke, Style } from 'ol/style';
import Text from 'ol/style/Text';
import { config_OL } from './config-ol';
import { getCenter } from 'ol/extent';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
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

  // /**
  //  * Agrega un GeoJSON al mapa con un color predeterminado.
  //  * @param geoJson Datos del GeoJSON.
  //  * @param color Color en formato hexadecimal (ejemplo: 'ff0000').
  //  */
  // loadGeoJsonLayer(geoJson: any, color: string = 'ff0000'): void {
  //   if (!this.map) {
  //     console.error('El mapa no está inicializado.');
  //     return;
  //   }

  //   const style = new Style({
  //     fill: new Fill({ color: `#${color}80` }), // Opacidad 50%
  //     stroke: new Stroke({ color: `#${color}`, width: 1 }),
  //   });

  //   const vectorLayer = new VectorLayer({
  //     source: new VectorSource({
  //       features: new GeoJSON().readFeatures(geoJson, {
  //         featureProjection: 'EPSG:3857',
  //       }),
  //     }),
  //     style,
  //   });

  //   this.map.addLayer(vectorLayer);
  // }

  loadGeoJsonLayer(
    geoJson: any,
    colorBorde: string,
    colorFondo: string,
    opacidad: number,
    tamanioLineaBorde: number,
    tituloLayer: string | null
  ): void {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }

    const layerName = tituloLayer ?? geoJson.name ?? 'GeoJSON Layer';

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJson, {
        featureProjection: 'EPSG:3857',
      }),
    });

    const features = vectorSource.getFeatures();
    if (features.length === 0) return;

    // Obtiene el centro del GeoJSON
    const extent = vectorSource.getExtent();6
    const center = getCenter(extent);

    // Agrega una feature con el nombre en el centro del GeoJSON
    const labelFeature = new Feature({
      geometry: new Point(center), // ✅ Corrección: Usar `Point` correctamente
      name: layerName,
    });

    labelFeature.setStyle(
      new Style({
        text: new Text({
          text: layerName,
          font: 'bold 40px Arial', // ✅ Letra más grande
          fill: new Fill({ color: '#000' }), // Texto negro
          stroke: new Stroke({ color: '#fff', width: 3 }), // Contorno blanco
          textAlign: 'center',
          textBaseline: 'middle',
        }),
      })
    );

    vectorSource.addFeature(labelFeature);

    // Aplica el estilo al GeoJSON
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: `rgba(${parseInt(colorFondo.slice(0, 2), 16)}, ${parseInt(
            colorFondo.slice(2, 4),
            16
          )}, ${parseInt(colorFondo.slice(4, 6), 16)}, ${opacidad})`,
        }),
        stroke: new Stroke({
          color: `#${colorBorde}`,
          width: tamanioLineaBorde,
        }),
      }),
    });

    this.map.addLayer(vectorLayer);
    this.loadedLayers[layerName] = vectorLayer;

    // 🔹 Ajustar zoom al GeoJSON después de agregarlo
    this.zoomToGeoJson(vectorSource);
  }

  /**
   * Centra el mapa en el GeoJSON y ajusta el zoom.
   */
  zoomToGeoJson(vectorSource: VectorSource): void {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }

    const extent = vectorSource.getExtent();

    if (extent && extent[0] !== Infinity) {
      this.map
        .getView()
        .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
    } else {
      console.error('No se pudo calcular la extensión del GeoJSON.');
    }
  }
}
