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
   * @param fecha_desde Fecha inicial en ISO (opcional)
   * @param fecha_hasta Fecha final en ISO (opcional)
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
    };

    // ✅ incluir solo si están definidos
    if (fecha_desde) {
      body.fecha_desde = fecha_desde;
    }
    if (fecha_hasta) {
      body.fecha_hasta = fecha_hasta;
    }

    const url = `${this.baseUrl}/station_data_hour/get_data_hour/`;
    return firstValueFrom(this.http.post<any>(url, body));
  }
}
