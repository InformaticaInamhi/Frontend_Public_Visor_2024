import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PointObservationModel } from '../../../data-core/models/point-observation.model';

export interface PointFilters {
  captors: number[];
  states: number[];
  categories: number[];
}

@Component({
  selector: 'app-point-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './point-filter.html',
  styleUrl: './point-filter.scss',
})
export class PointFilterComponent {
  @Input() observations: PointObservationModel[] = [];
  @Input() filters: PointFilters = { captors: [], states: [], categories: [] };
  @Output() filtersChange = new EventEmitter<PointFilters>();

  /** Opciones de tipo de captor */
  captorOptions = computed(() => {
    const set = new Set<number>();
    this.observations.forEach((obs) => {
      const tipo = [1, 2].includes(obs.id_captor) ? obs.id_captor : 0;
      set.add(tipo);
    });

    return [2, 1, 0]
      .filter((t) => set.has(t))
      .map((id) => ({
        id,
        label:
          id === 1 ? 'Convencional' : id === 2 ? 'Automática' : 'Desconocido',
      }));
  });

  /** Opciones de estado de transmisión */
  stateOptions = computed(() => {
    const map = new Map<number, string>();
    this.observations.forEach((obs) =>
      map.set(obs.id_estado_transmision, obs.estado_transmision)
    );
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  });

  /** Opciones de categoría */
  categoryOptions = computed(() => {
    const map = new Map<number, string>();
    this.observations.forEach((obs) =>
      map.set(obs.id_categoria, obs.categoria)
    );
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  });

  /** Verifica si está seleccionado */
  isChecked(list: number[] | undefined, id: number): boolean {
    return !!list && list.includes(id);
  }

  /** Maneja cambio en checkbox */
  onCheckboxChange(event: Event, id: number, type: keyof PointFilters) {
    const checked = (event.target as HTMLInputElement)?.checked ?? false;
    const next = { ...this.filters };

    const selection = new Set(next[type] || []);

    if (checked) {
      selection.add(id);
    } else {
      // Solo permitimos quitar si no es el último
      if (selection.size > 1) {
        selection.delete(id);
      } else {
        // Revertir el checkbox si es el último
        (event.target as HTMLInputElement).checked = true;
        return;
      }
    }

    next[type] = Array.from(selection);
    this.filters = next;
    this.filtersChange.emit(next);
  }
}
