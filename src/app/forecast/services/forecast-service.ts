import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DailyForecast } from '../models/forecast.model';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private readonly API_URL =
    'https://inamhi.gob.ec/api_pronos/forecast/daily_forecast/list_by_date_now/';
  private readonly CACHE_KEY = 'forecast_now_cache';
  private readonly CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 horas

  constructor(private http: HttpClient) {}

  getCurrentForecast(): Observable<DailyForecast[]> {
    const cached = this.getFromCache();
    if (cached) {
      return of(cached);
    }

    return this.http
      .get<DailyForecast[]>(this.API_URL)
      .pipe(tap((data) => this.saveToCache(data)));
  }

  private getFromCache(): DailyForecast[] | null {
    // ✅ Solo usar localStorage si existe (navegador)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.CACHE_KEY);
    if (!raw) return null;

    try {
      const { data, timestamp } = JSON.parse(raw);
      const now = Date.now();
      if (now - timestamp < this.CACHE_DURATION_MS) {
        return data;
      } else {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }
    } catch (e) {
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private saveToCache(data: DailyForecast[]): void {
    // ✅ Solo usar localStorage si existe (navegador)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const payload = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(payload));
  }
}
