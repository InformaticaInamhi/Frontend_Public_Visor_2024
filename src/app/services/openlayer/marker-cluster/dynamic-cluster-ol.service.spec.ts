import { TestBed } from '@angular/core/testing';

import { DynamicClusterOlService } from './dynamic-cluster-ol.service';

describe('DynamicClusterOlService', () => {
  let service: DynamicClusterOlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicClusterOlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
