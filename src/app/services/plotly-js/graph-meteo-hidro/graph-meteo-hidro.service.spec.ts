import { TestBed } from '@angular/core/testing';

import { GraphMeteoHidroService } from './graph-meteo-hidro.service';

describe('GraphMeteoHidroService', () => {
  let service: GraphMeteoHidroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphMeteoHidroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
