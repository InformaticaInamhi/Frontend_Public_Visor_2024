import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ParametrosStation } from '../../../../models/parameterStation';
import { Station } from '../../../../models/station';

@Component({
  selector: 'app-parameter-selector',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './parameter-selector.component.html',
  styleUrl: './parameter-selector.component.css',
})
export class ParameterSelectorComponent {
  @Input() parameters: ParametrosStation[] = [];
  @Input() infoStation!: Station;

  @Output() selectedParameter = new EventEmitter<ParametrosStation>();

  onParameterSelect(param: ParametrosStation) {
    this.selectedParameter.emit(param);
  }
}
