import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PointObservationModel } from '../../../data-core/models/point-observation.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-floating-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDrag, MatIconModule],
  templateUrl: './floating-search.html',
  styleUrl: './floating-search.scss',
})
export class FloatingSearchComponent {
  @Input() observations: PointObservationModel[] = [];
  @Output() selected = new EventEmitter<PointObservationModel>();

  query: string = '';
  showInput = false;

  get results(): PointObservationModel[] {
    return this.query.length >= 2
      ? this.observations.filter((obs) =>
          obs.codigo.toLowerCase().includes(this.query.toLowerCase())
        )
      : [];
  }

  toggleInput() {
    this.showInput = !this.showInput;
  }

  select(obs: PointObservationModel) {
    this.selected.emit(obs);
    this.query = obs.codigo;
  }
}
