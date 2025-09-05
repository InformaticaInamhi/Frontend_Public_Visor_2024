import { TestBed } from '@angular/core/testing';

import { Geodata } from './geodata';

describe('Geodata', () => {
  let service: Geodata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geodata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
