import { TestBed } from '@angular/core/testing';

import { PlotlyMultipleGraph } from './plotly-multiple-graph';

describe('PlotlyMultipleGraph', () => {
  let service: PlotlyMultipleGraph;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlotlyMultipleGraph);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
