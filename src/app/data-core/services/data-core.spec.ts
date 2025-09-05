import { TestBed } from '@angular/core/testing';

import { DataCore } from './data-core';

describe('DataCore', () => {
  let service: DataCore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
