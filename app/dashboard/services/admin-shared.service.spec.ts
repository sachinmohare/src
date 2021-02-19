import { TestBed } from '@angular/core/testing';

import { AdminSharedService } from './admin-shared.service';

describe('AdminSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminSharedService = TestBed.get(AdminSharedService);
    expect(service).toBeTruthy();
  });
});
