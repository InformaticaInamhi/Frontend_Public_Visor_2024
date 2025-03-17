import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkerService } from '../../../services/openlayer/marker/marker.service';
import { OpenLayerService } from '../../../services/openlayer/open-layer.service';

import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-search-marker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,

    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-marker.component.html',
  styleUrl: './search-marker.component.css',
})
export class SearchMarkerComponent implements OnInit, AfterViewInit {
  @ViewChild('stationInput') stationInput!: ElementRef;

  //search marker
  suggestions: any[] = [];
  selectedCode: string = '';
  existStations: boolean = false;
  activeSuggestionIndex: number = -1;

  constructor(
    private openLayerService: OpenLayerService,
    private markerService: MarkerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.focusSearchInput();
  }

  updateSuggestions(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedCode = '';
    this.activeSuggestionIndex = -1;

    if (value.length > 2) {
      this.selectedCode = value.toLocaleUpperCase();
      this.suggestions = this.markerService.findMarkersByPartialCode(
        this.selectedCode
      );
      this.existStations = this.suggestions.length === 0;
    } else {
      this.suggestions = [];
    }
  }

  searchSelectedMarker(): void {
    this.searchMarker(this.selectedCode);
  }

  selectSuggestion(code: string): void {
    this.selectedCode = code;
    this.suggestions = [];
    this.searchMarker(code);
  }

  searchMarker(code: string): void {
    const map = this.openLayerService.getMap();
    const foundOverlay = this.markerService.findMarkerByCode(code);
    if (foundOverlay) {
      map.getView().animate({
        center: foundOverlay.getPosition(),
        zoom: 12,
        duration: 1000,
      });
    } else {
      console.log('Marker not found');
    }
  }

  // Método que llamas cuando haces clic en buscar estaciones
  focusSearchInput() {
    setTimeout(() => {
      this.stationInput.nativeElement.focus();
      this.cdr.detectChanges(); // Forzamos la detección de cambios
    }, 0);
  }

  onSearchStations() {
    this.focusSearchInput();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && this.suggestions.length > 0) {
      this.activeSuggestionIndex =
        (this.activeSuggestionIndex + 1) % this.suggestions.length;
    } else if (event.key === 'ArrowUp' && this.suggestions.length > 0) {
      this.activeSuggestionIndex =
        (this.activeSuggestionIndex + this.suggestions.length - 1) %
        this.suggestions.length;
    } else if (event.key === 'Enter' && this.activeSuggestionIndex >= 0) {
      this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]);
    }
  }
}
