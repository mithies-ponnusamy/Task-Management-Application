import { TestBed } from '@angular/core/testing';

import { DemoData } from './demo-data';

describe('DemoData', () => {
  let service: DemoData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
