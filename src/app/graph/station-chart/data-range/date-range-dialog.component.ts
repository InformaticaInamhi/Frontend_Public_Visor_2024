import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS } from '@angular/material/core';


export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-date-range-dialog',
  standalone: true,
  templateUrl: './date-range-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }, // 👈 usar formato dd/MM/yyyy
  ],
})
export class DateRangeDialogComponent {
  form: FormGroup;
  today = new Date(); // límite máximo

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DateRangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { start: Date | null; end: Date | null }
  ) {
    this.form = this.fb.group({
      start: [data?.start || null],
      end: [data?.end || null],
    });
  }

  confirm(): void {
    const value = this.form.value;
    if (value.end && value.end > this.today) {
      value.end = this.today; // seguridad extra
    }
    this.dialogRef.close(value);
  }
}
