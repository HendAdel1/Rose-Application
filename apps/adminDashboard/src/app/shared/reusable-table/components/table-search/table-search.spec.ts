import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TableSearch } from './table-search';
import { DataTableService } from '../../services/data-table.service';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

describe('TableSearch', () => {
  let component: TableSearch;
  let fixture: ComponentFixture<TableSearch>;
  let dataTableService: DataTableService;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSearch],
      providers: [
        DataTableService,
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      TABLE: {
        SEARCH_PLACEHOLDER: 'Search...',
      },
      CUSTOM: {
        SEARCH: 'Filter items...',
      },
    });
    translateService.use('en');

    fixture = TestBed.createComponent(TableSearch);
    component = fixture.componentInstance;
    dataTableService = TestBed.inject(DataTableService);
    await fixture.whenStable();
  });

  it('should create TableSearch component', () => {
    expect(component).toBeTruthy();
  });

  it('should update search term in DataTableService and emit searchChange when user types', () => {
    const searchSpy = vi.fn();
    component.searchChange.subscribe(searchSpy);

    const inputEl = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputEl.value = 'Rose';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(dataTableService.searchTerm()).toBe('Rose');
    expect(component.currentSearchTerm()).toBe('Rose');
    expect(searchSpy).toHaveBeenCalledWith('Rose');
  });

  it('should render clear button when search term is present and clear on click', async () => {
    const inputEl = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputEl.value = 'Rose';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    let clearBtn = fixture.nativeElement.querySelector('.table-search-clear-btn');
    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dataTableService.searchTerm()).toBe('');
    expect(component.currentSearchTerm()).toBe('');
    clearBtn = fixture.nativeElement.querySelector('.table-search-clear-btn');
    expect(clearBtn).toBeNull();
  });

  it('should clear search term when Escape key is pressed', async () => {
    const inputEl = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputEl.value = 'Rose';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dataTableService.searchTerm()).toBe('');
    expect(component.currentSearchTerm()).toBe('');
  });

  it('should support standalone two-way searchQuery model binding without DataTableService', async () => {
    const standaloneFixture = TestBed.createComponent(TableSearch);
    const standaloneComp = standaloneFixture.componentInstance;
    standaloneFixture.componentRef.setInput('searchQuery', 'Tulip');
    standaloneFixture.detectChanges();
    await standaloneFixture.whenStable();

    expect(standaloneComp.currentSearchTerm()).toBe('Tulip');

    const clearBtn = standaloneFixture.nativeElement.querySelector('.table-search-clear-btn');
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    standaloneFixture.detectChanges();

    expect(standaloneComp.searchQuery()).toBe('');
  });

  it('should render custom placeholder input when set', async () => {
    fixture.componentRef.setInput('placeholder', 'CUSTOM.SEARCH');
    fixture.detectChanges();
    await fixture.whenStable();

    const inputEl = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(inputEl.getAttribute('placeholder')).toBe('Filter items...');
  });
});
