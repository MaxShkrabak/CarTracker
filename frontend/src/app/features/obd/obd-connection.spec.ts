import { TestBed } from '@angular/core/testing';

import { ObdConnection } from './obd-connection';

describe('ObdConnection', () => {
  let service: ObdConnection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObdConnection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
