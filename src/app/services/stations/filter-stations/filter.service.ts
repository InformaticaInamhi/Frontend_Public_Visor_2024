import { Injectable } from '@angular/core';
import {
  FormOptionsStations
} from '../../../components/map/config-map-estaciones';
import { Station } from '../../../models/station';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor() {}

  filterStations(stationsData: Station[], opciones: FormOptionsStations) {
    // let id_propietario = opciones.station_network;
    // stationsData = this.filterDataById_owner(id_propietario, stationsData);
    stationsData = this.filterDataById_captor(
      opciones.station_captor,
      stationsData
    );

    stationsData = this.filterDataById_status(
      opciones.station_status,
      stationsData
    );

    stationsData = this.filterDataById_category(
      opciones.station_type,
      stationsData
    );
    return stationsData;
  }

  filterDataById_owner(id_propietario: number, data: Station[]): Station[] {
    return data.filter((station) => station.id_propietario == id_propietario);
  }

  filterDataById_captor(id_captor: number[], data: Station[]): Station[] {
    return data.filter((station) => id_captor.includes(station.id_captor));
  }

  filterDataById_status(id_status: number[], data: Station[]): Station[] {
    return data.filter((station) =>
      id_status.includes(station.id_estado_estacion)
    );
  }

  filterDataById_category(id_category: number[], data: Station[]): Station[] {
    return data.filter((station) => id_category.includes(station.id_categoria));
  }
}
