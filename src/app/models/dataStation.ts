interface DataEntry {
  id_estacion: number;
  fecha: string;
  valor: number;
}

export interface DataStationInterface {
  name: string;
  color: string;
  data: DataEntry[];
}

export interface WeatherParamInterface {
  id: number;
  name: string;
  u_medida: string;
  type_plot: string;
  mode_plot: string | null;
  data_response: DataStationInterface[];
  name_param: string;
}
