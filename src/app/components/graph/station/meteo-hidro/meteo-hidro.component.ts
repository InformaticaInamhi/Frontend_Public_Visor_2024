import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DataStationInterface } from '../../../../models/dataStation';
import { NotificationsService } from '../../../../services/notifications/notifications.service';
import { GeneralService } from '../../../../services/plotly-js/graph/general.service';
import { WindGraphService } from '../../../../services/plotly-js/graph/wind-graph.service';
import { SpinnerService } from '../../../../services/spinner/spinner.service';
import { StationService } from '../../../../services/stations/station.service';
import { DataFilterButtonsComponent } from '../data-filter-buttons/data-filter-buttons.component';
import { ParameterSelectorComponent } from '../parameter-selector/parameter-selector.component';
@Component({
  selector: 'app-meteo-hidro',
  standalone: true,
  imports: [
    ParameterSelectorComponent,
    MatCardModule,
    DataFilterButtonsComponent,
  ],
  templateUrl: './meteo-hidro.component.html',
  styleUrl: './meteo-hidro.component.css',
})
export class MeteoHidroComponent implements OnInit {
  @Input() infoStation!: any;
  parameters: any[] = [];
  selectedParameter!: any;
  allData: any[] = []; // Almacena los datos originales
  dataFiltrada: any[] = []; // Datos filtrados

  showButtons: boolean = false;

  constructor(
    private stationService: StationService,
    private spinnerService: SpinnerService,
    private generalGraph: GeneralService,
    private notificationService: NotificationsService,
    // private precipitationGraph: PrecipitationGraphService,
    private windGraph: WindGraphService
  ) {}

  ngOnInit(): void {
    this.getParameterStation(this.infoStation.id_estacion);
  }

  getParameterStation(id_estacion: number) {
    this.spinnerService.show(true);
    this.stationService.getParameterStation(id_estacion).subscribe({
      next: (res: any[]) => {
        setTimeout(() => {
          this.parameters = res;
        });
      },
      error: (err) => console.error('Error al obtener parámetros:', err),
      complete: () => this.spinnerService.show(false),
    });
  }

  onParameterSelected(param: any) {
    this.showButtons = false;

    if (!param) return;

    this.selectedParameter = param;

    // Extraer los nemónicos de los ítems seleccionados
    const tableNames = param.detalles.map((detalle: any) => detalle.nemonico);

    // Preparar datos para enviar al backend
    const requestData = {
      id_estacion: this.infoStation.id_estacion,
      table_names: tableNames,
    };

    this.spinnerService.show(true);

    const tipoEstacion = this.infoStation.id_captor;

    // Estación automática
    if (tipoEstacion === 2) {
      // Si el parámetro es viento (4 o 7), redirigir a función especializada
      if (
        this.selectedParameter.id_parametro === 4 ||
        this.selectedParameter.id_parametro === 7
      ) {
        this.getDataWind({
          estacion: this.infoStation,
          table_names: tableNames,
        });
        return;
      }

      this.obtenerDatosEstacionAutomatica(requestData);

      // Estación convencional
    } else if (tipoEstacion === 1) {
      this.obtenerDatosEstacionConvencional(requestData);

      // Tipo de estación no reconocido
    } else {
      this.spinnerService.show(false);
      this.notificationService.openSnackBar(
        'Tipo de estación desconocido.',
        'X',
        'custom-styleRed'
      );
    }
  }

  /**
   * Obtiene y procesa datos de una estación automática.
   * @param requestData Contiene id_estacion y lista de nemónicos (table_names)
   */
  private obtenerDatosEstacionAutomatica(requestData: {
    id_estacion: number;
    table_names: string[];
  }) {
    this.stationService.getDataStation(requestData).subscribe({
      next: (stationData: any[]) => {
        this.spinnerService.show(false);

        const dataGroup = stationData[0];

        const hayDatos = dataGroup?.datos?.some(
          (serie: any) => Array.isArray(serie.data) && serie.data.length > 0
        );

        if (!hayDatos) {
          this.notificationService.openSnackBar(
            `No existe información de ${this.selectedParameter.name_param} disponible para la estación: ${this.infoStation.codigo}`,
            'X',
            'custom-styleYellow'
          );
          return;
        }

        this.allData = this.convertirFechasAFechaLocal(
          dataGroup.datos,
          this.infoStation.provincia
        );

        this.showButtons = true;
        this.dataFiltrada = [...this.allData];
        this.actualizarGrafico(this.dataFiltrada);
      },
      error: () => {
        this.spinnerService.show(false);
        this.notificationService.openSnackBar(
          'Error al obtener datos de la estación automática.',
          'X',
          'custom-styleRed'
        );
      },
    });
  }

  /**
   * Obtiene y procesa datos de una estación convencional.
   * @param requestData Contiene id_estacion y lista de nemónicos (table_names)
   */
  private obtenerDatosEstacionConvencional(requestData: {
    id_estacion: number;
    table_names: string[];
  }) {
    this.stationService.getDataStationConvencional(requestData).subscribe({
      next: (stationData: any[]) => {
        this.spinnerService.show(false);

        const dataGroup = stationData[0];

        const hayDatos = dataGroup?.datos?.some(
          (serie: any) => Array.isArray(serie.data) && serie.data.length > 0
        );

        if (!hayDatos) {
          this.notificationService.openSnackBar(
            `No existe información de ${this.selectedParameter.name_param} disponible para la estación: ${this.infoStation.codigo}`,
            'X',
            'custom-styleYellow'
          );
          return;
        }

        this.allData = this.convertirFechasAFechaLocal(
          dataGroup.datos,
          this.infoStation.provincia
        );

        this.showButtons = true;
        this.dataFiltrada = [...this.allData];
        this.actualizarGrafico(this.dataFiltrada);
      },
      error: () => {
        this.spinnerService.show(false);
        this.notificationService.openSnackBar(
          'Error al obtener datos de la estación convencional.',
          'X',
          'custom-styleRed'
        );
      },
    });
  }

