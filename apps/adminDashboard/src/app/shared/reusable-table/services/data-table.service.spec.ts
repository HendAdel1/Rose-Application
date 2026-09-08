import { describe, it, expect, beforeEach } from 'vitest';
import { DataTableService } from './data-table.service';
import { Column } from '../models/table-column.model';

interface TestItem extends Record<string, unknown> {
  id: string;
  name: string;
  category: string;
  price: number;
}

describe('DataTableService Search Filtering', () => {
  let service: DataTableService<TestItem>;

  const mockData: TestItem[] = [
    { id: '1', name: 'Red Rose Bouquet', category: 'Flowers', price: 150 },
    { id: '2', name: 'White Lily Vase', category: 'Plants', price: 220 },
    { id: '3', name: 'Pink Tulip Bunch', category: 'Flowers', price: 180 },
  ];

  const mockColumns: Column<TestItem>[] = [
    { field: 'name', header: 'Name', type: 'text', sort: true },
    { field: 'category', header: 'Category', type: 'text', sort: true },
    { field: 'price', header: 'Price', type: 'formatted', sort: true },
  ];

  beforeEach(() => {
    service = new DataTableService<TestItem>();
    service.setColumns(mockColumns);
    service.setData(mockData);
  });

  it('should return all rows when search term is empty', () => {
    expect(service.filteredData().length).toBe(3);
  });

  it('should filter rows matching search query case-insensitively', () => {
    service.setSearchTerm('rose');
    expect(service.filteredData().length).toBe(1);
    expect(service.filteredData()[0].name).toBe('Red Rose Bouquet');

    service.setSearchTerm('FLOWERS');
    expect(service.filteredData().length).toBe(2);
  });

  it('should filter rows by numeric or formatted value', () => {
    service.setSearchTerm('220');
    expect(service.filteredData().length).toBe(1);
    expect(service.filteredData()[0].name).toBe('White Lily Vase');
  });

  it('should return empty array when no items match search query', () => {
    service.setSearchTerm('Nonexistent');
    expect(service.filteredData().length).toBe(0);
  });

  it('should restore all rows when clearSearch is called', () => {
    service.setSearchTerm('rose');
    expect(service.filteredData().length).toBe(1);

    service.clearSearch();
    expect(service.filteredData().length).toBe(3);
  });

  it('should support custom search predicate filter', () => {
    service.setSearchFilter((row, term) => row.id === term);
    service.setSearchTerm('2');

    expect(service.filteredData().length).toBe(1);
    expect(service.filteredData()[0].name).toBe('White Lily Vase');
  });

  it('should default pagination correctly and calculate totalPages', () => {
    expect(service.page()).toBe(1);
    expect(service.pageSize()).toBe(10);
    expect(service.totalRecords()).toBe(3);
    expect(service.totalPages()).toBe(1);
  });

  it('should reset page to 1 when search term changes or is cleared', () => {
    service.setPage(3);
    expect(service.page()).toBe(3);

    service.setSearchTerm('lily');
    expect(service.page()).toBe(1);

    service.setPage(2);
    expect(service.page()).toBe(2);

    service.clearSearch();
    expect(service.page()).toBe(1);
  });

  it('should support server-side pagination configuration', () => {
    let requestedPage = 0;
    let requestedSize = 0;

    service.enableServerSidePagination({
      pageSize: 20,
      initialPage: 1,
      totalRecordsSignal: () => 100,
      onPageChange: (page, size) => {
        requestedPage = page;
        requestedSize = size;
      },
    });

    expect(service.isServerSide()).toBe(true);
    expect(service.pageSize()).toBe(20);
    expect(service.totalRecords()).toBe(100);
    expect(service.totalPages()).toBe(5);

    service.setPage(3);
    expect(service.page()).toBe(3);
    expect(requestedPage).toBe(3);
    expect(requestedSize).toBe(20);
  });
});
