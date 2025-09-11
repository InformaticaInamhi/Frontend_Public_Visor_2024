import { TestBed } from '@angular/core/testing';

import { PlotlyConvencionalesGraph } from './plotly-convencionales-graph';

describe('PlotlyConvencionalesGraph', () => {
  let service: PlotlyConvencionalesGraph;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlotlyConvencionalesGraph);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
