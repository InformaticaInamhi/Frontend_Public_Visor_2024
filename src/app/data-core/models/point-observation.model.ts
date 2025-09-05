export interface PointObservationModel {
  id_estacion: number;
  codigo: string;
  latitud: number;
  longitud: number;
  altitud: number;
  id_captor: number;
  captor: string;
  id_estado_transmision: number;
  estado_transmision: string;
  id_categoria: number;
  categoria: string;
  id_propietario: number;
  propietario: string;
  punto_obs?: string;
  id_provincia: number;
  provincia: string;
  id_canton: number;
  canton: string;
}
