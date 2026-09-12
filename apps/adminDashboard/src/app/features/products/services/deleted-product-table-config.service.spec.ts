import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DeletedProductTableConfigService } from './deleted-product-table-config.service';

describe('DeletedProductTableConfigService', () => {
  let service: DeletedProductTableConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeletedProductTableConfigService],
    });
    service = TestBed.inject(DeletedProductTableConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default column configurations', () => {
    const cols = service.getDefaultColumns();
    expect(cols).toBeDefined();
    expect(cols.length).toBe(5);

    const fields = cols.map((c) => c.field);
    expect(fields).toContain('name');
    expect(fields).toContain('price');
    expect(fields).toContain('stock');
    expect(fields).toContain('deletedAt');
    expect(fields).toContain('actions');
  });

  it('should format deletedAt date properly', () => {
    const cols = service.getDefaultColumns();
    const deletedCol = cols.find((c) => c.field === 'deletedAt');
    expect(deletedCol?.formatter).toBeDefined();

    if (deletedCol?.formatter) {
      const formatted = deletedCol.formatter('2026-09-09T09:56:14.504Z', {} as never);
      expect(formatted).not.toBe('-');
      expect(deletedCol.formatter(null, {} as never)).toBe('-');
      expect(deletedCol.formatter(undefined, {} as never)).toBe('-');
    }
  });
});