  /**
   * Obtiene los datos de viento con otro servicio especializado.
   * @param requestData Datos necesarios para la consulta.
   */
  getDataWind(requestData: any) {
    this.stationService.getWindDataStation(requestData).subscribe({
      next: (stationData: DataStationInterface[]) => {
        this.spinnerService.show(false);
        // Verificar si hay datos disponibles
        const hayDatos = stationData.some((series) => series.data.length > 0);
        if (!hayDatos) {
          this.notificationService.openSnackBar(
            `No existen datos de viento disponibles para la estación: ${this.infoStation.codigo}`,
            'X',
            'custom-styleYellow'
          );
          return;
        }

        // Convertimos fechas a la zona horaria local
        this.allData = this.convertirFechasAFechaLocal(
          stationData,
          this.infoStation.provincia
        );
        this.showButtons = true;
        //  Si es PRECIPITACIÓN (id_parametro = 17), aplicar filtro de 10 días por defecto

        this.allData = this.filtrarPrecipitacionPorDias(20);

        this.dataFiltrada = [...this.allData]; // Inicializa con los datos filtrados
        this.actualizarGrafico(this.dataFiltrada);
      },
      error: (err) => {
        this.spinnerService.show(false);
      },
    });
  }

  onDataFiltered(filteredData: DataStationInterface[]) {
    this.dataFiltrada = filteredData;
    this.actualizarGrafico(this.dataFiltrada); // Actualizar gráfico con los datos filtrados
  }

  actualizarGrafico(data: DataStationInterface[]) {
    const idParametro = this.selectedParameter.id_parametro;
    // 🔹 Verificar si el id_parametro es 17 o 4

    // if (idParametro === 17) {
    //   this.precipitationGraph.createGraph(
    //     data,
    //     'dataStationGeneral',
    //     this.infoStation,
    //     this.selectedParameter
    //   );
    //   return;
    // }
    if (this.selectedParameter.id_parametro === 4) {
      this.windGraph.createGraph(
        data,
        'dataStationGeneral',
        this.infoStation,
        this.selectedParameter
      );
      return;
    }

    //Si hay datos disponibles, graficar normalmente
    this.generalGraph.createGraph(
      data,
      'dataStationGeneral',
      this.infoStation,
      this.selectedParameter
    );
  }

  /**
   * Convierte las fechas UTC a la hora local de Ecuador o Galápagos.
   */

  private convertirFechasAFechaLocal(
    dataStation: DataStationInterface[],
    provincia: string
  ): DataStationInterface[] {
    // Definir la cantidad de horas a restar según la provincia
    let horasARestar = 5; // Ecuador continental (UTC-5)
    if (provincia.toUpperCase() === 'GALAPAGOS') {
      horasARestar = 4; // Galápagos (UTC-4)
    }

    return dataStation.map((obj) => ({
      ...obj,
      data: obj.data.map((item: any) => {
        let fechaTransformada = item.fecha;

        if (typeof fechaTransformada === 'string') {
          try {
            // Convertimos la fecha en un objeto Date
            const fechaOriginal = new Date(fechaTransformada);

            // Restamos las horas necesarias
            fechaOriginal.setHours(fechaOriginal.getHours() - horasARestar);

            // Convertimos de nuevo a formato ISO
            const fechaISO = fechaOriginal.toISOString();

            return {
              ...item,
              fecha: fechaISO, // Se pasa en formato ISO para compatibilidad con Plotly
            };
          } catch (error) {
            return { ...item, fecha: null };
          }
        }

        return item;
      }),
    }));
  }

  /**
   * 🔹 Filtra la precipitación por los últimos `dias` días DISPONIBLES en los datos.
   * @param dias Número de días a filtrar.
   * @returns Datos filtrados con precipitación de los últimos `dias` días registrados.
   */
  private filtrarPrecipitacionPorDias(dias: number): DataStationInterface[] {
    if (!this.allData.length) {
      return [];
    }

    // 🔹 Obtener todas las fechas disponibles y ordenarlas en orden descendente
    const todasLasFechas = this.allData
      .flatMap((serie) => serie.data.map((d: any) => new Date(d.fecha)))
      .filter((fecha) => !isNaN(fecha.getTime()))
      .sort((a, b) => b.getTime() - a.getTime()); // 🔹 Orden descendente (más reciente primero)

    // 🔹 Si no hay fechas, retornamos vacío
    if (!todasLasFechas.length) {
      return [];
    }

    // 🔹 Seleccionar la fecha más reciente disponible
    const fechaFin = todasLasFechas[0];

    // 🔹 Obtener la fecha de inicio a partir de `dias` registros atrás
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setDate(fechaFin.getDate() - dias);
    fechaInicio.setHours(7, 0, 0, 0); // 🔹 Inicia a las 08:00 AM Ecuador

    return this.allData.map((serie) => ({
      ...serie,
      data: serie.data.filter(
        (d: any) =>
          d.fecha &&
          new Date(d.fecha) >= fechaInicio &&
          new Date(d.fecha) <= fechaFin
      ),
    }));
  }
}
