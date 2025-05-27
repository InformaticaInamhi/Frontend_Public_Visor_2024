import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoHidroComponent } from './meteo-hidro.component';

describe('MeteoHidroComponent', () => {
  let component: MeteoHidroComponent;
  let fixture: ComponentFixture<MeteoHidroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeteoHidroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeteoHidroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
