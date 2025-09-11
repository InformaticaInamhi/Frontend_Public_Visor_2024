declare const Plotly: any;

import { Injectable } from '@angular/core';
import { PointObservationModel } from '../../../data-core/models/point-observation.model';

/** Serie devuelta por el backend para convencionales */
interface SerieConvencional {
  nemonico: string;
  id_estacion: number;
  color: string;
  data: { [key: string]: any }[];
}

/** Configuración base */
const baseLayoutConfig = {
  paper_bgcolor: 'rgba(255, 255, 255, 1)',
  plot_bgcolor: 'rgba(132, 193, 253, 0.1)',
  font: { family: 'Arial', size: 12 },
  hovermode: 'x unified',
  annotations: [
    {
      text: 'INAMHI',
      font: { size: 150, color: '#09233bff', family: 'Arial Black' },
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      y: 0.5,
      xanchor: 'center',
      yanchor: 'middle',
      opacity: 0.1,
      showarrow: false,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class PlotlyConvencionalesGraph {
  /** Gráfico combinado de convencionales */
  renderCombinedChart(
    containerElement: HTMLElement,
    station: PointObservationModel,
    selectedParams: any[],
    seriesData: SerieConvencional | SerieConvencional[],
    selectedTraceTypesPerParam: { [key: string]: string }
  ): void {
    const seriesArray = Array.isArray(seriesData) ? seriesData : [seriesData];
    const traces: any[] = [];

    const layout: any = {
      ...structuredClone(baseLayoutConfig),
      margin: { t: 200, r: 15, b: 60 },
      height: 700,
      grid: {
        rows: 1,
        columns: seriesArray.length,
        pattern: 'independent',
      },
      title: this.getPlotTitle(station),
      annotations: [...baseLayoutConfig.annotations],
    };

    seriesArray.forEach((serie, index) => {
      const xaxis = `x${index + 1}`;
      const yaxis = `y${index + 1}`;

      // buscar metadata en selectedParams y en params
      let metaParam: any;
      let metaEst: any;
      for (const p of selectedParams) {
        const found = p.params.find(
          (est: any) => est.nemonico === serie.nemonico
        );
        if (found) {
          metaParam = p; // padre (tiene name_param)
          metaEst = found; // estadístico
          break;
        }
      }

      const displayName =
        metaParam?.name_param ||
        metaEst?.descripcion_parametro ||
        serie.nemonico;

      // obtener tipo seleccionado según el padre
      const traceType =
        selectedTraceTypesPerParam?.[metaParam?.name_param] || 'scatter';

      layout[xaxis] = {
        domain: [index / seriesArray.length, (index + 1) / seriesArray.length],
        anchor: yaxis,
        type: 'date',
        automargin: true,
        showline: true,
        linecolor: 'black',
        linewidth: 1,
      };

      layout[yaxis] = {
        automargin: false,
        tickfont: { size: 11, family: 'Arial' },
        linecolor: 'black',
        linewidth: 1,
        mirror: true,
        showline: true,
        showticklabels: true,
      };

      layout.annotations.push({
        text: `<b>${displayName}</b>`,
        font: { size: 15, color: '#000', family: 'Arial' },
        xref: 'paper',
        yref: 'paper',
        x: (index + 0.5) / seriesArray.length,
        y: 1.05,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
      });

      if (this.isSpecial(serie.nemonico)) {
        traces.push(...this.getSpecialTraces(serie, xaxis, yaxis, traceType));
      } else {
        traces.push(this.getDefaultTrace(serie, xaxis, yaxis, traceType));
      }
    });

    this.addLegendToBottom(layout);
    Plotly.purge(containerElement);
    Plotly.newPlot(containerElement, traces, layout);
  }

  /** Caso normal (columna valor) */
  private getDefaultTrace(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    const y = serie.data.map((d) => d['valor']);

    if (traceType === 'bar') {
      return {
        type: 'bar',
        name: serie.nemonico,
        x,
        y,
        xaxis,
        yaxis,
        marker: { color: serie.color || '#000000' },
      };
    }

    return {
      type: 'scatter',
      mode: traceType,
      name: serie.nemonico,
      x,
      y,
      xaxis,
      yaxis,
      line: { color: serie.color || '#000000' },
      marker: { size: 6 },
      connectgaps: false,
    };
  }

  /** Identifica nemónicos especiales */
  /** Identifica nemónicos especiales */
  private isSpecial(nemonico: string): boolean {
    return [
      '029031601h',
      '006141601h',
      '128271601h',
      '018071601h',
      '037111601h',
    ].includes(nemonico.replace(/^_/, ''));
  }

  private getSpecialTraces(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any[] {
    const nem = serie.nemonico.replace(/^_/, '');
    switch (nem) {
      case '029031601h':
        return this.getTraces029031601h(serie, xaxis, yaxis, traceType);
      case '006141601h':
        return this.getTraces006141601h(serie, xaxis, yaxis, traceType);
      case '128271601h':
        return this.getTraces128271601h(serie, xaxis, yaxis, traceType);
      case '018071601h':
        return this.getTraces018071601h(serie, xaxis, yaxis, traceType);
      case '037111601h': // 👈 nuevo caso viento
        return this.getTraces037111601h(serie, xaxis, yaxis);
      default:
        return [];
    }
  }

  /** Viento: velocidad + recorrido, con dirección en tooltip */

  /** Viento con flechas en función de la dirección */
  private getTraces037111601h(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string
  ): any[] {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    const y = serie.data.map((d) => d['velocidad']);
    const dir = serie.data.map((d) =>
      this.getDirectionDegrees(d['direccion_viento'])
    );

    return [
      {
        type: 'scatter',
        mode: 'markers+lines',
        name: 'Velocidad del Viento',
        x,
        y,
        xaxis,
        yaxis,
        line: { color: serie.color || '#FF0000' },
        marker: {
          size: 12,
          color: serie.color || '#1E90FF',
          symbol: 'triangle-up',
          angle: dir,
        },
        customdata: serie.data.map((d) => ({
          direccion: d['direccion_viento'],
          velocidad: d['velocidad'],
          recorrido: d['recorrido'],
        })),
        hovertemplate:
          `<b>Dirección</b>: %{customdata.direccion}<br>` +
          `<b>Velocidad</b>: %{customdata.velocidad:.2f} m/s<br>` +
          `<b>Recorrido</b>: %{customdata.recorrido} m<extra></extra>`,
      },
    ];
  }

  /** Conversión de texto de dirección a ángulos en grados (Plotly usa 0° = Este, CCW) */
  private getDirectionDegrees(dir: string): number {
    const map: { [key: string]: number } = {
      N: -90, // Norte = hacia arriba
      NE: -45,
      E: 0,
      SE: 45,
      S: 90,
      SW: 135,
      W: 180,
      NW: -135,
    };
    return map[dir] ?? 0;
  }

  /** Termómetros (seco/húmedo) */
  private getTraces029031601h(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any[] {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    return [
      {
        type: 'scatter',
        mode: traceType,
        name: 'Termómetro Seco (°C)',
        x,
        y: serie.data.map((d) => d['term_seco']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#FF0000' },
        marker: { size: 6 },
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Termómetro Húmedo (°C)',
        x,
        y: serie.data.map((d) => d['term_hmd']),
        xaxis,
        yaxis,
        line: { color: '#007BFF' },
        marker: { size: 6 },
      },
    ];
  }

  /** Evaporación */
  private getTraces006141601h(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any[] {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    return [
      {
        type: 'scatter',
        mode: traceType,
        name: 'Lectura Micrómetro (mm)',
        x,
        y: serie.data.map((d) => d['lectura_micrometro']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#8B0000' },
        marker: { size: 6 },
      },
      {
        type: 'scatter',
        mode: traceType,
        name: 'Reducción Tanque (mm)',
        x,
        y: serie.data.map((d) => d['reduccion_tanque']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#FF8C00' },
        marker: { size: 6 },
      },
      {
        type: 'scatter',
        mode: traceType,
        name: 'Evaporación (mm)',
        x,
        y: serie.data.map((d) => d['evaporacion']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#28A745' },
        marker: { size: 6 },
      },
    ];
  }

  /** Nubosidad (octas y altura sobre suelo si existe) */
  private getTraces128271601h(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any[] {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    const traces: any[] = [];

    // Octas (siempre presente)
    traces.push({
      type: 'scatter',
      mode: traceType,
      name: 'Octas (0-8)',
      x,
      y: serie.data.map((d) => d['octas']),
      xaxis,
      yaxis,
      line: { color: serie.color || '#1E90FF' },
      marker: { size: 6 },
      hovertemplate: `<b>Octas</b>: %{y}<extra></extra>`,
    });

    // Altura sobre suelo (solo si hay valores distintos de null)
    if (serie.data.some((d) => d['altura_sobre_suelo'] !== null)) {
      traces.push({
        type: 'scatter',
        mode: traceType,
        name: 'Altura sobre suelo (m)',
        x,
        y: serie.data.map((d) => d['altura_sobre_suelo']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#32CD32' },
        marker: { size: 6 },
        hovertemplate: `<b>Altura</b>: %{y:.0f} m<extra></extra>`,
      });
    }

    return traces;
  }

  /** Barómetro */
  private getTraces018071601h(
    serie: SerieConvencional,
    xaxis: string,
    yaxis: string,
    traceType: string
  ): any[] {
    const x = serie.data.map((d) => new Date(d['fecha_toma_dato']));
    return [
      {
        type: 'scatter',
        mode: traceType,
        name: 'Lectura directa barómetro (hPa)',
        x,
        y: serie.data.map((d) => d['lectura_directa_barometro']),
        xaxis,
        yaxis,
        line: { color: serie.color || '#FF0000' },
        marker: { size: 6 },
        hovertemplate: `<b>Lectura directa</b>: %{y:.2f} hPa<extra></extra>`,
      },
    ];
  }

  /** Genera título descriptivo */
  private getPlotTitle(station: PointObservationModel): any {
    return {
      text:
        `<b>ESTACIÓN METEOROLÓGICA ${station.punto_obs?.toUpperCase()}</b><br>` +
        `${station.provincia?.toUpperCase()} - ${station.canton?.toUpperCase()}<br>` +
        `CÓDIGO: <b>${station.codigo}</b> | LAT: <b>${station.latitud}</b> | LONG: <b>${station.longitud}</b> | ALTURA: <b>${station.altitud} M S.N.M.</b>`,
      x: 0.5,
      xanchor: 'center',
      font: { size: 13, color: '#000', family: 'Arial' },
    };
  }

  /** Leyenda inferior horizontal */
  private addLegendToBottom(layout: any): void {
    layout.legend = {
      orientation: 'h',
      x: 0.5,
      y: -0.2,
      xanchor: 'center',
      yanchor: 'top',
      font: { size: 11, family: 'Arial' },
      itemwidth: 30,
      bordercolor: 'black',
      borderwidth: 1,
      bgcolor: 'rgba(255,255,255,0.9)',
    };
  }
}
