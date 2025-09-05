import { Injectable } from '@angular/core';
import { Feature, Map as OLMap } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { PointObservationModel } from '../../data-core/models/point-observation.model';
import { DEFAULT_OL_STYLE } from '../../settings/ol-default-config';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarkerLayerService {
  private markerLayer: VectorLayer<VectorSource> | null = null;

  // Stream para emitir el ID de la estación al hacer clic
  private estacionSeleccionadaSubject = new Subject<number>();
  estacionSeleccionada$ = this.estacionSeleccionadaSubject.asObservable();
  private marcadorSeleccionado: Feature | null = null;

  private getCategoryLabel(id_categoria: number): string {
    switch (id_categoria) {
      case 1:
        return 'M';
      case 2:
        return 'H';
      case 3:
        return 'HM';
      default:
        return '?';
    }
  }

  private getFillColor(estacion: PointObservationModel): string {
    const { circleColors } = DEFAULT_OL_STYLE;

    // if (estacion.id_estado_estacion === 2) {
    //   return circleColors.mantenimiento;
    // }

    if (estacion.id_estado_transmision === 1) {
      return circleColors.transmitiendo;
    }

    if (estacion.id_estado_transmision === 2) {
      return circleColors.noTransmite;
    }

    return circleColors.porDefecto;
  }

  private getCircleStyle(
    zoom: number,
    label: string,
    estacion: PointObservationModel
  ): Style {
    const {
      circleMinRadius,
      circleMaxRadius,
      circleZoomFactor,
      fontFamily,
      fontWeight,
      internalTextColor,
      internalTextOutline,
      internalTextOutlineWidth,
      circleStrokeColor,
    } = DEFAULT_OL_STYLE;

    const radius = Math.max(
      circleMinRadius,
      Math.min(zoom * circleZoomFactor, circleMaxRadius)
    );
    const fontSize = Math.round(radius * 1.2);

    const fillColor = this.getFillColor(estacion);

    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: circleStrokeColor, width: 1 }),
      }),
      text: new Text({
        text: label,
        font: `${fontWeight} ${fontSize}px ${fontFamily}`,
        fill: new Fill({ color: internalTextColor }),
        stroke: new Stroke({
          color: internalTextOutline,
          width: internalTextOutlineWidth,
        }),
        textAlign: 'center',
        textBaseline: 'middle',
        offsetY: 0,
      }),
    });
  }

  private getTextStyleBelow(radius: number, codigo: string): Style {
    const {
      externalTextColor,
      externalTextOutline,
      externalTextOutlineWidth,
      textOffsetY,
    } = DEFAULT_OL_STYLE;

    const fontSize = Math.round(radius * 0.8);

    return new Style({
      text: new Text({
        text: codigo,
        font: `normal ${fontSize}px sans-serif`,
        fill: new Fill({ color: externalTextColor }),
        stroke: new Stroke({
          color: externalTextOutline,
          width: externalTextOutlineWidth,
        }),
        textAlign: 'center',
        textBaseline: 'top',
        offsetY: radius + textOffsetY,
      }),
    });
  }

  renderMarkers(map: OLMap, observations: PointObservationModel[]) {
    if (this.markerLayer) {
      map.removeLayer(this.markerLayer);
    }

    const zoom = map.getView().getZoom() ?? 10;
    const radius = Math.max(
      DEFAULT_OL_STYLE.circleMinRadius,
      Math.min(
        zoom * DEFAULT_OL_STYLE.circleZoomFactor,
        DEFAULT_OL_STYLE.circleMaxRadius
      )
    );

    // Agrupar por latitud-longitud
    const grouped = new Map<string, PointObservationModel[]>();
    observations.forEach((obs) => {
      const key = `${obs.latitud},${obs.longitud}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(obs);
    });

    const features: Feature[] = [];

    grouped.forEach((group, key) => {
      const [lat, lon] = key.split(',').map(Number);
      const base = fromLonLat([lon, lat]);

      if (group.length === 1) {
        const obs = group[0];
        features.push(this.createFeature(obs, base, zoom, radius));
      } else {
        const angleStep = (2 * Math.PI) / group.length;
        const baseSpread = 25;
        const zoomFactor = zoom / 10;
        const spread = baseSpread * zoomFactor;

        group.forEach((obs, i) => {
          const angle = i * angleStep;
          const dx = spread * Math.cos(angle);
          const dy = spread * Math.sin(angle);
          const displaced = [base[0] + dx, base[1] + dy];

          features.push(this.createFeature(obs, displaced, zoom, radius));
        });
      }
    });

    const source = new VectorSource({ features });

    this.markerLayer = new VectorLayer({
      source,
      zIndex: 1000,
    });

    map.addLayer(this.markerLayer);

    map.getView().on('change:resolution', () => {
      const newZoom = map.getView().getZoom() ?? 10;
      const newRadius = Math.max(
        DEFAULT_OL_STYLE.circleMinRadius,
        Math.min(
          newZoom * DEFAULT_OL_STYLE.circleZoomFactor,
          DEFAULT_OL_STYLE.circleMaxRadius
        )
      );

      source.getFeatures().forEach((feature) => {
        const categoria = feature.get('categoria') ?? 0;
        const label = this.getCategoryLabel(categoria);
        const codigo = feature.get('codigo') ?? '';
        const estacion = feature.getProperties() as PointObservationModel;

        const styles: Style[] = [this.getCircleStyle(newZoom, label, estacion)];

        if (newZoom >= DEFAULT_OL_STYLE.zoomShowLabel) {
          styles.push(this.getTextStyleBelow(newRadius, codigo));
        }

        feature.setStyle(styles);
      });
    });

    map.on('singleclick', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const idEstacion = feature.get('code'); // <-- este es tu id_estacion
        if (idEstacion) {
          this.emitirEstacionSeleccionada(idEstacion);
        }
      });
    });
  }

  private createFeature(
    obs: PointObservationModel,
    coords3857: number[],
    zoom: number,
    radius: number
  ): Feature {
    const label = this.getCategoryLabel(obs.id_categoria);

    const feature = new Feature({
      geometry: new Point(coords3857),
      name: obs.punto_obs,
      code: obs.id_estacion,
      categoria: obs.id_categoria,
      codigo: obs.codigo,
      id_estado_transmision: obs.id_estado_transmision,
      id_estado_estacion: obs.id_estado_transmision,
    });

    const styles: Style[] = [this.getCircleStyle(zoom, label, obs)];
    if (zoom >= DEFAULT_OL_STYLE.zoomShowLabel) {
      styles.push(this.getTextStyleBelow(radius, obs.codigo));
    }

    feature.setStyle(styles);
    return feature;
  }

  // Emitir el ID desde aquí
  emitirEstacionSeleccionada(id_estacion: number) {
    this.estacionSeleccionadaSubject.next(id_estacion);
  }
}
