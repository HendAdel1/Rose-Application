import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePagination } from './table-pagination';
import { DataTableService } from '../../services/data-table.service';
import { TablePageChangeEvent } from '../../models/table-pagination.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TablePagination', () => {
  let component: TablePagination;
  let fixture: ComponentFixture<TablePagination>;
  let dataTableService: DataTableService;

  beforeEach(async () => {
    dataTableService = new DataTableService();

    await TestBed.configureTestingModule({
      imports: [TablePagination],
      providers: [{ provide: DataTableService, useValue: dataTableService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create TablePagination component', () => {
    expect(component).toBeTruthy();
  });

  it('should synchronize reactive signals from DataTableService', () => {
    dataTableService.setTotalRecords(50);
    dataTableService.setPageSize(10);
    dataTableService.setPage(2);

    expect(component.currentPage()).toBe(2);
    expect(component.currentPageSize()).toBe(10);
    expect(component.currentTotalRecords()).toBe(50);
    expect(component.totalPages()).toBe(5);
    expect(component.first()).toBe(10);
    expect(component.showPaginator()).toBe(true);
  });

  it('should generate Figma pagination items [1, 2, 3, "...", 10] when on page 1 of 10', () => {
    dataTableService.setTotalRecords(100);
    dataTableService.setPageSize(10);
    dataTableService.setPage(1);

    const items = component.paginationItems();
    expect(items.length).toBe(5);
    expect(items.map((i) => i.display)).toEqual(['1', '2', '3', '...', '10']);
    expect(items[0].isActive).toBe(true);
    expect(items[3].isEllipsis).toBe(true);
    expect(items[3].type).toBe('ellipsis-next');
  });

  it('should navigate to next page and emit pageChange on goToNext', () => {
    dataTableService.setTotalRecords(50);
    dataTableService.setPageSize(10);
    dataTableService.setPage(1);

    let emitted: TablePageChangeEvent | undefined;
    component.pageChange.subscribe((e) => (emitted = e));

    component.goToNext();

    expect(dataTableService.page()).toBe(2);
    expect(emitted?.page).toBe(2);
    expect(emitted?.first).toBe(10);
  });

  it('should navigate to previous page on goToPrev', () => {
    dataTableService.setTotalRecords(50);
    dataTableService.setPageSize(10);
    dataTableService.setPage(3);

    let emitted: TablePageChangeEvent | undefined;
    component.pageChange.subscribe((e) => (emitted = e));

    component.goToPrev();

    expect(dataTableService.page()).toBe(2);
    expect(emitted?.page).toBe(2);
    expect(emitted?.first).toBe(10);
  });

  it('should navigate to first and last page via goToFirst and goToLast', () => {
    dataTableService.setTotalRecords(100);
    dataTableService.setPageSize(10);
    dataTableService.setPage(5);

    component.goToLast();
    expect(dataTableService.page()).toBe(10);

    component.goToFirst();
    expect(dataTableService.page()).toBe(1);
  });

  it('should disable first/prev buttons on page 1 and next/last on the last page', () => {
    dataTableService.setTotalRecords(50);
    dataTableService.setPageSize(10);
    dataTableService.setPage(1);

    expect(component.isFirstDisabled()).toBe(true);
    expect(component.isLastDisabled()).toBe(false);

    dataTableService.setPage(5);
    expect(component.isFirstDisabled()).toBe(false);
    expect(component.isLastDisabled()).toBe(true);
  });

  it('should navigate to target page when page button is clicked', () => {
    dataTableService.setTotalRecords(50);
    dataTableService.setPageSize(10);
    dataTableService.setPage(1);

    const items = component.paginationItems();
    const page2Item = items.find((i) => i.value === 2);
    expect(page2Item).toBeDefined();

    if (page2Item) {
      component.handleItemClick(page2Item);
    }
    expect(dataTableService.page()).toBe(2);
  });

  it('should navigate to target page when ellipsis button is clicked', () => {
    dataTableService.setTotalRecords(100);
    dataTableService.setPageSize(10);
    dataTableService.setPage(1);

    const ellipsisItem = component.paginationItems().find((i) => i.isEllipsis);
    expect(ellipsisItem).toBeDefined();

    if (ellipsisItem) {
      component.handleItemClick(ellipsisItem);
    }
    expect(dataTableService.page()).toBe(4);
  });

  it('should hide paginator when total pages is 1 and alwaysShow is false', () => {
    dataTableService.setTotalRecords(5);
    dataTableService.setPageSize(10);

    expect(component.totalPages()).toBe(1);
    expect(component.showPaginator()).toBe(false);
  });

  it('should toggle first and last buttons when showFirstLastIcon is toggled', async () => {
    dataTableService.setTotalRecords(100);
    dataTableService.setPageSize(10);
    dataTableService.setPage(2);
    fixture.componentRef.setInput('showFirstLastIcon', true);
    fixture.detectChanges();
    await fixture.whenStable();

    let firstBtn = fixture.nativeElement.querySelector('.p-paginator-first');
    let lastBtn = fixture.nativeElement.querySelector('.p-paginator-last');
    expect(firstBtn).toBeTruthy();
    expect(lastBtn).toBeTruthy();

    fixture.componentRef.setInput('showFirstLastIcon', false);
    fixture.detectChanges();
    await fixture.whenStable();

    firstBtn = fixture.nativeElement.querySelector('.p-paginator-first');
    lastBtn = fixture.nativeElement.querySelector('.p-paginator-last');
    expect(firstBtn).toBeNull();
    expect(lastBtn).toBeNull();
  });
});
