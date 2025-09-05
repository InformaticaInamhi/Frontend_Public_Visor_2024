import { TestBed } from '@angular/core/testing';

import { PointObservation } from './point-observation';

describe('PointObservation', () => {
  let service: PointObservation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointObservation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
