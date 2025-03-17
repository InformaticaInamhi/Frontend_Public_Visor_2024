import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { menu } from './parameters-menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatListModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() isCollapsed: boolean = false;
  @Output() changeComponentEventEmitter: EventEmitter<string> =
    new EventEmitter();

  items_menu = menu;
  changeComponent(path: string) {
    if (path.startsWith('https')) {
      // Si es una URL externa, redirigir el navegador
      window.location.href = path;
    } else {
      this.changeComponentEventEmitter.emit(path);
    }
  }
}
