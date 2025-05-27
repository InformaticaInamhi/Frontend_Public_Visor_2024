import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DataStationInterface,
  ParamGroupedInterface,
} from '../../models/dataStation';
import {
  AgrupadoParametros,
  ParametrosStation,
} from '../../models/parameterStation';
import { Station } from '../../models/station';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private urlBack = environment.urlBack;
  private id_aplicacion = environment.id_aplicacion;
  private ids_owner = environment.ids_owner;

  constructor(private http: HttpClient) {}

  getAllStationsINAMHI(): Observable<Station[]> {
    const id_canton = '1703';
    const url = `${this.urlBack}station_information/getAllStations/?id_canton=${id_canton}`;
    return this.http.get<Station[]>(url);
  }

  getAllStationsbyAplication(): Observable<Station[]> {
    const url =
      this.urlBack +
      'station_information/estaciones-aplicacion/' +
      this.id_aplicacion +
      '/';
    return this.http.get<Station[]>(url);
  }

  getAllStationsbyOwners(): Observable<Station[]> {
    const url = `${this.urlBack}station_information/estaciones-propietario/${this.ids_owner}/`;
    return this.http.get<Station[]>(url);
  }

  getMetadataStation(id_estacion: number): Observable<Station> {
    const url =
      this.urlBack +
      `station_information/getStationbyId_station/${id_estacion}`;
    return this.http.get<Station>(url);
  }

  /**
   * Retrieves hourly data from an automatic station.
   * @param dataForm Object containing: id_estacion, table_names (nemónicos), and optional dates.
   * @returns Observable with structured data per parameter for the selected station.
   */
  getDataStation(dataForm: any): Observable<DataStationInterface[]> {
    // Optional: add user authentication if needed
    // if (this.accessToken != null) {
    //   headers.Authorization = `Token ${this.accessToken}`;
    //   dataForm.user_id = this.auth.getUser().user_id;
    // }

    const dir = this.urlBack + 'station_data_hourly/data_automatica';
    return this.http.post<DataStationInterface[]>(dir, dataForm, httpOptions);
  }

  /**
   * Retrieves hourly data from a conventional station.
   * @param dataForm Object containing: id_estacion, table_names (nemónicos), and optional dates.
   * @returns Observable with structured data for conventional measurements.
   */
  getDataStationConvencional(
    dataForm: any
  ): Observable<DataStationInterface[]> {
    const endpoint = this.urlBack + 'station_data_hourly/data_convencional';
    return this.http.post<DataStationInterface[]>(
      endpoint,
      dataForm,
      httpOptions
    );
  }

  /**
   * Retrieves wind-specific data from an automatic station.
   * @param dataForm Object containing: id_estacion, table_names (nemónicos), and optional dates.
   * @returns Observable with structured wind data (direction, speed, gust).
   */
  getWindDataStation(dataForm: any): Observable<DataStationInterface[]> {
    // Optional: add user authentication if needed
    // if (this.accessToken != null) {
    //   headers.Authorization = `Token ${this.accessToken}`;
    //   dataForm.user_id = this.auth.getUser().user_id;
    // }

    const dir = this.urlBack + 'station_data_hourly/data-wind_automatica';
    return this.http.post<DataStationInterface[]>(dir, dataForm, httpOptions);
  }

  getStationsByProvincia(idProvincia: string): Observable<Station[]> {
    const url = `${this.urlBack}station_information/getStationsByProvincia/?id_provincia=${idProvincia}`;
    return this.http.get<Station[]>(url, httpOptions);
  }

  getParameterStation(id_estacion: number): Observable<AgrupadoParametros[]> {
    const url =
      this.urlBack +
      `station_information/getParametrosByEstacion/${id_estacion}/`;
    return this.http.get<AgrupadoParametros[]>(url);
  }
}
