import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TitleService } from '../../../services/header/title.service';
TitleService;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  title: string = '';

  @Output() toggleEventEmiter = new EventEmitter<boolean>();

  constructor(private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.currentTitle.subscribe((title) => {
      this.title = title;
    });
  }
  toggleMenu() {
    this.toggleEventEmiter.emit();
  }
}
