import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ExportDataService } from '../../../../services/exportData/export-data.service';
import { NotificationsService } from '../../../../services/notifications/notifications.service';
import { GraphMeteoHidroService } from '../../../../services/plotly-js/graph-meteo-hidro/graph-meteo-hidro.service';
import { SpinnerService } from '../../../../services/spinner/spinner.service';
import { StationService } from '../../../../services/stations/station.service';
import { FormDateComponent } from '../../../forms/form-date/form-date.component';
import {
  DataParameter,
  InterfaceDataExport,
  weatherOpt,
  weatherParameters,
} from '../../config-graph';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DataStationInterface } from '../../../../models/dataStation';
import {
  Agrupado,
  ParametrosStation,
} from '../../../../models/parameterStation';
import { Station } from '../../../../models/station';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
@Component({
  selector: 'app-meteo-hidro',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    FormDateComponent,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './meteo-hidro.component.html',
  styleUrl: './meteo-hidro.component.css',
})
export class MeteoHidroComponent implements OnInit {
  @Input() infoStation!: Station;
  weatherParameters: any[] = [];
  showHideGraph: boolean = false;
  id_categoria: number = 0;
  id_estacion: number = 0;
  puobcodi: string = '';
  selectedIndex: number = 0;
  selectParam: any;

  /*Formulario para obtener datos hidro-meteo segun rango */
  activateFormDate: boolean = false;
  maxRangeDays: number = 10;
  isValidDateRange: boolean = true;

  /* app form date */
  permissionQueryForm: boolean = false;
  btnCalendarForm: boolean = false;
  exportDataStation_csv: Array<InterfaceDataExport> = [];
  valueFormDate: any;

  constructor(
    private stationService: StationService,
    private exportData: ExportDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationsService,
    private graphMH_service: GraphMeteoHidroService,
    private auth: AuthService,
    private userServ: UserService
  ) {
    if (this.auth.getToken() != null) {
      this.userServ.accessQueryDate().subscribe((res: boolean) => {
        this.permissionQueryForm = res;
      });
    }
  }
  ngOnInit(): void {
    this.id_categoria = this.infoStation.id_categoria;
    this.id_estacion = this.infoStation.id_estacion;
    this.puobcodi = this.infoStation.codigo;
    this.getParameterStation();
  }

  closeMatCardChart() {
    this.weatherParameters = [];
    this.showHideGraph = false;
  }

  activateChart(weather_opc: DataParameter) {
    this.selectParam = weather_opc;
    const weatherOptions = this.findWeatherParameterByNameParam(
      weather_opc.parametro
    );
    const requestData = {
      ...this.valueFormDate,
      id_estacion: this.id_estacion,
      table_names: weather_opc.nemonicos,
    };
    this.showHideGraph = true;
    this.spinnerService.show(true);
    if (weatherOptions?.id == 5) {
      this.getDataWind(requestData, weatherOptions);
      return;
    }

    this.stationService.getDataStation(requestData).subscribe({
      next: (stationData: DataStationInterface[]) => {
        if (!this.checkDataAvailability(stationData)) {
          this.showNoData();
        } else {
          this.renderChart(weatherOptions!, stationData);
        }
        this.spinnerService.show(false);
      },
      error: () => {
        this.showNoData();
        this.spinnerService.show(false);
      },
    });
  }

  getDataWind(requestData: any, weatherOptions: any) {
    this.stationService
      .getWindDataStation(requestData)
      .subscribe((stationData: any) => {
        this.spinnerService.show(false);
        if (!this.checkDataAvailability(stationData)) {
          this.showNoData();
          return;
        }
        this.renderChart(weatherOptions, stationData);
      });
  }

  showNoData() {
    this.notificationService.openSnackBar(
      `No existe información disponible para la estación: ${this.puobcodi}`,
      'X',
      'custom-styleYellow'
    );
    this.showHideGraph = false;
    this.valueFormDate = {};
  }
  getParameterStation() {
    setTimeout(() => this.spinnerService.show(true), 0);
    this.stationService
      .getParameterStation(this.id_estacion)
      .subscribe((res: ParametrosStation[]) => {
        this.weatherParameters = this.agruparPorParametro(res);
        this.spinnerService.show(false);
      });
  }

  getValueForm(valueForm: any) {
    this.valueFormDate = valueForm;
    if (!this.selectParam) {
      this.notificationService.openSnackBar(
        `Seleccione un parametro para la consulta`,
        'X',
        'custom-styleYellow'
      );
      return;
    }
    this.activateChart(this.selectParam);
  }

  ExportDataCsv() {
    this.exportData.exportCsvData(this.exportDataStation_csv);
  }

  findWeatherParameterByNameParam(name_param: string) {
    return weatherParameters.find((param) =>
      param.name_param.includes(name_param)
    );
  }

  checkDataAvailability(stationData: any[]): boolean {
    return stationData.some((item) => item.data.length > 0);
  }

  renderChart(weatherOptions: weatherOpt, dataStation: any) {
    this.btnCalendarForm = false;
    this.exportDataStation_csv = dataStation;
    this.graphMH_service.renderChart(
      this.infoStation,
      weatherOptions,
      dataStation
    );
  }

  agruparPorParametro(medidas: ParametrosStation[]): Agrupado[] {
    const resultado: Record<string, Agrupado> = {};
    for (const medida of medidas) {
      if (!resultado[medida.parametro]) {
        resultado[medida.parametro] = {
          parametro: medida.parametro,
          nemonicos: [],
        };
      }
      resultado[medida.parametro].nemonicos.push(medida.nemonico_2);
    }
    return Object.values(resultado);
  }
}
