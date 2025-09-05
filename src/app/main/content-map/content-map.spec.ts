import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMap } from './content-map';

describe('ContentMap', () => {
  let component: ContentMap;
  let fixture: ComponentFixture<ContentMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
