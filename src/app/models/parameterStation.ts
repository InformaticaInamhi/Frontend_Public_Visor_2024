export interface ParametrosStation {
  id_parametro: number;
  parametro: string;
  id_unidad_medida: number;
  unidad_medida: string;
  unidad_medida_tiempo: string;
  id_estadistico: string;
  estadistico: string;
  nemonico_2: string;
}

export interface Agrupado {
  parametro: string;
  detalles: {
    nemonico: string;
    unidad_medida: string;
    unidad_medida_tiempo: string;
    estadistico: string;
  }[];
}
export interface AgrupadoParametros {
  parametro: string;
  detalles: {
    nemonico: string;
    unidad_medida: string;
    unidad_medida_tiempo: string;
    estadistico: string;
  }[];
}
