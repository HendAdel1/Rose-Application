import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TableData } from './table-data';
import { DataTableService } from '../../services/data-table.service';
import { Column } from '../../models/table-column.model';
import { TableAction } from '../../models/table-action.model';

interface TestItem extends Record<string, unknown> {
  id: string;
  name: string;
  price: number;
  description: string;
}

describe('TableData Component', () => {
  let component: TableData<TestItem>;
  let fixture: ComponentFixture<TableData<TestItem>>;
  let translateService: TranslateService;
  let dataTableService: DataTableService<TestItem>;

  const mockColumns: Column<TestItem>[] = [
    { field: 'name', header: 'COL.NAME', sort: true, type: 'text' },
    { field: 'price', header: 'COL.PRICE', sort: true, type: 'formatted', formatter: (val) => `$${val}` },
    { field: 'description', header: 'COL.DESC', type: 'composite', compositeKeys: ['description'], compositeTemplate: '<b>{0}</b>' },
    { key: 'actions', header: 'COL.ACTIONS', type: 'actions' },
  ];

  const mockData: TestItem[] = [
    { id: '1', name: 'Red Rose', price: 25, description: 'Fresh red rose' },
    { id: '2', name: 'White Tulip', price: 15, description: 'Lovely tulip' },
  ];

  const mockActions: TableAction<TestItem>[] = [
    { label: 'Edit', icon: 'lucidePencil', styleClass: 'edit-btn' },
    { label: 'Delete', icon: 'lucideTrash2', styleClass: 'delete-btn' },
  ];

  beforeEach(async () => {
    dataTableService = new DataTableService<TestItem>();

    await TestBed.configureTestingModule({
      imports: [TableData],
      providers: [
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: DataTableService, useValue: dataTableService },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      COL: {
        NAME: 'Product Name',
        PRICE: 'Price',
        DESC: 'Description',
        ACTIONS: 'Actions',
      },
      TABLE: {
        NO_RECORDS: 'No records found',
        ACTIONS: {
          OPTIONS: 'Options',
          EDIT: 'Edit',
          DELETE: 'Delete',
        },
      },
      Edit: 'Edit',
      Delete: 'Delete',
    });
    translateService.use('en');

    fixture = TestBed.createComponent(TableData<TestItem>);
    component = fixture.componentInstance;
  });

  it('should create TableData component', () => {
    expect(component).toBeTruthy();
  });

  it('should render column headers with translations', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const thElements = compiled.querySelectorAll('th');
    expect(thElements.length).toBe(4);
    expect(thElements[0].textContent?.trim()).toContain('Product Name');
    expect(thElements[1].textContent?.trim()).toContain('Price');
  });

  it('should cycle sorting order on sortable column click (asc -> desc -> none)', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    // Initial state: no sort
    expect(component.currentSortField()).toBeNull();
    expect(component.currentSortOrder()).toBe(0);

    // 1st click: Ascending (1)
    component.onSortClick('name');
    expect(component.currentSortField()).toBe('name');
    expect(component.currentSortOrder()).toBe(1);

    // 2nd click: Descending (-1)
    component.onSortClick('name');
    expect(component.currentSortField()).toBe('name');
    expect(component.currentSortOrder()).toBe(-1);

    // 3rd click: Reset to none (0)
    component.onSortClick('name');
    expect(component.currentSortField()).toBeNull();
    expect(component.currentSortOrder()).toBe(0);
  });

  it('should render table rows with text, formatted, and composite cells', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const bodyRows = compiled.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBe(2);

    // Formatted cell value
    expect(bodyRows[0].textContent).toContain('$25');
    // Composite innerHTML cell
    const boldEl = bodyRows[0].querySelector('b');
    expect(boldEl?.textContent).toBe('Fresh red rose');
  });

  it('should apply custom row styles via rowStyleFn', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('rowStyleFn', (row: TestItem) =>
      row.price > 20 ? { 'background-color': 'rgb(255, 240, 240)' } : {}
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const rowStyle = component.resolveRowStyle(mockData[0]);
    expect(rowStyle['background-color']).toBe('rgb(255, 240, 240)');
  });

  it('should render desktop action buttons and emit actionClicked when clicked', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('actions', mockActions);
    fixture.detectChanges();
    await fixture.whenStable();

    const emitSpy = vi.fn();
    component.actionClicked.subscribe(emitSpy);

    const compiled = fixture.nativeElement as HTMLElement;
    const editButtons = compiled.querySelectorAll('.edit-btn');
    expect(editButtons.length).toBeGreaterThan(0);

    const firstEditBtn = editButtons[0] as HTMLButtonElement;
    firstEditBtn.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'Edit',
        row: mockData[0],
        rowIndex: 0,
      })
    );
  });

  it('should render empty state message when data array is empty', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('emptyMessage', 'TABLE.NO_RECORDS');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyTitle = compiled.querySelector('.empty-state-title');
    expect(emptyTitle).toBeTruthy();
    expect(emptyTitle?.textContent?.trim()).toBe('No records found');
  });

  it('should render loading spinner when loading is true', async () => {
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.effectiveLoading()).toBe(true);
  });

  it('should synchronize columns, data, and actions from DataTableService', async () => {
    dataTableService.setColumns(mockColumns);
    dataTableService.setData(mockData);
    dataTableService.setActions(mockActions);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.effectiveColumns().length).toBe(4);
    expect(component.effectiveData().length).toBe(2);
    expect(component.effectiveActions().length).toBe(2);
  });

  it('should trim text longer than 20 characters and configure tooltip', async () => {
    const longNameItem: TestItem = {
      id: '99',
      name: 'Super Long Product Name That Exceeds Limit',
      price: 100,
      description: 'Test description',
    };

    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', [longNameItem]);
    fixture.detectChanges();
    await fixture.whenStable();

    const nameCol = mockColumns[0];
    const fullText = longNameItem.name;
    expect(fullText.length).toBeGreaterThan(20);

    // formatCellText should trim to 20 chars + '...'
    const trimmedText = component.formatCellText(longNameItem, nameCol);
    expect(trimmedText).toBe(`${fullText.slice(0, 20)}...`);
    expect(trimmedText.length).toBe(23);

    // isTrimmed should be true
    expect(component.isTrimmed(longNameItem, nameCol)).toBe(true);

    // getTooltip should return full untrimmed text
    expect(component.getTooltip(longNameItem, nameCol)).toBe(fullText);

    // DOM should render trimmed text
    const compiled = fixture.nativeElement as HTMLElement;
    const firstCell = compiled.querySelector('tbody tr td span');
    expect(firstCell?.textContent?.trim()).toBe(`${fullText.slice(0, 20)}...`);
  });

  it('should NOT trim text with 20 or fewer characters and disable tooltip', () => {
    const shortItem: TestItem = {
      id: '1',
      name: 'Exactly 20 chars____',
      price: 10,
      description: 'Short',
    };
    expect(shortItem.name.length).toBe(20);

    const nameCol = mockColumns[0];
    expect(component.formatCellText(shortItem, nameCol)).toBe('Exactly 20 chars____');
    expect(component.isTrimmed(shortItem, nameCol)).toBe(false);
    expect(component.getTooltip(shortItem, nameCol)).toBeUndefined();
  });
});
