import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DataStationInterface } from '../../../../models/dataStation';

@Component({
  selector: 'app-data-filter-buttons',
  standalone: true,
  templateUrl: './data-filter-buttons.component.html',
  styleUrl: './data-filter-buttons.component.css',
  imports: [MatButtonModule],
})
export class DataFilterButtonsComponent {
  @Input() allData: DataStationInterface[] = []; // Recibe toda la data desde el padre
  @Input() idParametro!: number; // Recibe el ID del parámetro seleccionado
  @Output() filteredData = new EventEmitter<DataStationInterface[]>(); // Devuelve la data filtrada

  botonesHabilitados = {
    '24h': false,
    '48h': false,
    '72h': false,
    '1d': false,
    '2d': false,
    '7d': false,
    '10d': false,
    all: true, // Siempre disponible
  };

  ngOnChanges() {
    this.evaluarDisponibilidadBotones();
  }

  /**
   * 🔹 Evalúa si hay datos recientes disponibles para habilitar los botones.
   */
  private evaluarDisponibilidadBotones() {
    if (!this.allData.length) {
      this.botonesHabilitados = {
        '24h': false,
        '48h': false,
        '72h': false,
        '1d': false,
        '2d': false,
        '7d': false,
        '10d': false,
        all: false,
      };
      return;
    }

    // 🔹 Obtener la fecha más reciente de los datos disponibles
    const fechasDisponibles = this.allData
      .flatMap((serie) => serie.data.map((d: any) => new Date(d.fecha)))
      .filter((fecha) => !isNaN(fecha.getTime()))
      .sort((a, b) => b.getTime() - a.getTime()); // Orden descendente

    if (!fechasDisponibles.length) {
      return;
    }

    const fechaMasReciente = fechasDisponibles[0];
    const ahora = new Date();

    if (this.idParametro !== 17) {
      // 🔹 Para parámetros horarios (NO precipitación)
      this.botonesHabilitados['24h'] =
        fechaMasReciente >= new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
      this.botonesHabilitados['48h'] =
        fechaMasReciente >= new Date(ahora.getTime() - 48 * 60 * 60 * 1000);
      this.botonesHabilitados['72h'] =
        fechaMasReciente >= new Date(ahora.getTime() - 72 * 60 * 60 * 1000);
    } else {
      // 🔹 Para precipitación (id_parametro = 17), verificar datos en los últimos días **según la lógica previa**
      this.botonesHabilitados['1d'] = this.hayDatosPrecipitacionEnRango(1);
      this.botonesHabilitados['2d'] = this.hayDatosPrecipitacionEnRango(2);
      this.botonesHabilitados['7d'] = this.hayDatosPrecipitacionEnRango(7);
      this.botonesHabilitados['10d'] = this.hayDatosPrecipitacionEnRango(10);

      // 🔹 Si no hay datos en los últimos 10 días, solo mostrar "Todo"
      if (
        !this.botonesHabilitados['1d'] &&
        !this.botonesHabilitados['2d'] &&
        !this.botonesHabilitados['7d'] &&
        !this.botonesHabilitados['10d']
      ) {
        this.botonesHabilitados['all'] = true;
      }
    }
  }

  /**
   * 🔹 Verifica si hay datos de precipitación en el rango de días correcto.
   */
  private hayDatosPrecipitacionEnRango(dias: number): boolean {
    const fechaFin = new Date(); // Ahora
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - dias);
    fechaInicio.setHours(8, 0, 0, 0); // 🔹 Inicia a las 08:00 AM Ecuador

    return this.allData.some((serie) =>
      serie.data.some((d: any) => {
        const fechaDato = new Date(d.fecha);
        return fechaDato >= fechaInicio && fechaDato <= fechaFin;
      })
    );
  }

  /**
   * 🔹 Aplica el filtro de datos según el parámetro seleccionado.
   * @param rango Tiempo de filtrado en horas o días (según id_parametro).
   */
  applyFilter(rango: number) {
    if (!this.allData.length) {
      console.warn('No hay datos para filtrar.');
      return;
    }

    if (rango === 0) {
      this.filteredData.emit([...this.allData]);
      return;
    }

    const ahora = new Date();

    if (this.idParametro !== 17) {
      // 🔹 Filtrar por HORAS
      const limite = new Date(ahora.getTime() - rango * 60 * 60 * 1000);
      const datosFiltrados = this.allData.map((serie) => ({
        ...serie,
        data: serie.data.filter((d) => d.fecha && new Date(d.fecha) >= limite),
      }));
      this.filteredData.emit(datosFiltrados);
      return;
    }

    // 🔹 Filtrar por DÍAS (PRECIPITACIÓN)
    const fechaInicio = this.calcularFechaInicio(rango);
    const fechaFin = ahora;
    const datosFiltrados = this.allData.map((serie) => ({
      ...serie,
      data: serie.data.filter((d: any) => {
        const fechaDato = new Date(d.fecha);
        return fechaDato >= fechaInicio && fechaDato <= fechaFin;
      }),
    }));

    this.filteredData.emit(datosFiltrados);
  }

  /**
   * 🔹 Calcula la fecha límite para filtrar datos de precipitación.
   */
  private calcularFechaInicio(dias: number): Date {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);
    fechaInicio.setHours(3, 0, 0, 0);
    return fechaInicio;
  }
}
