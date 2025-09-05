import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoot } from './main-root';

describe('MainRoot', () => {
  let component: MainRoot;
  let fixture: ComponentFixture<MainRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRoot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
