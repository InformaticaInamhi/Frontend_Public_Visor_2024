import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { Observable, Subject } from 'rxjs';
import { Station } from '../../../models/station';
import { markerStyles, markerText } from './../config-ol';
@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private markerClicked$ = new Subject<number>();
  private overlays: Overlay[] = [];
  constructor() {}

  /**
   * Agrega marcadores al mapa utilizando los datos proporcionados.
   * @param markersData Los datos de los marcadores que se agregarán al mapa.
   * @remarks Este método limpia los marcadores antiguos y agrega nuevos marcadores al mapa.
   */
  addMarkers(map: Map, markersData: Station[]): void {
    // Limpia marcadores antiguos

    this.overlays.forEach((overlay) => map.removeOverlay(overlay));
    this.overlays = [];

    const zoom = map.getView().getZoom();
    // Añade nuevos marcadores
    markersData.forEach((markerData) => {
      const element = this.createCircleMarker(
        markerData.codigo,
        markerData.id_estacion,
        markerData.id_categoria,
        markerData.id_estado_estacion,
        zoom!
      );
      const overlay = new Overlay({
        position: fromLonLat([markerData.longitud, markerData.latitud]),
        positioning: 'center-center',
        element: element,
        stopEvent: false,
      });

      map.addOverlay(overlay);
      this.overlays.push(overlay);
    });
  }

  /**
   * Crea un marcador circular con el contenido y estilo especificados.
   * @param puobcodi El contenido del marcador.
   * @param id_station El ID de la estación asociada al marcador.
   * @param id_category El ID de la categoría del marcador.
   * @param id_status El ID del estado del marcador.
   * @returns Un elemento HTML que representa el marcador creado.
   */
  createCircleMarker(
    puobcodi: string,
    id_station: number,
    id_category: number,
    id_status: number,
    zoom: number
  ): HTMLElement {
    const letterMap: Record<number, string> = {
      1: 'M',
      2: 'H',
      3: 'HM',
      4: 'R',
    };
    const colorMap: Record<number, string> = {
      1: 'green',
      2: 'yellow',
      3: 'red',
      4: 'blue',
    };

    const letter = letterMap[id_category] || '';
    const color = colorMap[id_status] || '';

    const element = document.createElement('div');
    markerStyles.backgroundColor = color;

    Object.assign(element.style, markerStyles);

    const circle = document.createElement('div');
    circle.innerText = letter;

    const text = document.createElement('div');
    text.innerText = puobcodi;

    Object.assign(text.style, markerText);
    if (zoom > 8) {
      text.style.display = 'block';
    }

    element.appendChild(circle);
    element.appendChild(text);

    element.addEventListener('click', (e) => {
      this.markerClicked$.next(id_station);
      e.stopPropagation();
    });

    element.setAttribute('puobcodi', puobcodi);

    return element;
  }

  /**
   * Obtiene un observable que emite eventos cuando se hace clic en un marcador.
   * @returns Un observable que emite eventos cuando se hace clic en un marcador, proporcionando el ID de la estación asociada al marcador.
   */
  getMarkerClickedEvent(): Observable<number> {
    return this.markerClicked$.asObservable();
  }

  findMarkerByCode(codigo: string): Overlay | undefined {
    return this.overlays.find((overlay) => {
      const markerElement = overlay.getElement();
      return markerElement && markerElement.getAttribute('puobcodi') === codigo;
    });
  }

  /**
   * Encuentra marcadores por una coincidencia parcial de su código.
   * @param map Objeto Map de OpenLayers donde los overlays están presentes.
   * @param codePart La parte del código de marcador que se busca.
   * @returns Un array de Overlays que coinciden parcialmente con el código dado.
   */
  findMarkersByPartialCode(codePart: string): Overlay[] {
    return this.overlays
      .filter((overlay) => {
        const markerElement = overlay.getElement();
        return (
          markerElement &&
          markerElement.getAttribute('puobcodi')?.includes(codePart)
        );
      })
      .map((overlay: any) => overlay.getElement()?.getAttribute('puobcodi'));
  }
}
