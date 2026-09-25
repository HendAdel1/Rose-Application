import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from '../services/product.service';
import { ProductApiItem } from '../models/product-api.model';
import { ProductsForm } from './products-form';

describe('ProductsForm Component', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;
  let translateService: TranslateService;

  const mockProduct: ProductApiItem = {
    id: '1c8ab7ca-7535-4063-9906-b2f5e7eae511',
    title: 'Best Mum Floral Basket',
    description: 'A thoughtful floral gift',
    rating: 0,
    ratings: 0,
    stock: 16,
    price: '1310',
    discountType: 'PERCENT',
    discountValue: '15',
    cover: 'https://rose-app.elevate-bootcamp.cloud/storage/cover.png',
    gallery:
      '["https://rose-app.elevate-bootcamp.cloud/storage/gallery1.png", "https://rose-app.elevate-bootcamp.cloud/storage/gallery2.png"]',
    categoryId: '799bab5d-6133-412c-8353-cf776467e3be',
    subCategoryId: null,
    immutable: false,
    deletedAt: null,
    createdAt: '2026-09-09T23:20:36.130Z',
    updatedAt: '2026-09-09T23:20:36.130Z',
    category: {
      id: '799bab5d-6133-412c-8353-cf776467e3be',
      title: 'flower',
    },
    subCategory: null,
    occasions: [],
    _count: { reviews: 0, cartItems: 0, wishlistItems: 0, orderItems: 0 },
  };

  const setupTestBed = async (routeId: string | null = null) => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? routeId : null),
              },
            },
          },
        },
        {
          provide: ToastrService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
            warning: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      DASHBOARD: {
        TITLE: 'Dashboard',
        PRODUCTS: 'Products',
      },
      ADMIN_PRODUCTS: {
        ADD_TITLE: 'Add a New Product',
        UPDATE_TITLE_PREFIX: 'Update Product: ',
        ADD_BREADCRUMB: 'Add Product',
        UPDATE_BREADCRUMB_PREFIX: 'Update Product: ',
        TITLE_LABEL: 'Title',
        TITLE_PLACEHOLDER: 'Enter product title',
        TITLE_REQUIRED: 'Product title is required',
        DESCRIPTION_LABEL: 'Description',
        DESCRIPTION_PLACEHOLDER: 'Enter product description',
        DESCRIPTION_REQUIRED: 'Product description is required',
        PRICE_LABEL: 'Price',
        PRICE_PLACEHOLDER: 'Example: 5000',
        PRICE_REQUIRED: 'Please enter a valid price',
        DISCOUNT_LABEL: 'Discount',
        DISCOUNT_PLACEHOLDER: 'Example: 5',
        PRICE_AFTER_DISCOUNT_LABEL: 'Price after discount',
        PRICE_AFTER_DISCOUNT_PLACEHOLDER: 'Example: 5',
        QUANTITY_LABEL: 'Quantity',
        QUANTITY_PLACEHOLDER: 'Example: 200',
        QUANTITY_REQUIRED: 'Product quantity is required',
        COVER_LABEL: 'Product cover image',
        COVER_REQUIRED: 'Product cover is required',
        GALLERY_LABEL: 'Product gallery',
        GALLERY_REQUIRED: 'Product gallery images are required',
        UPLOAD_FILE: 'Upload file',
        CATEGORY_LABEL: 'Category',
        CATEGORY_PLACEHOLDER: 'Select an option',
        CATEGORY_REQUIRED: 'Please select a category for the product',
        VIEW_COVER: 'View product cover',
        VIEW_GALLERY: 'View product gallery',
        COVER_MODAL_TITLE: 'Product Cover',
        GALLERY_MODAL_TITLE: 'Product Gallery',
        NO_COVER: 'No cover image available for this product.',
        NO_GALLERY: 'No gallery images available for this product.',
        CLOSE: 'Close',
        ADD_SUBMIT: 'Add Product',
        UPDATE_SUBMIT: 'Update Product',
        CREATE_SUCCESS: 'Product created successfully.',
        CREATE_ERROR: 'Unable to create product.',
        UPDATE_SUCCESS: 'Product updated successfully.',
        UPDATE_ERROR: 'Unable to update product.',
        LOAD_ERROR: 'Unable to load product.',
      },
      ADMIN_CATEGORIES: {
        LOADING: 'Loading product...',
      },
    });
    translateService.use('en');

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
  };

  describe('Add Mode', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create the ProductsForm component in add mode', () => {
      expect(component).toBeTruthy();
      expect(component.mode()).toBe('add');
    });

    it('should render the Add a New Product title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const titleEl = compiled.querySelector('.product-form-page__title');
      expect(titleEl).toBeTruthy();
      expect(titleEl?.textContent?.trim()).toBe('Add a New Product');
    });

    it('should render the DynamicForm component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dynamicForm = compiled.querySelector('lib-dynamic-form');
      expect(dynamicForm).toBeTruthy();
    });

    it('should configure gallery file field in add mode', () => {
      const config = component.formConfig();
      const galleryField = config.fields.find((f) => f.key === 'gallery');
      expect(galleryField).toBeTruthy();
      expect(galleryField?.type).toBe('file');
      expect(galleryField?.multiple).toBe(true);
    });

    it('should build formConfig with cover file field in add mode', () => {
      const config = component.formConfig();
      const coverField = config.fields.find((f) => f.key === 'cover');
      expect(coverField).toBeTruthy();
      expect(coverField?.type).toBe('file');
    });

    it('should build formConfig with correct submit label for add mode', () => {
      const config = component.formConfig();
      expect(config.submitLabel).toBe('Add Product');
    });

    it('should support multiple image file selection for gallery', () => {
      const config = component.formConfig();
      const galleryField = config.fields.find((f) => f.key === 'gallery');
      expect(galleryField?.multiple).toBe(true);
      expect(galleryField?.validators?.maxSizeMb).toBe(5);
    });

    it('should configure price-after-discount readonly field', () => {
      const config = component.formConfig();
      const discountField = config.fields.find(
        (f) => f.key === 'priceAfterDiscount',
      );
      expect(discountField).toBeTruthy();
      expect(discountField?.readonly).toBe(true);
    });

    it('should upload images and call productService.createProduct with correct payload on valid submit', () => {
      const productService = TestBed.inject(ProductService);
      const router = TestBed.inject(Router);
      const toastr = TestBed.inject(ToastrService);

      const navigateSpy = vi
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);
      const uploadSpy = vi
        .spyOn(productService, 'uploadImage')
        .mockImplementation((file: File) =>
          of(
            `https://rose-app.elevate-bootcamp.cloud/storage/${file.name}`,
          ),
        );

      const createProductSpy = vi
        .spyOn(productService, 'createProduct')
        .mockReturnValue(of(mockProduct));

      const coverFile = new File(['cover content'], 'cover.png', {
        type: 'image/png',
      });
      const galleryFile = new File(['gallery content'], 'gallery1.png', {
        type: 'image/png',
      });

      component.onSubmit({
        valid: true,
        value: {
          title: 'Best Mum Floral Basket',
          description: "A thoughtful floral gift arranged for Mother's Day.",
          price: 1310,
          discount: 15,
          quantity: 16,
          cover: coverFile,
          gallery: [galleryFile],
          categoryId: '799bab5d-6133-412c-8353-cf776467e3be',
        },
      });

      expect(uploadSpy).toHaveBeenCalledTimes(2);
      expect(createProductSpy).toHaveBeenCalledWith({
        title: 'Best Mum Floral Basket',
        description: "A thoughtful floral gift arranged for Mother's Day.",
        price: 1310,
        stock: 16,
        discountType: 'PERCENT',
        discountValue: 15,
        cover: 'https://rose-app.elevate-bootcamp.cloud/storage/cover.png',
        gallery: [
          'https://rose-app.elevate-bootcamp.cloud/storage/gallery1.png',
        ],
        categoryId: '799bab5d-6133-412c-8353-cf776467e3be',
      });

      expect(toastr.success).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/adminDashboard/products']);
    });

    it('should format backend validation errors in toastr on create error', () => {
      const productService = TestBed.inject(ProductService);
      const toastr = TestBed.inject(ToastrService);
      vi.spyOn(productService, 'uploadImage').mockReturnValue(
        of('https://image.url'),
      );

      vi.spyOn(productService, 'createProduct').mockReturnValue(
        throwError(() => ({
          status: false,
          code: 400,
          error: {
            message: 'Validation failed',
            errors: [
              { path: '', message: 'Unrecognized key: "occasions"' },
            ],
          },
        })),
      );

      const coverFile = new File([''], 'cover.png', { type: 'image/png' });
      const galleryFile = new File([''], 'gallery.png', { type: 'image/png' });

      component.onSubmit({
        valid: true,
        value: {
          title: 'Valid title',
          description: 'Valid description',
          price: 100,
          discount: null,
          quantity: 5,
          cover: coverFile,
          gallery: [galleryFile],
          categoryId: 'cat-id',
        },
      });

      expect(toastr.error).toHaveBeenCalledWith(
        'Unrecognized key: "occasions"',
      );
      expect(component.loading()).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    const productId = '1c8ab7ca-7535-4063-9906-b2f5e7eae511';

    beforeEach(async () => {
      await setupTestBed(productId);
    });

    it('should initialize in edit mode and fetch product by id', () => {
      const productService = TestBed.inject(ProductService);
      const getByIdSpy = vi
        .spyOn(productService, 'getProductById')
        .mockReturnValue(of(mockProduct));

      fixture.detectChanges();

      expect(component.mode()).toBe('edit');
      expect(component.productId()).toBe(productId);
      expect(getByIdSpy).toHaveBeenCalledWith(productId);
      expect(component.productTitle()).toBe('Best Mum Floral Basket');
      expect(component.existingCoverUrl()).toBe(mockProduct.cover);
      expect(component.existingGalleryUrls().length).toBe(2);
    });

    it('should populate initialValue with loaded product data', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      const initial = component.initialValue();
      expect(initial['title']).toBe('Best Mum Floral Basket');
      expect(initial['description']).toBe('A thoughtful floral gift');
      expect(initial['price']).toBe(1310);
      expect(initial['discount']).toBe(15);
      expect(initial['quantity']).toBe(16);
      expect(initial['categoryId']).toBe(
        '799bab5d-6133-412c-8353-cf776467e3be',
      );
    });

    it('should render Update Product heading', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const titleEl = compiled.querySelector('.product-form-page__title');
      expect(titleEl?.textContent?.trim()).toBe(
        'Update Product: Best Mum Floral Basket',
      );
    });

    it('should set page title and breadcrumb custom title with Update Product prefix', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      expect(component.pageTitle()).toBe(
        'Update Product: Best Mum Floral Basket',
      );
    });

    it('should NOT include cover file field in formConfig for edit mode', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      const config = component.formConfig();
      const coverField = config.fields.find((f) => f.key === 'cover');
      expect(coverField).toBeUndefined();
    });

    it('should render View product cover and View product gallery buttons in edit mode', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const viewButtons = compiled.querySelectorAll(
        '.product-form__view-btn',
      );
      expect(viewButtons.length).toBe(2);
      expect(viewButtons[0].textContent).toContain('View product cover');
      expect(viewButtons[1].textContent).toContain('View product gallery');
    });

    it('should render Update Product text on submit button', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      const config = component.formConfig();
      expect(config.submitLabel).toBe('Update Product');
    });

    it('should open and close cover preview modal', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      expect(component.activeModal()).toBe('none');
      expect(component.dialogVisible()).toBe(false);

      component.openCoverModal();
      fixture.detectChanges();

      expect(component.activeModal()).toBe('cover');
      expect(component.dialogVisible()).toBe(true);
      expect(component.currentImage()).toBe(mockProduct.cover);

      component.closeModal();
      fixture.detectChanges();

      expect(component.activeModal()).toBe('none');
      expect(component.dialogVisible()).toBe(false);
    });

    it('should open and close gallery preview modal', () => {
      const productService = TestBed.inject(ProductService);
      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );

      fixture.detectChanges();

      component.openGalleryModal();
      fixture.detectChanges();

      expect(component.activeModal()).toBe('gallery');
      expect(component.dialogVisible()).toBe(true);
      expect(component.modalImages().length).toBe(2);

      component.onEscape();
      fixture.detectChanges();

      expect(component.activeModal()).toBe('none');
      expect(component.dialogVisible()).toBe(false);
    });

    it('should call productService.updateProduct with correct payload on submit in edit mode', () => {
      const productService = TestBed.inject(ProductService);
      const router = TestBed.inject(Router);
      const toastr = TestBed.inject(ToastrService);

      vi.spyOn(productService, 'getProductById').mockReturnValue(
        of(mockProduct),
      );
      const updateProductSpy = vi
        .spyOn(productService, 'updateProduct')
        .mockReturnValue(of(mockProduct));
      const navigateSpy = vi
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);

      fixture.detectChanges();

      component.onSubmit({
        valid: true,
        value: {
          title: 'Updated Bouquet Title',
          description: 'A thoughtful floral gift',
          price: 1500,
          discount: 15,
          quantity: 16,
          categoryId: '799bab5d-6133-412c-8353-cf776467e3be',
        },
      });

      expect(updateProductSpy).toHaveBeenCalledWith(
        productId,
        expect.objectContaining({
          title: 'Updated Bouquet Title',
          description: 'A thoughtful floral gift',
          price: 1500,
          stock: 16,
          discountType: 'PERCENT',
          discountValue: 15,
          cover: mockProduct.cover,
          gallery: expect.arrayContaining([
            'https://rose-app.elevate-bootcamp.cloud/storage/gallery1.png',
            'https://rose-app.elevate-bootcamp.cloud/storage/gallery2.png',
          ]),
          categoryId: '799bab5d-6133-412c-8353-cf776467e3be',
        }),
      );

      expect(toastr.success).toHaveBeenCalledWith(
        'Product updated successfully.',
      );
      expect(navigateSpy).toHaveBeenCalledWith(['/adminDashboard/products']);
    });

    it('should handle product load error gracefully', () => {
      const productService = TestBed.inject(ProductService);
      const router = TestBed.inject(Router);
      const toastr = TestBed.inject(ToastrService);

      vi.spyOn(productService, 'getProductById').mockReturnValue(
        throwError(() => new Error('Not found')),
      );
      const navigateSpy = vi
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);

      fixture.detectChanges();

      expect(toastr.error).toHaveBeenCalledWith('Unable to load product.');
      expect(navigateSpy).toHaveBeenCalledWith(['/adminDashboard/products']);
    });
  });
});
