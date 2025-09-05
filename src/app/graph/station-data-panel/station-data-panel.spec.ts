import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDataPanel } from './station-data-panel';

describe('StationDataPanel', () => {
  let component: StationDataPanel;
  let fixture: ComponentFixture<StationDataPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationDataPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationDataPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
