export interface ParametroEstacionItem {
  nemonico: string;
  fecha_ultimo_dato: string;
  descripcion_parametro: string;
  unidad: string;
  simbolo_unidad: string;
  estadistico: string;
  simbolo_estadistico: string;
}

export interface ParametroEstacion {
  id_param: number;
  id_estacion: number;
  name_param: string;
  simbolo_unidad: string;
  params: ParametroEstacionItem[];
}
