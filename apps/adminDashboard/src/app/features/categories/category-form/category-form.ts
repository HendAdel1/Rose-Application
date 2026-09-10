import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  DynamicForm,
  DynamicFormConfig,
  DynamicFormSubmitEvent,
  DynamicFormValue,
} from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [DynamicForm, TranslatePipe],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = signal<'add' | 'edit'>('add');
  readonly categoryId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly pageLoading = signal(false);
  readonly existingImageUrl = signal<string | null>(null);
  readonly initialValue = signal<DynamicFormValue>({});
  readonly formReady = signal(false);

  readonly pageTitle = computed(() =>
    this.mode() === 'add'
      ? this.translate.instant('ADMIN_CATEGORIES.ADD_TITLE')
      : this.translate.instant('ADMIN_CATEGORIES.UPDATE_TITLE', {
          name: this.initialValue()['title'] || '',
        }),
  );

  readonly formConfig = computed<DynamicFormConfig>(() => {
    const isAdd = this.mode() === 'add';

    return {
      fields: [
        {
          key: 'title',
          type: 'text',
          label: this.translate.instant('ADMIN_CATEGORIES.NAME_LABEL'),
          placeholder: this.translate.instant('ADMIN_CATEGORIES.NAME_PLACEHOLDER'),
          validators: {
            required: this.translate.instant('ADMIN_CATEGORIES.NAME_REQUIRED'),
            minLength: 2,
            maxLength: 80,
          },
        },
        {
          key: 'image',
          type: 'file',
          label: isAdd
            ? this.translate.instant('ADMIN_CATEGORIES.IMAGE_LABEL')
            : this.translate.instant('ADMIN_CATEGORIES.IMAGE_LABEL_OPTIONAL'),
          placeholder: this.translate.instant('ADMIN_CATEGORIES.IMAGE_PLACEHOLDER'),
          existingFileUrl: this.existingImageUrl() ?? undefined,
          existingFileLabel: this.translate.instant('ADMIN_CATEGORIES.VIEW_IMAGE'),
          replaceLabel: this.translate.instant('ADMIN_CATEGORIES.REPLACE_IMAGE'),
          validators: {
            required: isAdd ? this.translate.instant('ADMIN_CATEGORIES.IMAGE_REQUIRED') : false,
            accept: 'image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp',
            maxSizeMb: 5,
          },
        },
      ],
      submitLabel: isAdd
        ? this.translate.instant('ADMIN_CATEGORIES.ADD_SUBMIT')
        : this.translate.instant('ADMIN_CATEGORIES.UPDATE_SUBMIT'),
      showCancel: false,
    };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.mode.set('add');
      this.formReady.set(true);
      return;
    }

    this.mode.set('edit');
    this.categoryId.set(id);
    this.pageLoading.set(true);

    this.categoriesService
      .getCategoryById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (category) => {
          this.initialValue.set({ title: category.title ?? '' });
          this.existingImageUrl.set(this.categoriesService.resolveImageUrl(category.image));
          this.pageLoading.set(false);
          this.formReady.set(true);
        },
        error: () => {
          this.pageLoading.set(false);
          this.toastr.error(this.translate.instant('ADMIN_CATEGORIES.LOAD_ERROR'));
          void this.router.navigate(['../'], { relativeTo: this.route });
        },
      });
  }

  onSubmit(event: DynamicFormSubmitEvent): void {
    if (!event.valid) {
      return;
    }

    const title = String(event.value['title'] ?? '').trim();
    const imageFile = event.value['image'] instanceof File ? event.value['image'] : null;

    this.loading.set(true);

    const upload$ = imageFile
      ? this.categoriesService.uploadImage(imageFile)
      : null;

    if (this.mode() === 'add') {
      if (!upload$) {
        this.loading.set(false);
        return;
      }

      upload$
        .pipe(
          switchMap((imageUrl) =>
            this.categoriesService.createCategory({ title, image: imageUrl }),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.toastr.success(this.translate.instant('ADMIN_CATEGORIES.CREATE_SUCCESS'));
            void this.router.navigate(['/adminDashboard/categories']);
          },
          error: (err) => {
            this.loading.set(false);
            this.toastr.error(
              err?.error?.message ?? this.translate.instant('ADMIN_CATEGORIES.CREATE_ERROR'),
            );
          },
        });
      return;
    }

    const id = this.categoryId();
    if (!id) {
      this.loading.set(false);
      return;
    }

    const request$ = upload$
      ? upload$.pipe(
          switchMap((imageUrl) =>
            this.categoriesService.updateCategory(id, { title, image: imageUrl }),
          ),
        )
      : this.categoriesService.updateCategory(id, { title });

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastr.success(this.translate.instant('ADMIN_CATEGORIES.UPDATE_SUCCESS'));
        void this.router.navigate(['/adminDashboard/categories']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastr.error(
          err?.error?.message ?? this.translate.instant('ADMIN_CATEGORIES.UPDATE_ERROR'),
        );
      },
    });
  }

  onCancel(): void {
    void this.router.navigate(['/adminDashboard/categories']);
  }
}
