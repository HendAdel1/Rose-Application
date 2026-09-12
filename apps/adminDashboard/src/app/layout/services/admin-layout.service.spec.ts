import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminLayoutService } from './admin-layout.service';

describe('AdminLayoutService', () => {
  let service: AdminLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminLayoutService],
    });
    service = TestBed.inject(AdminLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle sidebar open state', () => {
    expect(service.sidebarOpen()).toBe(false);

    service.toggleSidebar();
    expect(service.sidebarOpen()).toBe(true);

    service.closeSidebar();
    expect(service.sidebarOpen()).toBe(false);

    service.openSidebar();
    expect(service.sidebarOpen()).toBe(true);
  });

  it('should set and clear custom title', () => {
    expect(service.customTitle()).toBeNull();

    service.setCustomTitle('Update Product: Test');
    expect(service.customTitle()).toBe('Update Product: Test');

    service.clearCustomTitle();
    expect(service.customTitle()).toBeNull();
  });
});
