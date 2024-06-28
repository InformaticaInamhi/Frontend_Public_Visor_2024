import { Injectable } from "@angular/core";
import { configGraphic } from "../configPlotlyJs";
import { BehaviorSubject } from 'rxjs';
declare const Plotly: any;

@Injectable({
  providedIn: "root",
})
export class GraphReservorioService {
  private statusSource = new BehaviorSubject<boolean>(false);
  currentStatus = this.statusSource.asObservable();
  constructor() {}

  changeStatus(status: boolean) {
    this.statusSource.next(status);
  }
  
  graficar(idGraph: string, graficas: any, infoReservorio: any) {
    const subTraces: any = [];
    const yValues: number[] = []; // Array para almacenar todos los valores de y
    graficas.forEach((trace: any) => {
      const xData = trace.data.map((a: any) => a.fecha);
      const yData = trace.data.map((a: any) => a.valor);
      const xAxis = "" + trace.xaxis;
      const yAxis = trace.yaxis;

      const traceObject = {
        x: xData,
        y: yData,
        xaxis: xAxis,
        yaxis: yAxis,
        name: trace.name,
        mode: trace.mode,
        type: trace.type,
        fill: trace.fill,
        fillcolor: trace.fillcolor,
        line: trace.line,
        marker: trace.marker,
        width: "",
        hovertemplate:
          "<b>%{data.name}</b>" +
          "<br><b>Fecha: </b> %{x}" +
          "<br><b>Valor: </b> %{y} " +
          trace.unidad +
          "<extra></extra>",
      };

      subTraces.push(traceObject);
      yValues.push(...yData); // Agregar los valores de y al array
    });

    const yMin = Math.min(...yValues); // Valor mínimo de y
    const yMinAdjusted = yMin - yMin; // Ajuste del valor mínimo en un 50%

    const yMax = Math.max(...yValues); // Valor máximo de y
    const yMaxAdjusted = yMax + yMax * 0.3; // Ajuste del valor máximo en un 50%
    let title_yaxis = `Caudal<br>Observado-Pronosticado<br> m³/s`;
    let title_yaxis2 = "Precipitación<br>Acumulada<br> mm";
    let autorange = "reversed";

    let xaxis: any = {
      type: "date",
      // tickformat: "%b %d",
      // tickmode: "auto",
    };

    let xaxis2: any = {
      type: "date",
      tickformat: "%b %d",
      tickmode: "auto",
      side: "top",
    };

    if (idGraph == "pronosticoGeoglows") {
      title_yaxis2 = `Caudal<br>Observado-Pronosticado 1h<br> Alta resolución Geoglows m³/s`;
      title_yaxis = `Caudal Pronosticado 3h<br> Promedio Geoglows m³/s`;
      autorange = "";

      xaxis = {
        type: "fdatetime", // Cambio de "date" a "fdatetime"
        tickmode: "auto",
      };

      xaxis2 = {
        type: "fdatetime", // Cambio de "date" a "fdatetime"
        tickmode: "auto",
        side: "top",
      };
    }
    var layouts = {
      hovermode: "closest",
      hoverlabel: { bgcolor: "#FFF" },
      //Objeto que contiene las opciones del titulo del gráfico
      title: {
        text: `<b>HIDROGRAMA DE CAUDAL PRONOSTICADO ${infoReservorio.catenomb} ${infoReservorio.puobnomb}</b><br>Código: ${infoReservorio.puobcodi} lat: ${infoReservorio.coorlati} long: ${infoReservorio.coorlong}  Altura: ${infoReservorio.cooraltu} m s.n.m.
        `,
        font: { size: 14 },
        xref: "paper", // Referencia del título al ancho del gráfico
        x: 0.5, // Posición horizontal del título (0.5 = centrado)
        xanchor: "center", // Anclaje horizontal del título
      },
      grid: {
        rows: 2,
        columns: 1,
        pattern: "independent",
        roworder: "bottom to top",
      },

      images: [
        {
          source: "./assets/logos/logo_celec_inamhi.jpg", // Ruta relativa a la imagen local
          xref: "paper",
          yref: "paper",
          x: 0.2, // Posición x de la esquina superior izquierda de la imagen (0.5 es el centro del gráfico)
          y: 0.5, // Posición y de la esquina superior izquierda de la imagen (0.5 es el centro del gráfico)
          sizex: 0.7, // Tamaño horizontal de la imagen (0.2 es 1/5 del ancho del gráfico)
          sizey: 0.7, // Tamaño vertical de la imagen (0.2 es 1/5 del alto del gráfico)
          opacity: 0.3, // Opacidad de la imagen (0 a 1, 0.3 es un valor bajo para la marca de agua)
          layer: "below", // Capa del gráfico en la que se dibujará la imagen ('below' es debajo del gráfico)
          xanchor: "middle", // Alineación horizontal de la imagen ('middle' es la mitad del gráfico)
          yanchor: "middle", // Alineación vertical de la imagen ('middle' es la mitad del gráfico)
        },
      ],

      legend: {
        orientation: "h",
        y: -0.2,
        x: 0.5,
        bordercolor: "#000000",
        borderwidth: 1,
        font: {
          size: 11,
        },
        xanchor: "center",
      },

      autosize: true,

      modebar: {
        activecolor: "#1f5c89",
      },

      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0,
          y: 0,
          xanchor: "left",
          yanchor: "bottom",
          text: "Hora UTC-5",
          showarrow: false,
        },
      ],

      xaxis: xaxis,

      xaxis2: xaxis2,

      yaxis: {
        title: title_yaxis,
        zeroline: false,
        range: [yMinAdjusted, yMaxAdjusted],
      },
      yaxis2: {
        title: title_yaxis2,
        autorange: autorange,
        zeroline: false,
        range: [yMinAdjusted, yMaxAdjusted],
      },
    };

    Plotly.newPlot(idGraph, subTraces, layouts, configGraphic);
  }
}
