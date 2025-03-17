import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeojsonService {
  url_geo_json = 'https://inamhi.gob.ec/contentx/api_geodata/geojson_file';
  constructor(private http: HttpClient) {}

  /**
   *
   * @param nameGeo
   * @returns file geoJson
   * Embed the file name in the url
   * Access and return the GeoJson file
   */
  getStateGeoJson(path: string) {
    const url = `${this.url_geo_json}/${path}/`;
    // Definir las cabeceras (si se necesitan)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(url, { headers: headers });
  }

  /**
   *
   * @param nameGeo
   * @returns nameGeo without accents
   * example Galápagos => Galapagos
   */
  removeAccents = (nameGeo: string) => {
    return nameGeo.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

}
