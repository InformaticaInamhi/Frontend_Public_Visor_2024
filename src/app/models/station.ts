export interface Station {
  id_punto_obs: number;
  codigo: string;
  punto_obs: string;
  id_propietario: number;
  propietario: string;
  id_estacion: number;
  id_captor: number;
  captor: string;
  id_tipo_estacion: number;
  tipo_estacion: string;
  id_categoria: number;
  categoria: string;
  uso_horario: string;
  latitud: number;
  longitud: number;
  altitud: number;
  id_sistema_coordenadas: number;
  sistema_coordenadas: string;
  id_parroquia: string;
  parroquia: string;
  id_canton: string;
  canton: string;
  id_provincia: string;
  provincia: string;
  id_region: string;
  region: string;
  id_zona: string;
  zona: string;
  desc_zona: string;
  id_cuenca: string;
  cuenca: string;
  id_estado_estacion: number;
  estado_estacion: string;
  id_frecuencia_transmision: number;
  frecuencia_transmision: string;
  estado_transmision_real: number;
  descripcion_estado_transmision_real: string;
}

// Tipo de captor (forma de medición)
export enum CaptorType {
  NO_DEFINIDO = 0,
  MANUAL = 1, // Estación convencional
  ELECTROMECANICO = 2, // Estación automática
}

// Estado de la estación (transmisión)
export enum StationStatus {
  TRANSMITIENDO = 1,
  SIN_TRANSMISION = 2,
  EN_MANTENIMIENTO = 3,
  NO_OPERATIVA = 4,
}

// Categoría de estación
export enum StationCategory {
  NO_DEFINIDO = 0,
  METEOROLOGICA = 1,
  HIDROLOGICA = 2,
  HIDROMETEOROLOGICA = 3,
}

/**
 * Representa las opciones de filtrado seleccionadas por el usuario para las estaciones.
 */
export interface FormOptionsStations {
  /**
   * ID de la red de estaciones seleccionada.
   * 0 puede representar "todas las redes".
   */
  station_network: number;

  /**
   * Tipos de captor seleccionados (manual, electromecánico, etc.).
   */
  station_captor: CaptorType[];

  /**
   * Estados operativos seleccionados (operativa, mantenimiento, etc.).
   */
  station_status: StationStatus[];

  /**
   * Categorías de estación seleccionadas (meteorológica, hidrológica, etc.).
   */
  station_type: StationCategory[];

  /**
   * Agrupar visualmente los marcadores (ej: por tipo de estación).
   */
  isCheckedGroup: boolean;
}
