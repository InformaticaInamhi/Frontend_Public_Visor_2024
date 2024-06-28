import { Injectable } from '@angular/core';
import Map from 'ol/Map';

import { createEmpty, extend } from 'ol/extent.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Cluster, Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Fill, Icon, Style, Text } from 'ol/style';
import Stroke from 'ol/style/Stroke';
import { Station } from '../../../models/station';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
@Injectable({
  providedIn: 'root',
})
export class DynamicClusterOlService {
  hoverFeature: any;

  vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: './assets/data/geojson/photovoltaic.json',
  });

  constructor() {}

  clusterStyle(feature: any) {
    const size = feature.get('features').length;
    const colors = {
      small: 'rgba(102, 204, 0, 0.6)',
      large: 'rgba(255, 165, 0, 0.6)',
    };

    const circleFillColor = size <= 10 ? colors.small : colors.large;
    const outerCircleFill =
      size <= 10 ? 'rgba(181, 226, 140, 0.6)' : 'rgba(241, 211, 87, 0.6)';

    const outerCircle = new CircleStyle({
      radius: 20,
      fill: new Fill({ color: outerCircleFill }),
    });
    const innerCircle = new CircleStyle({
      radius: 14,
      fill: new Fill({ color: circleFillColor }),
    });

    const textFill = new Fill({ color: '#fff' });
    const textStroke = new Stroke({ color: 'rgba(0, 0, 0, 0.6)', width: 3 });

    if (size > 1) {
      return [
        new Style({
          image: outerCircle,
        }),
        new Style({
          image: innerCircle,
          text: new Text({
            text: size.toString(),
            fill: textFill,
            stroke: textStroke,
          }),
        }),
      ];
    }
    const originalFeature = feature.get('features')[0];

    const darkIcon = new Icon({
      src: './assets/data/icons/emoticon-cool.svg',
    });
    const lightIcon = new Icon({
      src: './assets/data/icons/emoticon-cool-outline.svg',
    });

    let icon = new Style({
      geometry: originalFeature.getGeometry(),
      image: originalFeature.get('LEISTUNG') > 5 ? darkIcon : lightIcon,
    });

    return icon;
  }

  initcluster(map: Map, station: Station[]) {
    console.log(station);

    let vectorData = this.createVectorSource(station);
    let clusterSource = new Cluster({
      distance: 20,
      source: vectorData,
    });

    // Layer displaying the clusters and individual features.
    let clusters = new VectorLayer({
      source: clusterSource,
      style: this.clusterStyle,
    });

    let clusterHulls = new VectorLayer({
      source: clusterSource,
    });

    map.addLayer(clusters);


    map.on('pointermove', (event) => {
      clusters.getFeatures(event.pixel).then((features) => {
        if (features[0] !== this.hoverFeature) {
          // Display the convex hull on hover.
          this.hoverFeature = features[0];
          clusterHulls.setStyle();
          // Change the cursor style to indicate that the cluster is clickable.
          map.getTargetElement().style.cursor =
            this.hoverFeature && this.hoverFeature.get('features').length > 1
              ? 'pointer'
              : '';
        }
      });
    });

    map.on('click', (event) => {
      clusters.getFeatures(event.pixel).then((features) => {
        if (features.length > 0) {
          const clusterMembers = features[0].get('features');
          if (clusterMembers.length > 1) {
            // Calculate the extent of the cluster members.
            const extent = createEmpty();
            clusterMembers.forEach((feature: any) =>
              extend(extent, feature.getGeometry().getExtent())
            );
            const view = map.getView();
            const resolution = map.getView().getResolution();

            if (resolution != undefined) {
              view.fit(extent, { duration: 500, padding: [10, 10, 10, 10] });
            }
          }
        }
      });
    });
  }

  createVectorSource(data: Station[]): VectorSource {
    const vectorSource = new VectorSource();

    data.forEach((item) => {
      const lat = parseFloat(item.latitud.toString());
      const lon = parseFloat(item.longitud.toString());

      const point = new Point(fromLonLat([lon, lat]));
      const feature = new Feature({
        geometry: point,
        id_estacion: item.id_estacion,
        codigo: item.codigo,
        id_captor: item.id_captor,
        id_categoria: item.id_categoria,
        id_estado_estacion: item.id_estado_estacion,
      });

      vectorSource.addFeature(feature);
    });

    return vectorSource;
  }
}
