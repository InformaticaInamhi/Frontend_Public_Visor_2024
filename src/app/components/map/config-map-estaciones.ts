export const opt_layers_radio = [
  { id: 1, name: 'Default', value: 'Default' },
  { id: 2, name: 'Outdoors', value: 'Outdoors' },
  { id: 3, name: 'Grayscale', value: 'Grayscale' },
  { id: 4, name: 'Dark', value: 'Dark' },
  { id: 5, name: 'Satellite', value: 'Satellite' },
];

export type ol_radioConfig = {
  [key: string]: { id: number; name: string; value: string };
};

export const valuesFormConfigMap: FormOptionsStations = {
  station_network: 0,
  station_captor: [2],
  station_status: [1],
  station_type: [1, 2, 3],
  isCheckedGroup: true,
};
export interface FormOptionsStations {
  station_network: number;
  station_captor: number[];
  station_status: number[];
  station_type: number[];
  isCheckedGroup: boolean;
}

export const itemsLegendStations = [
  { description: 'Meteorológica', color: '', value: 'M' },
  { description: 'Hidrológica', color: '', value: 'H' },
  { description: 'Reservorio', color: '', value: 'R' },
  { description: 'Hidro-Meteorológica', color: '', value: 'HM' },
  { description: 'Transmitiendo', color: '#229954', value: '' }, //grenn
  { description: 'Sin Transmisión', color: '#fd7667', value: '' }, //red
  { description: 'Mantenimiento', color: '#FFC300 ', value: '' }, //yellow
];

export const logosInamhi = [
  {
    name: 'inamhi_logo_letra_azul',
    path: './assets/logos/inamhi-logo-LETRA-AZUL.png',
  },
  {
    name: 'inamhi_logo_letra_blanca',
    path: './assets/logos/inamhi-logo-LETRA-BLANCA.png',
  },
];
