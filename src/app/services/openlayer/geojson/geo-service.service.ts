import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoServiceService {
  private geojsonUrl = 'assets/geojson/pichincha.geojson';

  constructor(private http: HttpClient) {}

  getGeojsonData(): Observable<any> {
    return this.http.get<any>(this.geojsonUrl);
  }
}
