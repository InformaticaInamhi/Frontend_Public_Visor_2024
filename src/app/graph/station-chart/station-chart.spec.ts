import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationChart } from './station-chart';

describe('StationChart', () => {
  let component: StationChart;
  let fixture: ComponentFixture<StationChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
