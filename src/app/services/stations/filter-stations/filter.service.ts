import { Injectable } from '@angular/core';
import {
  CaptorType,
  FormOptionsStations,
  Station,
  StationCategory,
  StationStatus,
} from '../../../models/station';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor() {}

  /**
   * Aplica filtros a la lista completa de estaciones según las opciones seleccionadas.
   */
  filterStations(
    stationsData: Station[],
    opciones: FormOptionsStations
  ): Station[] {
    let filteredData = [...stationsData];

    // Filtrar por tipo de captor
    filteredData = this.filterByCaptor(opciones.station_captor, filteredData);

    // Filtrar por estado de transmisión real (Transmitiendo, Sin transmisión, Mantenimiento)
    filteredData = this.filterByEstadoTransmision(
      opciones.station_status,
      filteredData
    );

    // Logs de diagnóstico para verificar los filtros aplicados
    const transmitiendo = filteredData.filter(
      (e) => e.estado_transmision_real === StationStatus.TRANSMITIENDO
    );
    const sinTransmision = filteredData.filter(
      (e) =>
        e.estado_transmision_real === StationStatus.SIN_TRANSMISION ||
        e.estado_transmision_real === StationStatus.NO_OPERATIVA
    );
    const mantenimiento = filteredData.filter(
      (e) => e.estado_transmision_real === StationStatus.EN_MANTENIMIENTO
    );
    // Filtrar por categoría de estación
    filteredData = this.filterByCategory(opciones.station_type, filteredData);

    return filteredData;
  }

  /**
   * Filtra por tipo de captor (manual, electromecánico...).
   */
  private filterByCaptor(captors: CaptorType[], data: Station[]): Station[] {
    return data.filter((station) => captors.includes(station.id_captor));
  }

  /**
   * Filtra por estado de transmisión real con lógica extendida.
   */
  private filterByEstadoTransmision(
    estados: StationStatus[],
    data: Station[]
  ): Station[] {
    return data.filter((station) => {
      const estado = station.estado_transmision_real;

      return (
        (estados.includes(StationStatus.TRANSMITIENDO) &&
          estado === StationStatus.TRANSMITIENDO) ||
        (estados.includes(StationStatus.SIN_TRANSMISION) &&
          (estado === StationStatus.SIN_TRANSMISION ||
            estado === StationStatus.NO_OPERATIVA)) ||
        (estados.includes(StationStatus.EN_MANTENIMIENTO) &&
          estado === StationStatus.EN_MANTENIMIENTO)
      );
    });
  }

  /**
   * Filtra por categoría de estación (meteorológica, hidrológica...).
   */
  private filterByCategory(
    categories: StationCategory[],
    data: Station[]
  ): Station[] {
    return data.filter((station) => categories.includes(station.id_categoria));
  }
}
