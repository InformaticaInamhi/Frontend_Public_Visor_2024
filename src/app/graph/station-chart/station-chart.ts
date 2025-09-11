import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ParametroEstacion } from '../../data-core/models/observation-point';
import { PointObservationModel } from '../../data-core/models/point-observation.model';
import { DataCore } from '../../data-core/services/data-core';
import { SpinnerService } from '../../main/services/spinner-service/spinner-service';
import { CsvExportService } from '../services/csv-export-service';
import { PlotlyMultipleGraph } from '../services/plotly-multiple-graph';
import { DateRangeDialogComponent } from './data-range/date-range-dialog.component';
import { PlotlyConvencionalesGraph } from '../services/convencionales/plotly-convencionales-graph';

@Component({
  standalone: true,
  selector: 'app-station-chart',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './station-chart.html',
  styleUrl: './station-chart.scss',
})
export class StationChart {
  @Input() stationInformation!: PointObservationModel;

  @Input() set parametros(value: ParametroEstacion[]) {
    this._parametros = value
      ?.slice()
      .sort((a, b) => a.name_param.localeCompare(b.name_param));
  }
  get parametros(): ParametroEstacion[] {
    return this._parametros;
  }
  private _parametros: ParametroEstacion[] = [];

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  selectedParams: ParametroEstacion[] = [];
  selectedTraceTypesPerParam: { [key: string]: string } = {};
  activeSeriesByNemonico: { [nemonico: string]: boolean } = {};

  showPanel: boolean = false;
  GridVisible: boolean = true;
  traceTypes = [
    { value: 'lines+markers', label: 'Líneas con puntos' },
    { value: 'lines', label: 'Solo líneas' },
    { value: 'markers', label: 'Solo puntos' },
    { value: 'bar', label: 'Barras' },
  ];

  combinedSeries: any[] = [];
  sliderValue: number = 100;
  private combinedSeriesOriginal: any[] = [];
  hasData = false;
  dateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  constructor(
    private dataService: DataCore,
    private spinnerService: SpinnerService,
    private plotlyMultipleService: PlotlyMultipleGraph,
    private csvExportService: CsvExportService,
    private dialog: MatDialog,
    private plotlyConvencionalesService: PlotlyConvencionalesGraph
  ) {}

  onParamsChange(): void {
    this.showPanel = false;
    for (const param of this.selectedParams) {
      // Detectar si algún nemónico del parámetro empieza con '01714'
      const hasPrecipitacion = (param.params || []).some((p) =>
        p.nemonico.startsWith('01714')
      );

      // Asignar tipo de traza por defecto según nemónico
      if (!this.selectedTraceTypesPerParam[param.name_param]) {
        this.selectedTraceTypesPerParam[param.name_param] = hasPrecipitacion
          ? 'bar'
          : 'lines+markers';
      }

      // Activar todas las series por nemónico
      for (const def of param.params || []) {
        this.activeSeriesByNemonico[def.nemonico] = true;
      }
    }
  }

  onTraceTypePerParamChange(): void {
    if (
      !this.combinedSeries.length ||
      !this.chartContainer ||
      !this.stationInformation
    ) {
      return;
    }

    const seriesActivas = this.combinedSeries.filter(
      (s) => this.activeSeriesByNemonico[s.nemonico]
    );

    if (this.stationInformation.id_captor === 1) {
      // Convencionales
      this.plotlyConvencionalesService.renderCombinedChart(
        this.chartContainer.nativeElement,
        this.stationInformation,
        this.selectedParams,
        seriesActivas,
        this.selectedTraceTypesPerParam
      );
    } else {
      // Automáticas
      this.plotlyMultipleService.renderCombinedChart(
        this.chartContainer.nativeElement,
        this.stationInformation,
        this.selectedParams,
        seriesActivas,
        this.selectedTraceTypesPerParam
      );
    }
  }

  isSeriesActive(nemonico: string): boolean {
    return this.activeSeriesByNemonico[nemonico] ?? false;
  }

  getSerieColor(nemonico: string): string {
    const serie = this.combinedSeries?.find((s) => s.nemonico === nemonico);
    return serie?.color || '#cccccc';
  }

  toggleSeries(nemonico: string, active: boolean): void {
    this.activeSeriesByNemonico[nemonico] = active;

    this.redibujarDesdeCombined(); // ✅ no vuelve a hacer POST
  }

