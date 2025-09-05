import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PointObservationModel } from '../models/point-observation.model';
import { ParametroEstacion } from '../models/observation-point';

@Injectable({
  providedIn: 'root',
})
export class PointObservationService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getPointObservations(filters: {
    [key: string]: string | string[];
  }): Observable<PointObservationModel[]> {
    const params = new URLSearchParams();

    for (const key in filters) {
      const value = filters[key];
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }

    const url = `${
      this.baseUrl
    }/station_information/estaciones/visores/?${params.toString()}`;
    return this.http.get<PointObservationModel[]>(url);
  }

  getParameterStation(id_estacion: number): Observable<ParametroEstacion[]> {
    const params = new URLSearchParams();
    params.set('id_estacion', id_estacion.toString());
    params.set('id_aplicacion', environment.id_aplicacion_horario.toString());
    const url = `${
      this.baseUrl
    }/station_information/estaciones/parametros/?${params.toString()}`;
    return this.http.get<ParametroEstacion[]>(url);
  }
}
