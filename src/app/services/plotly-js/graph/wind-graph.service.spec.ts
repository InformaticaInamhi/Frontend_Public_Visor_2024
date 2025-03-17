import { TestBed } from '@angular/core/testing';

import { WindGraphService } from './wind-graph.service';

describe('WindGraphService', () => {
  let service: WindGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
