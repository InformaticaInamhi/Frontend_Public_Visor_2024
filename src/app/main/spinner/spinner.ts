import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../services/spinner-service/spinner-service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
})
export class Spinner {
  constructor(public spinnerService: SpinnerService) {}
}
