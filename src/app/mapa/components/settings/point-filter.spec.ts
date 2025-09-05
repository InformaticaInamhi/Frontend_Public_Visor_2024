import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointFilter } from '../point-filter';

describe('PointFilter', () => {
  let component: PointFilter;
  let fixture: ComponentFixture<PointFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
