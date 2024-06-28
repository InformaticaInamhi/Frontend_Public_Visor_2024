import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-guias-visor',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './guias-visor.component.html',
  styleUrl: './guias-visor.component.css',
})
export class GuiasVisorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  downloadPdf(option: string) {
    let url!: string;
    if (option === 'visor') {
      url = '/info/assets/guias/MANUAL DE USUARIO VISOR HIDRO-METEOROLOGICO.pdf';
    } else if (option === 'telegram') {
      url = '/info/assets/guias/manual Telegram.pdf';
    }
    window.open(url, '_blank');
  }
}
