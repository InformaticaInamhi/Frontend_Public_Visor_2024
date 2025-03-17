import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { station_captor, station_status, type_station } from './parameters-map';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { valuesFormConfigMap } from '../../map/config-map-estaciones';
@Component({
  selector: 'app-config-map',
  templateUrl: './config-map.component.html',
  styleUrls: ['./config-map.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class ConfigMapComponent implements OnInit {
  @Output() eventSendData = new EventEmitter<any>();
  @Input() stationNetwork: OwnerStation[] = [];
  @Output() closeConfig = new EventEmitter<void>();

  station_captor = station_captor;
  station_status = station_status;
  station_type = type_station;

  FormConfigStation!: FormGroup;

  formOptions = valuesFormConfigMap;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.FormConfigStation = this.fb.group({
      station_network: 0, // Preselecciona el valor 0
      station_captor: new FormArray(
        this.station_captor.map((item) => this.fb.control(item.value === 2))
      ),
      station_status: new FormArray(
        this.station_status.map((item) =>
          this.fb.control(this.formOptions.station_status.includes(item.value))
        )
      ),
      station_type: new FormArray(
        this.station_type.map((item) =>
          this.fb.control([1, 2, 3].includes(item.value))
        )
      ),
      isCheckedGroup: [true],
    });
  }

  changeItemFilter(): any {
    const configValues = this.FormConfigStation.value;
    const selectedCaptor = this.station_captor
      .filter((_, index) => configValues.station_captor[index])
      .map((item) => item.value);

    const selectedStatus = this.station_status
      .filter((_, index) => configValues.station_status[index])
      .map((item) => item.value);

    const selectedType = this.station_type
      .filter((_, index) => configValues.station_type[index])
      .map((item) => item.value);

    this.eventSendData.emit({
      ...configValues,
      isCheckedGroup: configValues.isCheckedGroup,
      station_captor: selectedCaptor,
      station_status: selectedStatus,
      station_type: selectedType,
    });
  }

  onClose() {
    this.closeConfig.emit();
  }
}

interface OwnerStation {
  id_propietario: number;
  propietario: string;
}
