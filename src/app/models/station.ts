export interface Station {
  id_estacion: number;
  codigo: string;
  estenomb: string;
  catenomb: string;
  latitud: number;
  longitud: number;
  transmission_status_id: string;
  id_captor: number;
  id_project: number;
  id_categoria: number;
  id_estado_estacion: number;

  reginomb: string;
  provincia: string;
  canton: string;
  punto_obs: string;
  categoria: string;
  altutid: string;
  amarillo_sup: number;
  rojo_sup: number;
  amarillo_color: string;
  rojo_color: string;

  id_propietario: number;
  propietario: string;
}
