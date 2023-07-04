import { TestBed } from '@angular/core/testing';

import { EncylopediaService } from './encylopedia.service';

describe('EncylopediaService', () => {
  let service: EncylopediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncylopediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