  onColorChange(nemonico: string, color: string): void {
    const serie = this.combinedSeries.find((s) => s.nemonico === nemonico);
    if (serie) {
      serie.color = color;
      this.redibujarDesdeCombined();
    }
  }

  private redibujarDesdeCombined(): void {
    const seriesActivas = this.combinedSeries.filter(
      (s) => this.activeSeriesByNemonico[s.nemonico]
    );

    if (this.stationInformation.id_captor === 1) {
      // Convencionales
      this.plotlyConvencionalesService.renderCombinedChart(
        this.chartContainer.nativeElement,
        this.stationInformation,
        this.selectedParams,
        seriesActivas,
        this.selectedTraceTypesPerParam
      );
    } else {
      // Automáticas
      this.plotlyMultipleService.renderCombinedChart(
        this.chartContainer.nativeElement,
        this.stationInformation,
        this.selectedParams,
        seriesActivas,
        this.selectedTraceTypesPerParam
      );
    }
  }

  toggleGridVisible(): void {
    this.GridVisible = !this.GridVisible;

    // Si ya hay series cargadas, redibuja el gráfico
    if (this.combinedSeries.length) {
      this.redibujarDesdeCombined();
    }
  }

  onSliderChange(): void {
    const porcentaje = this.sliderValue;
    if (!this.combinedSeriesOriginal.length) return;

    const seriesFiltradas = this.combinedSeriesOriginal.map((serieOriginal) => {
      const total = serieOriginal.data.length;
      const cantidad = Math.max(1, Math.round((porcentaje / 100) * total));
      const nuevosDatos = serieOriginal.data.slice(-cantidad); // últimos datos

      // Buscar si el color ha sido modificado por el usuario
      const colorPersonalizado =
        this.combinedSeries.find((s) => s.nemonico === serieOriginal.nemonico)
          ?.color || serieOriginal.color;

      return {
        ...serieOriginal,
        data: nuevosDatos,
        color: colorPersonalizado,
      };
    });

    this.combinedSeries = seriesFiltradas;
    this.redibujarDesdeCombined();
  }
  //
  //
  graficarCombinada(): void {
    // limpiar datos antes de nueva gráfica
    this.combinedSeries = [];
    this.hasData = false;

    if (!this.selectedParams.length || !this.stationInformation?.id_estacion) {
      return;
    }

    const nemonicos = this.selectedParams
      .flatMap((param) => param.params?.map((p) => p.nemonico) || [])
      .filter((nem) => this.activeSeriesByNemonico[nem]);

    if (!nemonicos.length) {
      console.warn('No hay nemónicos activos para enviar.');
      return;
    }

    this.spinnerService.show();

    const fechaInicio = this.dateRange.start
      ? new Date(this.dateRange.start).toISOString()
      : undefined;

    const fechaFin = this.dateRange.end
      ? new Date(this.dateRange.end).toISOString()
      : undefined;

    const apiCall =
      this.stationInformation.id_captor === 1
        ? this.dataService.postDataHourConvencional(
            this.stationInformation.id_estacion,
            nemonicos,
            fechaInicio,
            fechaFin
          )
        : this.dataService.postDataHourAutomatica(
            this.stationInformation.id_estacion,
            nemonicos,
            fechaInicio,
            fechaFin
          );

    apiCall
      .then((res) => {
        this.combinedSeries = res;
        this.hasData = this.combinedSeries.length > 0;

        // guardamos copia original para el slider
        this.combinedSeriesOriginal = structuredClone(res);
        this.sliderValue = 100;

        // redibujar según tipo de estación (convencional o automática)
        this.redibujarDesdeCombined();

        this.GridVisible = true;
      })
      .catch((err) => {
        console.error('❌ Error al obtener datos combinados:', err);
        this.GridVisible = false;
      })
      .finally(() => {
        this.spinnerService.hide();
        this.showPanel = true;
      });
  }

  //
  downloadCSV(): void {
    this.csvExportService.exportCSV(
      this.combinedSeries,
      this.selectedParams,
      this.stationInformation.id_estacion
    );
  }

  openDateDialog(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, {
      width: '400px',
      data: { start: this.dateRange.start, end: this.dateRange.end },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dateRange = result;
      }
    });
  }
}
