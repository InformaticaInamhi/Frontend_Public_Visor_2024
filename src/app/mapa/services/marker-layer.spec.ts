import { TestBed } from '@angular/core/testing';

import { MarkerLayer } from './marker-layer';

describe('MarkerLayer', () => {
  let service: MarkerLayer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerLayer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
