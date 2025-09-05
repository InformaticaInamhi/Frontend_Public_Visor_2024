import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DailyForecast } from '../../models/forecast.model';
import { ForecastService } from '../../services/forecast-service';

@Component({
  selector: 'app-forecast-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './forecast-panel.html',
  styleUrl: './forecast-panel.scss',
  animations: [
    // Desvanecimiento + desplazamiento hacia arriba (1s) en CADA cambio
    trigger('fadeUp', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class ForecastPanel implements OnInit, OnDestroy {
  forecastData: DailyForecast[] = [];
  currentForecast: DailyForecast | null = null;
  currentIndex = 0;

  // autoplay fijo cada 1 s
  private autoAdvanceTimer: any;

  constructor(
    private forecastService: ForecastService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.forecastService.getCurrentForecast().subscribe({
      next: (data) => {
        this.forecastData = data || [];
        if (this.forecastData.length > 0) {
          this.currentIndex = 0;
          this.setForecast(this.currentIndex);
          this.startAutoAdvance(); // ← automático 1s
        }
      },
      error: (err) => {
        if (err.status !== 0) console.error('❌ Error pronóstico:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.clearAutoAdvance();
  }

  // Animación se dispara al enlazar [@fadeUp]="currentIndex"
  // No necesitamos más estado.
  private startAutoAdvance(): void {
    this.clearAutoAdvance();

    // ejecuta el timer FUERA de Angular para rendimiento
    this.zone.runOutsideAngular(() => {
      this.autoAdvanceTimer = setInterval(() => {
        // y vuelve a Angular SOLO para actualizar estado/vista
        this.zone.run(() => {
          this.nextForecast(); // cambia índice
          this.cdr.markForCheck(); // fuerza CD en OnPush
        });
      }, 2000);
    });
  }

  private clearAutoAdvance(): void {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  // Navegación
  nextForecast(): void {
    if (!this.forecastData.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.forecastData.length;
    this.setForecast(this.currentIndex);
  }

  previousForecast(): void {
    if (!this.forecastData.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.forecastData.length) %
      this.forecastData.length;
    this.setForecast(this.currentIndex);
  }

  private setForecast(index: number): void {
    this.currentForecast = this.forecastData[index] || null;
    this.cdr.markForCheck(); // asegura que la vista se refresque inmediatamente
  }

  // Tooltip UV
  get uvTooltip(): string {
    const uv = Number(this.currentForecast?.uv_radiation);
    if (uv <= 2) return 'Índice UV Bajo (1-2): Riesgo mínimo.';
    if (uv <= 5) return 'Índice UV Moderado (3-5): Usa protección básica.';
    if (uv <= 7) return 'Índice UV Alto (6-7): Usa protección extra.';
    return 'Índice UV Muy Alto (8-10): Altamente peligroso.';
  }

  // Clase UV
  getUvClass(): string {
    const uv = Number(this.currentForecast?.uv_radiation);
    if (uv <= 2) return 'uv-low';
    if (uv <= 5) return 'uv-moderate';
    if (uv <= 7) return 'uv-high';
    return 'uv-very-high';
  }

  // Botón a visor pronósticos
  openForecastLink(): void {
    window.open('https://inamhi.gob.ec/pronos/visor-pronosticos', '_blank');
  }

  // Pausar autoplay
  pauseAutoAdvance(): void {
    this.clearAutoAdvance();
  }

  // Reanudar autoplay
  resumeAutoAdvance(): void {
    this.startAutoAdvance();
  }
}
