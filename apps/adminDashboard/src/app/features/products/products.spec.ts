import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { Products } from './products';

describe('Products Component', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        provideToastr(),
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      PRODUCTS: {
        TITLE: 'All Products',
        ADD_PRODUCT: 'Add a new product',
        COLUMNS: {
          NAME: 'Name',
          PRODUCT: 'Product',
          PRODUCTS: 'Products',
          PRICE: 'Price',
          STOCK: 'Stock',
          SALES: 'Sales',
          RATINGS: 'Ratings',
          ACTIONS: 'Actions',
        },
      },
    });
    translateService.use('en');

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create Products component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the All Products title with translation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.products-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe('All Products');
  });

  it('should render the Add a new product button with icon and translation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('.add-product-btn');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement?.textContent?.trim()).toContain('Add a new product');

    const iconElement = buttonElement?.querySelector('svg');
    expect(iconElement).toBeTruthy();
  });

  it('should trigger onAddProduct when clicking the Add button', () => {
    const spy = vi.spyOn(component, 'onAddProduct');
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('.add-product-btn') as HTMLButtonElement;
    expect(buttonElement).toBeTruthy();

    buttonElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render the reusable table component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tableElement = compiled.querySelector('app-reusable-table');
    expect(tableElement).toBeTruthy();
  });

  it('should update texts when switching to Arabic language', async () => {
    translateService.setTranslation('ar', {
      PRODUCTS: {
        TITLE: 'جميع المنتجات',
        ADD_PRODUCT: 'إضافة منتج جديد',
        COLUMNS: {
          NAME: 'الاسم',
          PRODUCT: 'المنتج',
          PRODUCTS: 'المنتجات',
          PRICE: 'السعر',
          STOCK: 'المخزون',
          SALES: 'المبيعات',
          RATINGS: 'التقييمات',
          ACTIONS: 'الإجراءات',
        },
      },
    });
    translateService.use('ar');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.products-title');
    const buttonElement = compiled.querySelector('.add-product-btn');

    expect(titleElement?.textContent?.trim()).toBe('جميع المنتجات');
    expect(buttonElement?.textContent?.trim()).toContain('إضافة منتج جديد');
  });
});
