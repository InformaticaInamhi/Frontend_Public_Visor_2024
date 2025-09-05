import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastPanel } from './forecast-panel';

describe('ForecastPanel', () => {
  let component: ForecastPanel;
  let fixture: ComponentFixture<ForecastPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
