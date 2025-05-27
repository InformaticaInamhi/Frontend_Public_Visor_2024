// import { DataStation } from '../../models/dataStation';

export const weatherParameters: weatherOpt[] = [
  {
    id: 1,
    name: 'Precipitación acumulada<br>Horaria-Diaria',
    u_medida: 'mm',
    type_plot: 'bar',
    name_param: 'PRECIPITACION',
  },
  {
    id: 2,
    name: 'Temperatura Aire',
    u_medida: '°C',
    type_plot: 'scatter',
    name_param: 'TEMPERATURA AIRE',
  },
  {
    id: 3,
    name: 'Presión Atmosférica',
    u_medida: 'hPa',
    type_plot: 'scatter',
    name_param: 'PRESION ATMOSFERICA',
  },
  {
    id: 4,
    name: 'Humedad relativa',
    u_medida: '%',
    type_plot: 'scatter',
    name_param: 'HUMEDAD RELATIVA DEL AIRE',
  },

  {
    id: 5,
    name: 'Viento dirección °<br>Viento velocidad m/s',
    u_medida: '',
    type_plot: 'scatter',
    name_param: 'VIENTO DIRECCION - VIENTO VELOCIDAD',
  },
  {
    id: 6,
    name: 'Aluminio',
    u_medida: '',
    type_plot: 'scatter',
    name_param: 'ALUMINIO',
  },

  {
    id: 7,
    name: 'Radiación solar global',
    u_medida: 'W/m²',
    type_plot: 'scatter',
    name_param: 'RADIACION SOLAR GLOBAL',
  },

  {
    id: 8,
    name: 'Radiación solar reflejada',
    u_medida: 'W/m²',
    type_plot: 'scatter',
    name_param: 'RADIACION SOLAR REFLEJADA',
  },

  {
    id: 9,
    name: 'Ciano bacterias',
    u_medida: 'm cell/ml',
    type_plot: 'scatter',
    name_param: 'CIANOBACTERIAS',
  },

  {
    id: 10,
    name: 'Clorofila',
    u_medida: 'ug/l',
    type_plot: 'scatter',
    name_param: 'CLOROFILA',
  },

  {
    id: 11,
    name: 'Conductividad del agua',
    u_medida: 'ms/cm',
    type_plot: 'scatter',
    name_param: 'CONDUCTIVIDAD DEL AGUA',
  },

  {
    id: 12,
    name: 'Ficocianina',
    u_medida: 'ppb',
    type_plot: 'scatter',
    name_param: 'FICOCIANINA',
  },

  {
    id: 13,
    name: 'Fósforo',
    u_medida: 'mg/L',
    type_plot: 'scatter',
    name_param: 'FOSFORO',
  },

  {
    id: 14,
    name: 'Nitrógeno',
    u_medida: 'mg/L',
    type_plot: 'scatter',
    name_param: 'NITROGENO',
  },

  {
    id: 15,
    name: 'Oxígeno disuelto',
    u_medida: 'mg/L',
    type_plot: 'scatter',
    name_param: 'OXIGENO DISUELTO',
  },

  {
    id: 16,
    name: 'PH Agua',
    u_medida: 'pH',
    type_plot: 'scatter',
    name_param: 'PH DEL AGUA',
  },

  {
    id: 17,
    name: 'Potencial de óxido reducción',
    u_medida: 'mV',
    type_plot: 'scatter',
    name_param: 'POTENCIAL DE OXIDO REDUCCION',
  },

  {
    id: 18,
    name: 'Temperatura del agua',
    u_medida: '°C',
    type_plot: 'scatter',
    name_param: 'TEMPERATURA DEL AGUA',
  },

  {
    id: 19,
    name: 'Turbiedad del agua',
    u_medida: 'NTU',
    type_plot: 'scatter',
    name_param: 'TURBIEDAD DEL AGUA',
  },

  {
    id: 20,
    name: 'Color PT CO',
    u_medida: 'mg/L',
    type_plot: 'scatter',
    name_param: 'COLOR PT CO',
  },

  {
    id: 21,
    name: 'Color Real',
    u_medida: 'mg/L',
    type_plot: 'scatter',
    name_param: 'COLOR REAL',
  },

  {
    id: 22,
    name: 'Hidrocarburos',
    u_medida: 'ppm  ',
    type_plot: 'scatter',
    name_param: 'HIDROCARBUROS',
  },

  {
    id: 23,
    name: 'Velocidad del Agua',
    u_medida: 'm/s',
    type_plot: 'scatter',
    name_param: 'VELOCIDAD DEL AGUA',
  },

  {
    id: 24,
    name: 'Radiación UVE',
    u_medida: 'W/m²',
    type_plot: 'scatter',
    name_param: 'RADIACION UVE',
  },

  {
    id: 25,
    name: 'Radiación UVA',
    u_medida: 'W/m²',
    type_plot: 'scatter',
    name_param: 'RADIACION UVA',
  },

  {
    id: 26,
    name: 'Temperatura del sensor UV',
    u_medida: '°C',
    type_plot: 'scatter',
    name_param: 'TEMPERATURA DEL SENSOR UV',
  },

  {
    id: 27,
    name: 'Recorrido del viento',
    u_medida: 'm',
    type_plot: 'scatter',
    name_param: 'RECORRIDO DEL VIENTO',
  },

  //NUEVOS PARAMETROS

  {
    id: 28,
    name: 'Temperatura del suelo a -10cm (cesped)',
    u_medida: '°C',
    type_plot: 'scatter',
    name_param: 'TEMPERATURA DEL SUELO A -10CM (CESPED) MIN',
  },

  {
    id: 29,
    name: 'Temperatura del suelo a -20cm (cesped)',
    u_medida: '°C',
    type_plot: 'scatter',
    name_param: 'TEMPERATURA DEL SUELO A -20CM (CESPED) PROM',
  },

  //antiguos

  {
    id: 90,
    name: 'Nivel del agua',
    u_medida: 'm',
    type_plot: null,
    name_param: 'NIVEL DEL AGUA',
  },

  {
    id: 91,
    name: 'Caudal',
    u_medida: 'm3/s',
    type_plot: null,
    name_param: 'CAUDAL',
  },

  {
    id: 92,
    name: 'Temperatura del agua',
    u_medida: '°C',
    type_plot: null,
    name_param: 'TEMPERATURA DEL AGUA',
  },
];
export interface weatherOpt {
  id: number;
  name: string;
  u_medida: string;
  type_plot: string | null;
  name_param: string;
}

export interface InterfaceDataExport {
  name: string;
  color: string;
  data: [];
}

export interface DataParameter {
  parametro: string;
  nemonicos: string[];
}
/*

VIENTO DIRECCION
VIENTO VELOCIDAD
*/
