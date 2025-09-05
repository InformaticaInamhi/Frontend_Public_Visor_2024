// src/app/mapa/services/openlayers-map.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transformExtent, fromLonLat } from 'ol/proj';
import { DEFAULT_OL_CONFIG } from '../../settings/ol-default-config';

// Nuevas importaciones para estilos
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';

export interface MaskStyleConfig {
  strokeColor: string; // Color del borde (ej. "#0000ff")
  strokeOpacity: number; // Opacidad borde (0–1)
  strokeWidth: number; // Grosor borde
  fillColor: string; // Color de fondo
  fillOpacity: number; // Opacidad fondo (0–1)
}

@Injectable({
  providedIn: 'root',
})
export class OpenLayersMapService {
  private map?: Map;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Crea el mapa si se está ejecutando en el navegador (no en SSR).
   */
  createMap(container: HTMLElement): Map | undefined {
    if (!isPlatformBrowser(this.platformId)) return;

    const center = fromLonLat(DEFAULT_OL_CONFIG.center);
    const extent = transformExtent(
      DEFAULT_OL_CONFIG.extent4326,
      'EPSG:4326',
      DEFAULT_OL_CONFIG.projection
    );

    this.map = new Map({
      target: container,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center,
        zoom: DEFAULT_OL_CONFIG.zoom,
        maxZoom: DEFAULT_OL_CONFIG.maxZoom,
        minZoom: DEFAULT_OL_CONFIG.minZoom,
        projection: DEFAULT_OL_CONFIG.projection,
        extent,
      }),
    });

    this.enableMarkerPointerEffect();
    return this.map;
  }

  /** Devuelve el mapa actual */
  getMap(): Map | undefined {
    return this.map;
  }

  /** Fuerza el redimensionamiento del mapa */
  resizeMap(): void {
    if (this.map) {
      setTimeout(() => {
        this.map!.updateSize();
      }, 100);
    }
  }

  /** Cambia el cursor a pointer al pasar sobre un feature */
  enableMarkerPointerEffect(): void {
    const map = this.map;
    if (!map) return;

    map.on('pointermove', (event) => {
      const pixel = map.getEventPixel(event.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);

      const target = map.getTargetElement();
      if (target) {
        target.style.cursor = hit ? 'pointer' : '';
      }
    });
  }

  /** Agrega un GeoJSON sin estilo */
  addGeoJsonLayer(geojson: any): void {
    if (!this.map) return;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: DEFAULT_OL_CONFIG.projection,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);
  }

  /**
   * Agrega un GeoJSON con estilo y etiqueta centrada
   * @param geojson Datos GeoJSON
   * @param styleConfig Configuración de estilo
   * @param label Texto a mostrar en el centro del shape
   */
  addStyledGeoJsonLayerConEtiqueta(
    geojson: any,
    styleConfig: MaskStyleConfig,
    label: string
  ): void {
    if (!this.map) return;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: DEFAULT_OL_CONFIG.projection,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (_feature, resolution) => {
        // 🔥 Calculamos tamaño dinámico
        const zoom = this.map?.getView().getZoom() ?? 10;
        const fontSize = Math.max(12, zoom * 2); // escala con el zoom

        return new Style({
          stroke: new Stroke({
            color: `rgba(${this.hexToRgb(styleConfig.strokeColor)},${
              styleConfig.strokeOpacity
            })`,
            width: styleConfig.strokeWidth,
          }),
          fill: new Fill({
            color: `rgba(${this.hexToRgb(styleConfig.fillColor)},${
              styleConfig.fillOpacity
            })`,
          }),
          text: new Text({
            text: 'PICHINCHA',
            font: 'bold 30px Arial',
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

    // Hacer zoom al extent del shape
    const view = this.map.getView();
    const extent = vectorSource.getExtent();

    view.fit(extent, {
      padding: [10, 40, 65, 40], // margen alrededor
      duration: 1000, // animación
    });

    // Esperar a que termine el fit y fijar el minZoom
    setTimeout(() => {
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setMinZoom(currentZoom); // ahora no puedes alejarte más del shape
      }
    }, 1100); // un poco más que la duración de la animación
  }

  /** Helper HEX → RGB (solo 6 dígitos: #rrggbb) */
  private hexToRgb(hex: string): string {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex.substring(0, 6), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }
}
