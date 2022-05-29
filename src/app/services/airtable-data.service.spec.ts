import { TestBed } from '@angular/core/testing';

import { AirtableDataService } from './airtable-data.service';

describe('AirtableDataService', () => {
  let service: AirtableDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirtableDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
