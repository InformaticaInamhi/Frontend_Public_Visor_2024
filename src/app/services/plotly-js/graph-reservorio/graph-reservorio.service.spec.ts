import { TestBed } from '@angular/core/testing';

import { GraphReservorioService } from './graph-reservorio.service';

describe('GraphReservorioService', () => {
  let service: GraphReservorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphReservorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
