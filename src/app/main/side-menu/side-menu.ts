import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
  
})
export class SideMenu {
  @Input() isMenuOpen = true;
  @Output() toggleRequested = new EventEmitter<void>();

  emitToggle(): void {
    this.toggleRequested.emit();
  }
}
