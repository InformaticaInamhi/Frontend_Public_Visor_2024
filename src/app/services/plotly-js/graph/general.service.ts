/**
 * GeneralService - Servicio para la generación de gráficos usando Plotly.js
 * Desarrollado por: Kevin Andres Changoluisa Cuayal
 */

import { Injectable } from '@angular/core';
import { ParametrosStation } from '../../../models/parameterStation';
import { Station } from '../../../models/station';
declare const Plotly: any;

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() {}

  /**
   * Genera y actualiza un gráfico en un div específico.
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
    const traces = dataArray.map((series) => ({
      x: series.data.map((d: any) => new Date(d.fecha)), // Asigna valores al eje X (fechas)
      y: series.data.map((d: any) => d.valor), // Asigna valores al eje Y (datos)
      type: 'scatter',
      name: series.name, // Nombre de la serie de datos
      line: { color: series.color }, // Color de la línea
      mode: 'lines+markers', // Muestra líneas y puntos
      marker: { size: 6 }, // Ajusta el tamaño de los puntos
      hovertemplate: `<b>%{fullData.name}: </b> %{y} ${selectedParameter.unidad_medida}<extra></extra>`, // Muestra todas las series en hover
      connectgaps: false,
      visible: true,
    }));

    // Se obtiene el layout personalizado con el título y configuraciones
    const layout = this.generateGraphLayout(infoStation, selectedParameter);

    Plotly.react(divId, traces, layout, { scrollZoom: true });
  }

  /**
   * Genera el layout para el gráfico, incluyendo título, leyenda, ejes, tooltips y borde negro interno.
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
          standoff: 20,
        },
        automargin: true,
      },
      autosize: true,

      margin: { l: 80, r: 50, t: 90, b: 100 },

      // 🔹 Activa el hover para mostrar todas las series al mismo tiempo
      hovermode: 'x unified',

      // 🔹 Estiliza los tooltips para mejorar la visualización
      hoverlabel: {
        bgcolor: 'rgba(255,255,255,0.8)', // Fondo semi-transparente
        bordercolor: 'black', // Borde negro
        font: { size: 12, color: 'black' }, // Fuente legible
      },

      // Fondo del gráfico y borde negro interno
      paper_bgcolor: 'white',
      plot_bgcolor: 'white',
      shapes: [
        {
          type: 'rect',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 1,
          xref: 'paper',
          yref: 'paper',
          line: {
            color: 'black', // Borde negro alrededor del gráfico
            width: 1,
          },
        },
      ],
    };
  }
}
