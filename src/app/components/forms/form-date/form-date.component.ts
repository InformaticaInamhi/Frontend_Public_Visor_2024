import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatNativeDateModule } from '@angular/material/core';
import { NotificationsService } from '../../../services/notifications/notifications.service';
@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class FormDateComponent implements OnInit {
  @Input() maxRangeDays: number = 0;
  @Output() eventSendData = new EventEmitter<any>();

  dateRangeForm: FormGroup = new FormGroup({
    fromDate: new FormControl(null, Validators.required),
    toDate: new FormControl(null, Validators.required),
  });

  /*Formulario para obtener datos hidro-meteo segun rango */
  maxDate: Date = new Date();
  isValidDateRange: boolean = true;
  constructor(private notifications: NotificationsService) {}

  ngOnInit(): void {}

  /**
   * Verifica si el rango de fechas es válido. Si no lo es, ajusta las fechas a la actual y muestra una notificación.
   * El rango es válido si la diferencia entre las fechas es menor o igual a un máximo establecido.
   */
  validateDate() {
    const { fromDate, toDate } = this.dateRangeForm.value;

    const diffDays = Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24));
    this.isValidDateRange = diffDays <= this.maxRangeDays;

    if (!this.isValidDateRange) {
      this.notifications.openSnackBar(
        `El número de días seleccionado supera el límite de ${this.maxRangeDays} días.`,
        'X',
        'custom-styleRed'
      );
      return;
    }
  }

  sendRangeForm() {
    if (this.dateRangeForm.invalid) return;

    const { fromDate, toDate } = this.dateRangeForm.value;
    const requestData = {
      start_date: fromDate ? fromDate.toISOString().slice(0, 10) : null,
      end_date: toDate ? toDate.toISOString().slice(0, 10) : null,
    };
    this.eventSendData.emit(requestData);
  }
}
