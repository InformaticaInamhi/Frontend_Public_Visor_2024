import { TestBed } from '@angular/core/testing';

import { OpenLayerService } from './open-layer.service';

describe('OpenLayerService', () => {
  let service: OpenLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
