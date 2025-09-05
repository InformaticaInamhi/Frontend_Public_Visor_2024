import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PointObservationModel } from '../../../data-core/models/point-observation.model';

@Component({
  selector: 'app-point-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './point-filter.html',
  styleUrl: './point-filter.scss',
})
export class PointFilterComponent {
  @Input() observations: PointObservationModel[] = [];

  @Input() selectedCaptorTypes: number[] = [];
  @Output() selectedCaptorTypesChange = new EventEmitter<number[]>();

  private show = signal(false);
  showPanel = this.show;

  /**
   * Genera opciones únicas de tipo de captor encontradas en las observaciones.
   * Devuelve en orden: Automática (2), Convencional (1), Desconocido (0)
   */
  captorOptions = computed(() => {
    const types = new Set<number>();

    for (const obs of this.observations) {
      const tipo = [1, 2].includes(obs.id_captor) ? obs.id_captor : 0;
      types.add(tipo);
    }

    return [2, 1, 0]
      .filter((t) => types.has(t))
      .map((type) => {
        let label = 'Desconocido';
        if (type === 1) label = 'Convencional';
        else if (type === 2) label = 'Automática';
        return { type, label };
      });
  });

  /**
   * Cambia el estado del filtro cuando el checkbox es marcado/desmarcado
   */
  toggle(type: number, checked: boolean) {
    const newSelection = [...this.selectedCaptorTypes];
    const index = newSelection.indexOf(type);

    if (checked && index === -1) {
      newSelection.push(type);
    } else if (!checked && index !== -1) {
      newSelection.splice(index, 1);
    }

    this.selectedCaptorTypesChange.emit(newSelection);
  }

  /**
   * Verifica si el tipo está actualmente seleccionado
   */
  isChecked(type: number): boolean {
    return this.selectedCaptorTypes.includes(type);
  }

  onCheckboxChange(event: Event, type: number) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggle(type, checked);
  }

  togglePanel() {
    this.show.update((v) => !v);
  }
}
