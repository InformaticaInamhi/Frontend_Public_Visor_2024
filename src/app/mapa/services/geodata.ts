// src/app/mapa/services/geodata.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeodataService {

  constructor(private http: HttpClient) {}

  /**
   * @description Obtiene un archivo geoespacial (GeoJSON, shape convertido a JSON, raster metadata, etc.)
   * @param path Ruta relativa dentro de assets (ej: 'assets/geo/miarchivo.geojson')
   * @returns Observable con el contenido del archivo
   */
  getData(path: string): Observable<any> {
    return this.http.get<any>(path);
  }
}
