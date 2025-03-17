import { TestBed } from '@angular/core/testing';

import { PrecipitationGraphService } from './precipitation-graph.service';

describe('PrecipitationGraphService', () => {
  let service: PrecipitationGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecipitationGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
