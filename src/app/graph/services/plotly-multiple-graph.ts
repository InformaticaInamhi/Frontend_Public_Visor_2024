declare const Plotly: any;

import { Injectable } from '@angular/core';
import { ParametroEstacion } from '../../data-core/models/observation-point';
import { PointObservationModel } from '../../data-core/models/point-observation.model';

/** Serie devuelta por el backend */
interface SerieResponse {
  nemonico: string;
  id_estacion: number;
  color: string;
  data: { fecha_toma_dato: string; valor: number }[];
}

/** Configuración de ejes para gráficas simples */
const simpleGraphAxisConfig = {
  xaxis: {
    type: 'date',
    automargin: true,
    showline: true,
    linecolor: 'black',
    linewidth: 1,
  },
  yaxis: {
    automargin: false,
    tickfont: { size: 11, family: 'Arial' },
    linecolor: 'black',
    linewidth: 1,
    mirror: true,
    showline: true,
    showticklabels: true,
  },
};

/** Configuración base del layout Plotly */
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
export class PlotlyMultipleGraph {
  /** Renderiza gráfico combinado con múltiples parámetros */
  renderCombinedChart(
    containerElement: HTMLElement,
    station: PointObservationModel,
    selectedParams: ParametroEstacion[],
    seriesData: SerieResponse[],
    selectedTraceTypes: { [paramName: string]: string }
  ): void {
    const isSingle = selectedParams.length === 1;
    const traces: any[] = [];

    const layout: any = {
      ...structuredClone(baseLayoutConfig),
      ...(isSingle
        ? {
            ...simpleGraphAxisConfig,
          }
        : {
            margin: { t: 200, r: 15, b: 60 },
            height: 700,
            grid: {
              rows: 1,
              columns: selectedParams.length,
              pattern: 'independent',
            },
          }),
      title: this.getPlotTitle(station),
    };

    if (isSingle) {
      layout.annotations.push({
        text: `<b>${selectedParams[0].name_param}</b><br>(${
          selectedParams[0].params?.[0]?.simbolo_unidad || ''
        })`,
        xref: 'paper',
        yref: 'paper',
        x: -0.03,
        y: 0.5,
        xanchor: 'center',
        yanchor: 'middle',
        textangle: -90,
        showarrow: false,
        font: { size: 13, color: '#000', family: 'Arial' },
      });
    }

    selectedParams.forEach((param, index) => {
      const definiciones = param.params || [];
      const traceType = selectedTraceTypes[param.name_param] || 'lines+markers';
      const xaxis = isSingle ? 'x' : `x${index + 1}`;
      const yaxis = isSingle ? 'y' : `y${index + 1}`;

      if (!isSingle) {
        layout[xaxis] = {
          domain: [
            index / selectedParams.length,
            (index + 1) / selectedParams.length,
          ],
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
          text: `<b>${param.name_param} (${
            param.params?.[0]?.simbolo_unidad || ''
          })</b>`,
          font: { size: 15, color: '#000', family: 'Arial' },
          xref: 'paper',
          yref: 'paper',
          x: (index + 0.5) / selectedParams.length,
          y: 1.05,
          xanchor: 'center',
          yanchor: 'bottom',
          showarrow: false,
        });
      }

      for (const def of definiciones) {
        const serie = seriesData.find((s) => s.nemonico === def.nemonico);
        if (!serie) continue;

        const unidad = def.simbolo_unidad || '';
        const estad = this.getEstadName(def.estadistico || '');
        const name = `${estad} (${unidad})`;

        const x = serie.data.map((d) => new Date(d.fecha_toma_dato));
        const y = serie.data.map((d) => d.valor);

        const traceBase: any = {
          name,
          x,
          y,
          xaxis,
          yaxis,
          line: { color: serie.color },
          marker: { color: serie.color, size: 6 },
          connectgaps: false,
          hovertemplate: `<b>%{fullData.name}</b>: %{y:.2f} ${unidad}<extra></extra>`,
          showlegend: true,
          legendgroup: param.name_param,
          legendgrouptitle: { text: `${param.name_param} (${unidad})` },
        };

        if (traceType === 'bar') {
          traces.push({ type: 'bar', ...traceBase });
        } else if (traceType === 'area') {
          traces.push({
            type: 'scatter',
            mode: 'lines',
            fill: 'tozeroy',
            ...traceBase,
          });
        } else {
          traces.push({ type: 'scatter', mode: traceType, ...traceBase });
        }
      }
    });

    this.addLegendToBottom(layout);
    Plotly.purge(containerElement);
    Plotly.newPlot(containerElement, traces, layout);
  }

  /** Retorna nombre abreviado del estadístico */
  private getEstadName(raw: string): string {
    const estad = raw.toUpperCase();
    return estad === 'SUMA'
      ? 'ACUM'
      : estad === 'PROMEDIO'
      ? 'PROM'
      : estad === 'INSTANTANEA'
      ? 'INST'
      : estad;
  }

  /** Genera título descriptivo de la estación */
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

  /** Ajusta leyenda inferior horizontal */
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
