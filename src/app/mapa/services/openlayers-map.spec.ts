import { TestBed } from '@angular/core/testing';

import { OpenlayersMap } from './openlayers-map';

describe('OpenlayersMap', () => {
  let service: OpenlayersMap;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenlayersMap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
