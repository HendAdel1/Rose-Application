import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideImage,
  LucideLoader2,
  LucideX,
} from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  DynamicForm,
  DynamicFormConfig,
  DynamicFormSubmitEvent,
  DynamicFormValue,
  DynamicSelectOption,
} from '@org/sharedComponents';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, switchMap } from 'rxjs';

import { CategoriesService } from '../../categories/services/categories.service';
import { OccasionsService } from '../../occasions/services/occasions.service';
import { AdminLayoutService } from '../../../layout/services/admin-layout.service';
import {
  CreateProductPayload,
  UpdateProductPayload,
} from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products-form',
  imports: [
    DynamicForm,
    TranslatePipe,
    RouterLink,
    LucideImage,
    LucideLoader2,
    LucideX,
    LucideChevronLeft,
    LucideChevronRight,
    DialogModule,
  ],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly occasionsService = inject(OccasionsService);
  private readonly layoutService = inject(AdminLayoutService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const title = this.breadcrumbCurrent();
      this.layoutService.setCustomTitle(title);
    });
  }

  ngOnDestroy(): void {
    this.layoutService.clearCustomTitle();
  }

  readonly dynamicFormComp = viewChild(DynamicForm);

  readonly mode = signal<'add' | 'edit'>('add');
  readonly productId = signal<string | null>(null);
  readonly productTitle = signal('');
  readonly loading = signal(false);
  readonly pageLoading = signal(false);
  readonly formReady = signal(false);

  readonly categoryOptions = signal<readonly DynamicSelectOption[]>([]);
  readonly occasionOptions = signal<readonly DynamicSelectOption[]>([]);
  readonly initialValue = signal<DynamicFormValue>({});

  readonly existingCoverUrl = signal<string | null>(null);
  readonly existingGalleryUrls = signal<string[]>([]);
  private readonly langChange = toSignal(this.translate.onLangChange);

  readonly activeModal = signal<'none' | 'cover' | 'gallery'>('none');
  readonly dialogVisible = signal(false);
  readonly currentImageIndex = signal<number>(0);

  readonly modalImages = computed<string[]>(() => {
    if (this.activeModal() === 'cover') {
      const cover = this.existingCoverUrl();
      return cover ? [cover] : [];
    }
    if (this.activeModal() === 'gallery') {
      return this.existingGalleryUrls();
    }
    return [];
  });

  readonly currentImage = computed<string | null>(() => {
    const images = this.modalImages();
    if (images.length === 0) {
      return null;
    }
    const idx = this.currentImageIndex();
    return images[idx] ?? images[0] ?? null;
  });

  readonly pageTitle = computed(() => {
    this.langChange();
    if (this.mode() === 'add') {
      return this.translate.instant('ADMIN_PRODUCTS.ADD_TITLE');
    }
    const prefix = this.translate.instant('ADMIN_PRODUCTS.UPDATE_TITLE_PREFIX');
    return `${prefix}${this.productTitle()}`;
  });

  readonly breadcrumbCurrent = computed(() => {
    this.langChange();
    if (this.mode() === 'add') {
      return this.translate.instant('ADMIN_PRODUCTS.ADD_BREADCRUMB');
    }
    const prefix = this.translate.instant(
      'ADMIN_PRODUCTS.UPDATE_BREADCRUMB_PREFIX',
    );
    return `${prefix}${this.productTitle()}`;
  });

  readonly modalTitle = computed(() => {
    this.langChange();
    switch (this.activeModal()) {
      case 'cover':
        return this.translate.instant('ADMIN_PRODUCTS.COVER_MODAL_TITLE');
      case 'gallery':
        return this.translate.instant('ADMIN_PRODUCTS.GALLERY_MODAL_TITLE');
      default:
        return '';
    }
  });

  readonly formConfig = computed<DynamicFormConfig>(() => {
    this.langChange();
    const isAdd = this.mode() === 'add';

    return {
      fields: [
        {
          key: 'title',
          type: 'text',
          label: this.translate.instant('ADMIN_PRODUCTS.TITLE_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.TITLE_PLACEHOLDER',
          ),
          width: 'full' as const,
          validators: {
            required: this.translate.instant('ADMIN_PRODUCTS.TITLE_REQUIRED'),
            minLength: 2,
          },
        },
        {
          key: 'description',
          type: 'textarea',
          label: this.translate.instant('ADMIN_PRODUCTS.DESCRIPTION_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.DESCRIPTION_PLACEHOLDER',
          ),
          width: 'full' as const,
          rows: 4,
          maxHeight: '10rem',
          validators: {
            required: this.translate.instant(
              'ADMIN_PRODUCTS.DESCRIPTION_REQUIRED',
            ),
          },
        },
        {
          key: 'price',
          type: 'number',
          label: this.translate.instant('ADMIN_PRODUCTS.PRICE_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.PRICE_PLACEHOLDER',
          ),
          width: 'third' as const,
          validators: {
            required: this.translate.instant('ADMIN_PRODUCTS.PRICE_REQUIRED'),
            min: 0,
          },
        },
        {
          key: 'discount',
          type: 'number',
          label: this.translate.instant('ADMIN_PRODUCTS.DISCOUNT_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.DISCOUNT_PLACEHOLDER',
          ),
          width: 'third' as const,
          validators: {
            min: 0,
          },
        },
        {
          key: 'priceAfterDiscount',
          type: 'number',
          label: this.translate.instant('ADMIN_PRODUCTS.PRICE_AFTER_DISCOUNT_LABEL'),
          placeholder: this.translate.instant('ADMIN_PRODUCTS.PRICE_AFTER_DISCOUNT_PLACEHOLDER'),
          width: 'third' as const,
          readonly: true,
        },
        {
          key: 'quantity',
          type: 'number',
          label: this.translate.instant('ADMIN_PRODUCTS.QUANTITY_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.QUANTITY_PLACEHOLDER',
          ),
          width: 'full' as const,
          validators: {
            required: this.translate.instant(
              'ADMIN_PRODUCTS.QUANTITY_REQUIRED',
            ),
            min: 1,
          },
        },
        ...(isAdd
          ? [
              {
                key: 'cover',
                type: 'file' as const,
                label: this.translate.instant('ADMIN_PRODUCTS.COVER_LABEL'),
                placeholder: this.translate.instant(
                  'ADMIN_PRODUCTS.UPLOAD_FILE',
                ),
                width: 'half' as const,
                multiple: false,
                validators: {
                  required: this.translate.instant(
                    'ADMIN_PRODUCTS.COVER_REQUIRED',
                  ),
                  accept: 'image/jpeg,image/png,image/gif,image/webp,image/*',
                  maxSizeMb: 5,
                },
              },
              {
                key: 'gallery',
                type: 'file' as const,
                label: this.translate.instant('ADMIN_PRODUCTS.GALLERY_LABEL'),
                placeholder: this.translate.instant(
                  'ADMIN_PRODUCTS.UPLOAD_FILE',
                ),
                width: 'half' as const,
                multiple: true,
                validators: {
                  required: this.translate.instant(
                    'ADMIN_PRODUCTS.GALLERY_REQUIRED',
                  ),
                  accept: 'image/jpeg,image/png,image/gif,image/webp,image/*',
                  maxSizeMb: 5,
                },
              },
            ]
          : []),
        {
          key: 'categoryId',
          type: 'select',
          label: this.translate.instant('ADMIN_PRODUCTS.CATEGORY_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.CATEGORY_PLACEHOLDER',
          ),
          width: 'full' as const,
          options: this.categoryOptions(),
          validators: {
            required: this.translate.instant(
              'ADMIN_PRODUCTS.CATEGORY_REQUIRED',
            ),
          },
        },
        {
          key: 'occasionId',
          type: 'select',
          label: this.translate.instant('ADMIN_PRODUCTS.OCCASION_LABEL'),
          placeholder: this.translate.instant(
            'ADMIN_PRODUCTS.OCCASION_PLACEHOLDER',
          ),
          width: 'full' as const,
          options: this.occasionOptions(),
          validators: {
            required: this.translate.instant(
              'ADMIN_PRODUCTS.OCCASION_REQUIRED',
            ),
          },
        },
      ],
      submitLabel: isAdd
        ? this.translate.instant('ADMIN_PRODUCTS.ADD_SUBMIT')
        : this.translate.instant('ADMIN_PRODUCTS.UPDATE_SUBMIT'),
      showCancel: false,
    };
  });

  ngOnInit(): void {
    this.loadDropdownData();
    this.initializeMode();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeModal() !== 'none') {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.activeModal() !== 'none') {
      this.prevImage();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.activeModal() !== 'none') {
      this.nextImage();
    }
  }

  openCoverModal(): void {
    this.currentImageIndex.set(0);
    this.activeModal.set('cover');
    this.dialogVisible.set(true);
  }

  openGalleryModal(): void {
    this.currentImageIndex.set(0);
    this.activeModal.set('gallery');
    this.dialogVisible.set(true);
  }

  closeModal(): void {
    this.dialogVisible.set(false);
    this.activeModal.set('none');
    this.currentImageIndex.set(0);
  }

  prevImage(): void {
    const total = this.modalImages().length;
    if (total <= 1) {
      return;
    }
    this.currentImageIndex.update((curr) => (curr > 0 ? curr - 1 : total - 1));
  }

  nextImage(): void {
    const total = this.modalImages().length;
    if (total <= 1) {
      return;
    }
    this.currentImageIndex.update((curr) => (curr < total - 1 ? curr + 1 : 0));
  }

  setImageIndex(index: number): void {
    const total = this.modalImages().length;
    if (index >= 0 && index < total) {
      this.currentImageIndex.set(index);
    }
  }

  onValueChange(value: DynamicFormValue): void {
    const price = Number(value['price']) || 0;
    const discount = Number(value['discount']) || 0;

    let priceAfterDiscount: number | null = null;
    if (price > 0 && discount > 0) {
      const calculated =
        discount <= 100
          ? price - (price * discount) / 100
          : Math.max(0, price - discount);
      priceAfterDiscount = Math.round(calculated * 100) / 100;
    } else if (price > 0) {
      priceAfterDiscount = price;
    }

    const comp = this.dynamicFormComp();
    if (comp) {
      const ctrl = comp.form().get('priceAfterDiscount');
      if (ctrl) {
        ctrl.setValue(priceAfterDiscount, { emitEvent: false });
      }
    }
  }

  onSubmit(event: DynamicFormSubmitEvent): void {
    if (this.loading() || this.pageLoading()) {
      return;
    }

    if (this.mode() === 'add') {
      this.handleAddSubmit(event);
    } else {
      this.handleEditSubmit(event);
    }
  }

  private handleAddSubmit(event: DynamicFormSubmitEvent): void {
    if (!event.valid) {
      return;
    }

    const rawCover = event.value['cover'];
    const coverFile =
      rawCover instanceof File
        ? rawCover
        : Array.isArray(rawCover) && rawCover[0] instanceof File
        ? rawCover[0]
        : null;

    const rawGallery = event.value['gallery'];
    const galleryFiles: File[] = Array.isArray(rawGallery)
      ? (rawGallery.filter((f) => f instanceof File) as File[])
      : rawGallery instanceof File
      ? [rawGallery]
      : [];

    if (!coverFile || galleryFiles.length === 0) {
      return;
    }

    this.loading.set(true);

    const coverUpload$ = this.productService.uploadImage(coverFile);
    const galleryUploads$ = forkJoin(
      galleryFiles.map((file) => this.productService.uploadImage(file)),
    );

    forkJoin([coverUpload$, galleryUploads$])
      .pipe(
        switchMap(([coverUrl, galleryUrls]) => {
          const title = String(event.value['title'] ?? '').trim();
          const description = String(event.value['description'] ?? '').trim();
          const price = Number(event.value['price']);
          const discount = Number(event.value['discount']) || 0;
          const stock = Number(event.value['quantity']);
          const categoryId = String(event.value['categoryId'] ?? '');
          const hasDiscount = discount > 0;

          const payload: CreateProductPayload = {
            title,
            description,
            price,
            stock,
            discountType: hasDiscount ? 'PERCENT' : null,
            discountValue: hasDiscount ? discount : null,
            cover: coverUrl,
            gallery: galleryUrls,
            categoryId,
          };

          return this.productService.createProduct(payload);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastr.success(
            this.translate.instant('ADMIN_PRODUCTS.CREATE_SUCCESS'),
          );
          void this.router.navigate(['/adminDashboard/products']);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          this.handleHttpError(err, 'ADMIN_PRODUCTS.CREATE_ERROR');
        },
      });
  }

  private handleEditSubmit(event: DynamicFormSubmitEvent): void {
    const id = this.productId();
    if (!id || !event.valid) {
      return;
    }

    this.loading.set(true);

    const title = String(event.value['title'] ?? '').trim();
    const description = String(event.value['description'] ?? '').trim();
    const price = Number(event.value['price']);
    const discount = Number(event.value['discount']) || 0;
    const stock = Number(event.value['quantity']);
    const categoryId = String(event.value['categoryId'] ?? '');
    const hasDiscount = discount > 0;

    const payload: UpdateProductPayload = {
      title,
      description,
      price,
      stock,
      discountType: hasDiscount ? 'PERCENT' : null,
      discountValue: hasDiscount ? discount : null,
      categoryId,
    };

    const coverUrl = this.existingCoverUrl();
    if (coverUrl) {
      payload.cover = coverUrl;
    }
    if (this.existingGalleryUrls().length > 0) {
      payload.gallery = this.existingGalleryUrls();
    }

    this.productService
      .updateProduct(id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastr.success(
            this.translate.instant('ADMIN_PRODUCTS.UPDATE_SUCCESS'),
          );
          void this.router.navigate(['/adminDashboard/products']);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          this.handleHttpError(err, 'ADMIN_PRODUCTS.UPDATE_ERROR');
        },
      });
  }

  private initializeMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.mode.set('add');
      this.formReady.set(true);
      return;
    }

    this.mode.set('edit');
    this.productId.set(id);
    this.pageLoading.set(true);

    this.productService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.productTitle.set(product.title ?? '');
          this.existingCoverUrl.set(product.cover ?? null);
          this.existingGalleryUrls.set(this.parseGalleryUrls(product.gallery));

          const priceNum = Number(product.price) || null;
          const discountNum =
            product.discountValue != null
              ? Number(product.discountValue)
              : null;
          const stockNum = product.stock != null ? Number(product.stock) : null;
          const categoryId = product.categoryId ?? product.category?.id ?? '';

          let priceAfterDiscount: number | null = null;
          if (priceNum && priceNum > 0 && discountNum && discountNum > 0) {
            const calculated =
              discountNum <= 100
                ? priceNum - (priceNum * discountNum) / 100
                : Math.max(0, priceNum - discountNum);
            priceAfterDiscount = Math.round(calculated * 100) / 100;
          } else if (priceNum && priceNum > 0) {
            priceAfterDiscount = priceNum;
          }

          this.initialValue.set({
            title: product.title ?? '',
            description: product.description ?? '',
            price: priceNum,
            discount: discountNum,
            priceAfterDiscount: priceAfterDiscount,
            quantity: stockNum,
            categoryId,
          });

          this.pageLoading.set(false);
          this.formReady.set(true);
        },
        error: () => {
          this.pageLoading.set(false);
          this.toastr.error(
            this.translate.instant('ADMIN_PRODUCTS.LOAD_ERROR'),
          );
          void this.router.navigate(['/adminDashboard/products']);
        },
      });
  }

  private loadDropdownData(): void {
    this.categoriesService
      .getCategories(1, 100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.categoryOptions.set(
            res.items.map((c) => ({ value: c.id, label: c.title })),
          );
        },
        error: () => {
          this.categoryOptions.set([]);
        },
      });

    this.occasionsService
      .getOccasions(1, 100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.occasionOptions.set(
            items.map((o) => ({ value: o.id, label: o.title })),
          );
        },
        error: () => {
          this.occasionOptions.set([]);
        },
      });
  }

  private parseGalleryUrls(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw.filter(
        (item): item is string => typeof item === 'string' && item.length > 0,
      );
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is string =>
              typeof item === 'string' && item.length > 0,
          );
        }
      } catch {
        if (raw.trim().length > 0) {
          return [raw.trim()];
        }
      }
    }
    return [];
  }

  private handleHttpError(err: unknown, fallbackKey: string): void {
    const httpError = err as
      | {
          error?: {
            message?: string;
            errors?: Array<{ path?: string; message?: string }>;
          };
        }
      | undefined;

    const errorDetail = httpError?.error?.errors
      ?.map((e) => (e.path ? `${e.path}: ${e.message}` : e.message))
      .filter(Boolean)
      .join(', ');

    this.toastr.error(
      errorDetail ||
        httpError?.error?.message ||
        this.translate.instant(fallbackKey),
    );
  }
}
