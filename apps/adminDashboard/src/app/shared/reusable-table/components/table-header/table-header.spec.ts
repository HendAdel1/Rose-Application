import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TableHeader } from './table-header';

@Component({
  imports: [TableHeader],
  template: `
    <app-table-header [title]="'PRODUCTS.TITLE'" [actionLabel]="'PRODUCTS.ADD_PRODUCT'">
      <button header-actions class="custom-export-btn" type="button">Export</button>
      <span class="custom-footer-note">Note</span>
    </app-table-header>
  `,
})
class TestHostComponent {}

describe('TableHeader Component', () => {
  let component: TableHeader;
  let fixture: ComponentFixture<TableHeader>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeader, TestHostComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      PRODUCTS: {
        TITLE: 'All Products',
        ADD_PRODUCT: 'Add a new product',
        ADD_PRODUCT_ARIA: 'Add product to catalogue',
      },
      CATEGORIES: {
        TITLE: 'Categories',
        ADD_CATEGORY: 'Add Category',
      },
    });
    translateService.use('en');

    fixture = TestBed.createComponent(TableHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
  });

  it('should create TableHeader component', () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the title with translation', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.table-header-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe('All Products');
  });

  it('should render the action button with icon and translated text when actionLabel is set', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('.table-header-action-btn');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement?.textContent?.trim()).toContain('Add a new product');

    const iconElement = buttonElement?.querySelector('svg');
    expect(iconElement).toBeTruthy();
  });

  it('should emit actionClick when the action button is clicked', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.detectChanges();
    await fixture.whenStable();

    const emitSpy = vi.fn();
    component.actionClick.subscribe(emitSpy);

    const buttonElement = fixture.nativeElement.querySelector(
      '.table-header-action-btn'
    ) as HTMLButtonElement;
    expect(buttonElement).toBeTruthy();

    buttonElement.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should not render the action button when actionLabel is empty', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', '');
    fixture.detectChanges();
    await fixture.whenStable();

    const buttonElement = fixture.nativeElement.querySelector('.table-header-action-btn');
    expect(buttonElement).toBeNull();
  });

  it('should hide action button when showAction is false even if actionLabel is provided', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.componentRef.setInput('showAction', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const buttonElement = fixture.nativeElement.querySelector('.table-header-action-btn');
    expect(buttonElement).toBeNull();
  });

  it('should hide the icon when showIcon is false', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.componentRef.setInput('showIcon', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const iconElement = fixture.nativeElement.querySelector('.table-header-action-btn svg');
    expect(iconElement).toBeNull();
  });

  it('should disable action button when actionDisabled is true', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.componentRef.setInput('actionDisabled', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const buttonElement = fixture.nativeElement.querySelector(
      '.table-header-action-btn'
    ) as HTMLButtonElement;
    expect(buttonElement.disabled).toBe(true);
  });

  it('should apply custom titleClass and actionButtonClass', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.componentRef.setInput('titleClass', 'custom-title-class');
    fixture.componentRef.setInput('actionButtonClass', 'custom-btn-class');
    fixture.detectChanges();
    await fixture.whenStable();

    const titleElement = fixture.nativeElement.querySelector('.table-header-title');
    const buttonElement = fixture.nativeElement.querySelector('.table-header-action-btn');

    expect(titleElement.classList.contains('custom-title-class')).toBe(true);
    expect(buttonElement.classList.contains('custom-btn-class')).toBe(true);
  });

  it('should use actionAriaLabel when specified, or fall back to actionLabel', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');
    fixture.componentRef.setInput('actionAriaLabel', 'PRODUCTS.ADD_PRODUCT_ARIA');
    fixture.detectChanges();
    await fixture.whenStable();

    const buttonElement = fixture.nativeElement.querySelector(
      '.table-header-action-btn'
    ) as HTMLButtonElement;
    expect(buttonElement.getAttribute('aria-label')).toBe('Add product to catalogue');
  });

  it('should render projected content in header-actions and default slot', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const customExportBtn = compiled.querySelector('.custom-export-btn');
    const customNote = compiled.querySelector('.custom-footer-note');

    expect(customExportBtn).toBeTruthy();
    expect(customExportBtn?.textContent?.trim()).toBe('Export');
    expect(customNote).toBeTruthy();
    expect(customNote?.textContent?.trim()).toBe('Note');
  });

  it('should update texts when switching to Arabic language', async () => {
    fixture.componentRef.setInput('title', 'PRODUCTS.TITLE');
    fixture.componentRef.setInput('actionLabel', 'PRODUCTS.ADD_PRODUCT');

    translateService.setTranslation('ar', {
      PRODUCTS: {
        TITLE: 'جميع المنتجات',
        ADD_PRODUCT: 'إضافة منتج جديد',
      },
    });
    translateService.use('ar');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.table-header-title');
    const buttonElement = compiled.querySelector('.table-header-action-btn');

    expect(titleElement?.textContent?.trim()).toBe('جميع المنتجات');
    expect(buttonElement?.textContent?.trim()).toContain('إضافة منتج جديد');
  });
});
