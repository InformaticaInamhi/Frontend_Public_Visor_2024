import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaMain } from './mapa-main';

describe('MapaMain', () => {
  let component: MapaMain;
  let fixture: ComponentFixture<MapaMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
