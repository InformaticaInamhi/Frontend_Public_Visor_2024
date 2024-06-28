import { Component, OnInit } from '@angular/core';

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
export class SearchMarkerComponent implements OnInit {
  //search marker
  suggestions: any[] = [];
  selectedCode: string = '';
  existStations: boolean = false;

  constructor(
    private openLayerService: OpenLayerService,
    private markerService: MarkerService
  ) {}

  ngOnInit(): void {}

  updateSuggestions(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.selectedCode = '';

    if (value.length > 2) {
      this.selectedCode = value.toLocaleUpperCase();
      const map = this.openLayerService.getMap();
      this.suggestions = this.markerService.findMarkersByPartialCode(
        this.selectedCode
      );
      if (this.suggestions.length > 0) {
        this.existStations = false;
      } else {
        this.existStations = true;
      }
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
}
