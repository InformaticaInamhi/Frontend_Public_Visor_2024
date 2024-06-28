import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMarkerComponent } from './search-marker.component';

describe('SearchMarkerComponent', () => {
  let component: SearchMarkerComponent;
  let fixture: ComponentFixture<SearchMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMarkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
