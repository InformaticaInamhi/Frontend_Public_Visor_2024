import { environment } from '../../../environments/environment';
const url_map_box = 'https://api.mapbox.com/styles/v1/kchangoluisa';
const token_map_box = `access_token=${environment.mapboxAccessToken}`;
export const config_OL = {
  center: [-80, -1.6],
  zoom: 5,
  maxZoom: 20,
  minZoom: 0,
  baseLayers: {
    Default: {
      type: 'OSM',
    },
    Outdoors: {
      type: 'XYZ',
      url: `${url_map_box}/cl5zl1w6t002h16qkzwagh7as/tiles/256/{z}/{x}/{y}?${token_map_box}`,
    },
    Grayscale: {
      type: 'XYZ',
      url: `${url_map_box}/cl63rs6vw000d14ldww1hef6y/tiles/256/{z}/{x}/{y}?${token_map_box}`,
    },
    Dark: {
      type: 'XYZ',
      url: `${url_map_box}/cl63rnxd0003615nw3d2lpeqm/tiles/256/{z}/{x}/{y}?${token_map_box}`,
    },
    Satellite: {
      type: 'XYZ',
      url: `${url_map_box}/cl63umr27000x14ohr5s3xpku/tiles/256/{z}/{x}/{y}?${token_map_box}`,
    },
  } as BaseLayerConfig,
};

export const markerStyles = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
  position: 'relative',
  cursor: 'pointer',
  'font-size': '11px',
};

export const markerText = {
  position: 'absolute',
  width: '100%',
  textAlign: 'center',
  bottom: '-20px',
  left: '-10px',
  color: 'black',
  display: 'none',
};

export interface BaseLayerConfig {
  [key: string]: {
    type: string;
    url?: string;
  };
}
