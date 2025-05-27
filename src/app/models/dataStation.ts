export interface DataEntry {
  id_estacion: number;
  fecha: string;
  valor: number;
}


export interface StationDataGroup {
  u_medida: string;
  name_param: string;
  type_graph: string;
  datos: DataStationInterface[];  // Aquí están tus series: PROM, MAX, MIN, etc.
}


export interface DataStationInterface {
  estadistico: string;
  color: string;
  data: DataEntry[];
  id_parametro: number;
  u_medida: string;
  name_param: string;
  type_graph: string;
}

export interface ParamGroupedInterface {
  name_param: string;
  u_medida: string;
  type_graph: 'bar' | 'scatter';
  datos: DataStationInterface[];
}
