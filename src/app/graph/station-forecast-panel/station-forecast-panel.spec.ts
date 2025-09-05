import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationForecastPanel } from './station-forecast-panel';

describe('StationForecastPanel', () => {
  let component: StationForecastPanel;
  let fixture: ComponentFixture<StationForecastPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationForecastPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationForecastPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
