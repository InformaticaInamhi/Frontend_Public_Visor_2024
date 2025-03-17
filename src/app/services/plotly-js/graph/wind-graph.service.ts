/**
 * WindGraphService - Servicio para la generación de gráficos de precipitación en Plotly.js
 * Desarrollado por: Kevin Andres Changoluisa Cuayal
 */
import { Injectable } from '@angular/core';
import { ParametrosStation } from '../../../models/parameterStation';
import { Station } from '../../../models/station';
declare const Plotly: any;

@Injectable({
  providedIn: 'root',
})
export class WindGraphService {
  constructor() {}

  /**
   * Genera y actualiza un gráfico de viento con velocidad y dirección.
   * @param dataArray - Array de datos con velocidad y dirección del viento.
   * @param divId - ID del div donde se renderiza el gráfico.
   * @param infoStation - Información de la estación seleccionada.
   * @param selectedParameter - Parámetro seleccionado en el gráfico.
   */
  createGraph(
    dataArray: any[],
    divId: string,
    infoStation: Station,
    selectedParameter: ParametrosStation
  ) {
    // 🔹 Filtrar datos de viento MIN y MAX
    const windMin = dataArray.find((series) => series.name.includes('MIN'));
    const windMax = dataArray.find((series) => series.name.includes('MAX'));

    const traces = [];

    // 🔹 Agregar viento MIN al gráfico
    if (windMin) {
      traces.push(this.createWindTrace(windMin, '#003EFF', 'Viento Mínimo'));
    }

    // 🔹 Agregar viento MAX al gráfico
    if (windMax) {
      traces.push(this.createWindTrace(windMax, '#FF0000', 'Viento Máximo'));
    }

    // 🔹 Configurar el layout del gráfico
    const layout: any = this.generateGraphLayout(
      infoStation,
      selectedParameter
    );

    // 🔹 Renderizar el gráfico
    Plotly.react(divId, traces, layout, { scrollZoom: true });
  }

  /**
   * Crea una traza para graficar el viento con flechas indicando dirección.
   * @param windData - Datos de viento (velocidad y dirección).
   * @param color - Color de la serie.
   * @param name - Nombre de la serie.
   * @returns Configuración de la traza para Plotly.
   */
  private createWindTrace(windData: any, color: string, name: string) {
    return {
      x: windData.data.map((d: any) => new Date(d.fecha)), // Fechas
      y: windData.data.map((d: any) => d.valor_velocidad), // Velocidades
      type: 'scatter',
      mode: 'markers+lines', // 🔹 Línea con puntos
      marker: {
        size: 8,
        symbol: 'triangle-up', // 🔹 Flecha hacia arriba
        angleref: 'previous', // 🔹 Ajusta la orientación
        angle: windData.data.map((d: any) => d.valor_direccion), // Dirección del viento
        color: color,
      },
      name: name, // 🔹 Nombre de la serie
      hovertemplate:
        `<b>%{fullData.name}</b><br>` +
        `Velocidad: %{y} m/s<br>` +
        `Dirección: %{customdata}<extra></extra>`,
      customdata: windData.data.map((d: any) =>
        this.getDirectionText(d.valor_direccion)
      ),
    };
  }

  /**
   * Genera el layout para el gráfico de viento.
   * @param infoStation - Información de la estación seleccionada.
   * @param selectedParameter - Parámetro seleccionado en el gráfico.
   * @returns Layout personalizado para el gráfico.
   */
  private generateGraphLayout(
    infoStation: Station,
    selectedParameter: ParametrosStation
  ) {
    return {
      title: {
        text: `Estación ${infoStation.categoria} <b>${infoStation.punto_obs}</b> &nbsp;${infoStation.provincia}-${infoStation.canton}<br>
               Código: ${infoStation.codigo} | Lat: ${infoStation.latitud} | Long: ${infoStation.longitud} | Altura: ${infoStation.altitud} m s.n.m.`,
        font: { size: 12 },
      },
      showlegend: true,
      legend: {
        orientation: 'h',
        x: 0.5,
        y: -0.3,
        xanchor: 'center',
        bordercolor: 'black',
        borderwidth: 1,
        bgcolor: 'rgba(255,255,255,0.8)',
      },
      xaxis: {
        title: 'Fecha y Hora',
        type: 'date',
        tickmode: 'auto',
        tickcolor: '#474747',
        tickwidth: 1,
        mirror: 'ticks',
        linecolor: '#4a4a4a',
        showticklabels: true,
      },
      yaxis: {
        title: {
          text: `${selectedParameter.nombre} (${selectedParameter.unidad_medida})`,
          font: { size: 14 },
        },
        automargin: true,
      },
      autosize: true,
      margin: { l: 80, r: 50, t: 90, b: 100 },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: 'black',
        font: { size: 12, color: 'black' },
      },
      paper_bgcolor: 'white',
      plot_bgcolor: 'white',
    };
  }

  /**
   * Convierte una dirección en grados a texto (N, NE, E, SE, S, SW, W, NW).
   * @param direccion Dirección en grados.
   * @returns Texto de la dirección del viento.
   */
  getDirectionText(direccion: number): string {
    const directions = [
      'Norte',
      'Noreste',
      'Este',
      'Sureste',
      'Sur',
      'Suroeste',
      'Oeste',
      'Noroeste',
    ];
    const index = Math.round(direccion / 45) % 8;
    return directions[index];
  }
}
