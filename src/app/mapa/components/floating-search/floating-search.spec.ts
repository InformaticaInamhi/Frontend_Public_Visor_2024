import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingSearch } from './floating-search';

describe('FloatingSearch', () => {
  let component: FloatingSearch;
  let fixture: ComponentFixture<FloatingSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
