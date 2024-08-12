import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { weatherOpt } from '../../../components/graph/config-graph';
import { DataStationInterface } from '../../../models/dataStation';
import { Station } from '../../../models/station';
import { configGraphic } from '../configPlotlyJs';

import { formatInTimeZone } from 'date-fns-tz';
declare const Plotly: any;

@Injectable({
  providedIn: 'root',
})
export class GraphMeteoHidroService {
  private statusSource = new BehaviorSubject<boolean>(false);
  currentStatus = this.statusSource.asObservable();

  changeStatus(status: boolean) {
    this.statusSource.next(status);
  }

  constructor() {}

  renderChart(
    infoStation: Station,
    weatherOptions: weatherOpt,
    dataStation: DataStationInterface[]
  ) {
    const objetoConDatos = dataStation.find(
      (obj: any) => obj.data && obj.data.length > 0
    );
    let x0: any;
    let x1: any;

    if (objetoConDatos && objetoConDatos.data.length > 0) {
      // Obtener la fecha inicial (x0)
      x0 = objetoConDatos.data[0].fecha.substr(0, 10);
      // Convertir x0 a un objeto Date y restar un día
      let fechaInicial = new Date(x0);
      fechaInicial.setDate(fechaInicial.getDate() - 1);

      // Convertir de nuevo la fecha a formato 'yyyy-mm-dd'
      x0 = fechaInicial.toISOString().substr(0, 10);

      // Obtener la fecha final (x1)
      x1 = this.setXlimSup(objetoConDatos.data);
    }

    var layout = {
      autosize: true,
      xaxis: {
        type: 'datetime',
        tickmode: 'auto',
        range: [x0, x1],
        tickcolor: '#474747',
        tickwidth: 1,
        mirror: 'ticks',
        linecolor: '#4a4a4a',
        showticklabels: true,
        rangeselector: {
          buttons: [
            {
              count: 24,
              label: '24 horas',
              step: 'hour',
              stepmode: 'backward',
            },
            {
              count: 48,
              label: '48 horas',
              step: 'hour',
              stepmode: 'backward',
            },
            {
              count: 72,
              label: '72 horas',
              step: 'hour',
              stepmode: 'backward',
            },
            {
              step: 'all',
              label: 'Todo',
            },
          ],
        },
      },

      yaxis: {
        title: `${weatherOptions.name} <br> ${weatherOptions.u_medida}`,
        titlestandoff: 10,
        type: 'linear',
        tickcolor: '#474747',
        tickwidth: 1,
        mirror: 'ticks',
        linecolor: '#4a4a4a',
        automargin: true,
      },

      //Objeto que contiene las opciones del titulo del gráfico
      title: {
        text: `Estación ${infoStation.categoria} <b>${infoStation.punto_obs}</b> &nbsp;${infoStation.provincia}-${infoStation.canton}<br>Código: ${infoStation.codigo} lat: ${infoStation.latitud} long: ${infoStation.longitud}  Altura: ${infoStation.altutid} m s.n.m.`,
        font: { size: 12 },
      },

      showlegend: true, //mostrar legenda del gráfico
      //Objeto que contiene las propiedades de la leyenda
      legend: {
        orientation: 'h',
        y: -0.2,
        x: 0.5,
        bordercolor: '#000000',
        borderwidth: 1,
        font: {
          size: 11,
        },
        xanchor: 'center',
      },

      margin: {
        l: 60,
        r: 30,
      },
      modebar: {
        activecolor: '#1f5c89',
      },

      annotations: [
        {
          xref: 'paper',
          yref: 'paper',
          x: 0,
          y: 0,
          xanchor: 'left',
          yanchor: 'bottom',
          text: '',
          showarrow: false,
        },
      ],
    };

    let dataMap = dataStation.map((d: DataStationInterface) => {
      let visible = 'true';
      let nameParam = d.name;
      let modePlot = 'lines+markers';
      let typePlot = weatherOptions.type_plot;
      let hovertemplate: any =
        '<b>%{data.name}: </b> %{y} ' +
        weatherOptions.u_medida +
        '<extra></extra>';
      let text: any;
      let textfont = {};

      let dataX = [];
      let dataY = [];
      if (d.name.toLowerCase().includes('viento')) {
        modePlot = 'text';
        textfont = {
          family: 'Arial Unicode MS, sans-serif',
          size: 20,
          color: d.color,
        };
        text = d.data.map((a: any) => `${this.getArrow(a.valor_direccion)} `);
        dataX = d.data.map((a: any) =>
          this.convertUTCtoEcuador(a.fecha, infoStation.provincia)
        );
        dataY = d.data.map((a: any) => a.valor_velocidad);
        hovertemplate = d.data.map(
          (a: any) =>
            `<b>%{data.name} Velocidad: </b>${a.valor_velocidad} m/s<br>` +
            `<b>%{data.name} Dirección: </b>${this.getDirectionText(
              a.valor_direccion
            )}` +
            '<extra></extra>'
        );
      } else {
        dataX = d.data.map((a: { fecha: string }) =>
          this.convertUTCtoEcuador(a.fecha, infoStation.provincia)
        );
        dataY = d.data.map((a: { valor: number }) => a.valor);
      }

      return {
        x: dataX,
        y: dataY,
        text: text,
        textfont: textfont,
        name: nameParam,
        mode: modePlot,
        type: typePlot,
        connectgaps: false,
        line: {
          color: d.color,
        },
        marker: {
          color: d.color,
        },
        hovertemplate: hovertemplate,
        visible: visible,
      };
    });
    Plotly.newPlot('dataStation', dataMap, layout, configGraphic);
  }

  setXlimSup(dateX1: any) {
    const fecha = dateX1[dateX1.length - 1].fecha;
    let date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return formatDate(date, 'yyyy-MM-dd H', 'en');
  }
  // Función para determinar la flecha Unicode basada en la dirección
  getArrow(direccion: number): string {
    const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round(direccion / 45) % 8;
    return arrows[index];
  }

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

  convertUTCtoEcuador(fecha: string, provincia: string) {
    fecha = fecha + 'Z';
    const timeZone =
      provincia === 'GALAPAGOS' ? 'Pacific/Galapagos' : 'America/Guayaquil';

    const formattedDate = formatInTimeZone(fecha, timeZone, 'yyyy-MM-dd HH:mm');
    return formattedDate;
  }
}
