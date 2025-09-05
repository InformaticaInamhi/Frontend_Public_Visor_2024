export interface SpecialIcon {
  name: string;
  description: string;
  icon_url: string;
}

export interface ForecastPeriod {
  period_name: 'Madrugada' | 'Mañana' | 'Tarde' | 'Noche';
  special_icon: SpecialIcon | null;
  condition_name: string;
  condition_description: string;
  condition_icon_url: string;
  status: boolean;
  period_start: string; // ISO datetime
  period_end: string; // ISO datetime
}

export interface DailyForecast {
  fk_locality_id: number;
  fk_province_name: string;
  fk_province_id: number;
  min_temperature: string;
  max_temperature: string;
  uv_radiation: number;
  rain: boolean;
  date: string; // ISO date
  is_main: boolean;
  status: boolean;
  is_finish: boolean;
  locality_name: string;
  latitude: number;
  longitude: number;
  is_national: boolean;
  forecast: ForecastPeriod[];
}
