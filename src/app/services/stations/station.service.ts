import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataStationInterface } from '../../models/dataStation';
import { ParametrosStation } from '../../models/parameterStation';
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
  constructor(private http: HttpClient) {}

  getAllStationsINAMHI(): Observable<Station[]> {
    const url = this.urlBack + 'station_information/getAllStations/';
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

  getMetadataStation(id_estacion: number): Observable<Station> {
    const url =
      this.urlBack +
      `station_information/getStationbyId_station/${id_estacion}`;
    return this.http.get<Station>(url);
  }

  getParameterStation(id_estacion: number): Observable<ParametrosStation[]> {
    const url =
      this.urlBack +
      `station_information/estacion-parametros-gen/${id_estacion}/hour/`;
    return this.http.get<ParametrosStation[]>(url);
  }

  /**
   * function that returns the data recorded by the station
   * @param objects catenomb, idStation,start_date, end_date
   * @param catenomb
   * @param idStation
   * @param start_date
   * @param end_date
   * @returns data recorded by the station
   */
  getDataStation(dataForm: any): Observable<DataStationInterface[]> {
    // if (this.accessToken != null) {
    //   headers.Authorization = `Token ${this.accessToken}`;
    //   dataForm.user_id = this.auth.getUser().user_id;
    // }
    const dir = this.urlBack + 'station_data_hourly/data';

    return this.http.post<DataStationInterface[]>(dir, dataForm, httpOptions);
  }

  getWindDataStation(dataForm: any): Observable<DataStationInterface[]> {
    // if (this.accessToken != null) {
    //   headers.Authorization = `Token ${this.accessToken}`;
    //   dataForm.user_id = this.auth.getUser().user_id;
    // }
    const dir = this.urlBack + 'station_data_hourly/data-wind';

    return this.http.post<DataStationInterface[]>(dir, dataForm, httpOptions);
  }
}
