/**
 * PrecipitationGraphService - Servicio para la generación de gráficos de precipitación en Plotly.js
 * Desarrollado por: Kevin Andres Changoluisa Cuayal
 */

import { Injectable } from '@angular/core';
import { ParametrosStation } from '../../../models/parameterStation';
import { Station } from '../../../models/station';
declare const Plotly: any;

@Injectable({
  providedIn: 'root',
})
export class PrecipitationGraphService {
  constructor() {}

  /**
   * Genera y actualiza un gráfico de precipitación en un div específico.
   * @param dataArray - Array de datos a graficar.
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
    // 🔹 Extraemos los datos de precipitación diaria y horaria
    const dailyPrecipitation = dataArray.find((series) =>
      series.name.includes('DIARIA')
    );
    const hourlyPrecipitation = dataArray.find((series) =>
      series.name.includes('HORARIA')
    );

    const traces = [];
    const shapes: any = []; // 🔹 Guardará los rectángulos de precipitación diaria
    const annotations: any = []; // 🔹 Guardará las etiquetas de precipitación diaria

    // 🔹 Graficamos la precipitación HORARIA como barras estándar
    if (hourlyPrecipitation) {
      traces.push({
        x: hourlyPrecipitation.data.map((d: any) => new Date(d.fecha)),
        y: hourlyPrecipitation.data.map((d: any) => d.valor),
        type: 'bar',
        name: hourlyPrecipitation.name,
        marker: {
          color: hourlyPrecipitation.color,
          line: { width: 1, color: 'black' },
        },
        hovertemplate: `<b>%{fullData.name}: </b> %{y} ${selectedParameter.unidad_medida}<extra></extra>`,
      });
    }

    // 🔹 Graficamos la precipitación DIARIA como un rectángulo que cubre 08:00 AM - 07:00 AM
    if (dailyPrecipitation) {
      dailyPrecipitation.data.forEach((d: any) => {
        const startDate = new Date(d.fecha);
        startDate.setUTCHours(13, 0, 0, 0); // 🔹 Inicio del acumulado (08:00 AM)

        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 1); // 🔹 Fin del acumulado (07:00 AM del siguiente día)
        endDate.setUTCHours(12, 0, 0, 0);

        // 🔹 Creamos la forma del rectángulo para representar la precipitación diaria
        shapes.push({
          type: 'rect',
          xref: 'x',
          yref: 'y',
          x0: startDate,
          x1: endDate,
          y0: 0,
          y1: d.valor,
          fillcolor: dailyPrecipitation.color,
          opacity: 0.3, // 🔹 Transparencia para que se vea la horaria encima
          line: {
            width: 1,
            color: 'black',
          },
          legendgroup: 'Precipitación Diaria',
        });

        // 🔹 Añadimos una anotación encima de la barra con el valor de precipitación
        annotations.push({
          x: new Date(
            startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2
          ), // 🔹 Ubicación centrada
          y: d.valor + 1, // 🔹 Un poco más arriba del valor real
          text: `${this.formatDate(startDate)} <br> Acumulado ${d.valor} mm`,
          showarrow: false,
          font: { size: 12, color: 'black', family: 'Arial' },
          xanchor: 'center',
          yanchor: 'bottom',
        });
      });

      // 🔹 Agregamos una traza vacía para mostrar en la leyenda
      traces.push({
        x: [null], // 🔹 No dibuja barras, solo sirve para la leyenda
        y: [null],
        type: 'bar',
        name: 'Precipitación Acumulada Diaria',
        marker: {
          color: dailyPrecipitation.color,
          opacity: 0.3,
        },
        visible: 'legendonly', // 🔹 Oculta inicialmente pero permite activarla
        legendgroup: 'Precipitación Diaria',
      });
    }

    // 🔹 Generamos el layout personalizado para la gráfica de precipitación
    const layout: any = this.generateGraphLayout(
      infoStation,
      selectedParameter
    );
    layout.shapes = shapes; // 🔹 Agregamos las formas de precipitación diaria al layout
    layout.annotations = annotations; // 🔹 Agregamos las etiquetas con los valores de precipitación diaria

    // 🔹 Renderizar el gráfico
    Plotly.react(divId, traces, layout, { scrollZoom: true });
  }

  /**
   * Genera el layout para el gráfico de precipitación, incluyendo título, leyenda, ejes y borde negro interno.
   * @param infoStation - Información de la estación seleccionada.
   * @param selectedParameter - Parámetro seleccionado en el gráfico.
   * @returns Layout personalizado para el gráfico de precipitación.
   */
  private generateGraphLayout(
    infoStation: Station,
    selectedParameter: any
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
      barmode: 'overlay', // 🔹 Se superponen los datos
      bargap: 0.2, // 🔹 Espaciado entre barras
      bargroupgap: 0.1, // 🔹 Espaciado entre grupos de barras
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
      shapes: [], // 🔹 Se llenará con las barras de precipitación diaria
      annotations: [], // 🔹 Se llenará con las etiquetas de precipitación diaria
    };
  }

  /**
   * Formatea la fecha en el formato `DD-MM-YYYY`
   * @param date - Fecha en formato Date
   * @returns Fecha formateada como `DD-MM-YYYY`
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0].split('-').reverse().join('-');
  }
}
