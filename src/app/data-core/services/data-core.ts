import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataCore {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envía solicitud POST para obtener series horarias de una estación.
   * @param id_estacion ID único de la estación
   * @param table_names Lista de nemónicos (nombres de tabla)
   * @param fecha_desde Fecha inicial (opcional, aún no usada)
   * @param fecha_hasta Fecha final (opcional, aún no usada)
   */
  async postDataHour(
    id_estacion: number,
    table_names: string[],
    fecha_desde?: string,
    fecha_hasta?: string
  ): Promise<any> {
    const body: any = {
      id_estacion,
      table_names,
      // fecha_desde y fecha_hasta definidos pero no se envían por ahora
    };

    const url = `${this.baseUrl}/station_data_hour/get_data_hour/`;
    return firstValueFrom(this.http.post<any>(url, body));
  }
}
