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

import { OccasionsService } from '../services/occasions.service';

@Component({
  selector: 'app-occasion-form',
  standalone: true,
  imports: [DynamicForm, TranslatePipe],
  templateUrl: './occasion-form.html',
  styleUrl: './occasion-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OccasionForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly occasionsService = inject(OccasionsService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = signal<'add' | 'edit'>('add');
  readonly occasionId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly pageLoading = signal(false);
  readonly existingImageUrl = signal<string | null>(null);
  readonly initialValue = signal<DynamicFormValue>({});
  readonly formReady = signal(false);

  readonly pageTitle = computed(() =>
    this.mode() === 'add'
      ? this.translate.instant('ADMIN_OCCASIONS.ADD_TITLE')
      : this.translate.instant('ADMIN_OCCASIONS.UPDATE_TITLE', {
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
          label: this.translate.instant('ADMIN_OCCASIONS.NAME_LABEL'),
          placeholder: this.translate.instant('ADMIN_OCCASIONS.NAME_PLACEHOLDER'),
          validators: {
            required: this.translate.instant('ADMIN_OCCASIONS.NAME_REQUIRED'),
            minLength: 2,
            maxLength: 80,
          },
        },
        {
          key: 'image',
          type: 'file',
          label: isAdd
            ? this.translate.instant('ADMIN_OCCASIONS.IMAGE_LABEL')
            : this.translate.instant('ADMIN_OCCASIONS.IMAGE_LABEL_OPTIONAL'),
          placeholder: this.translate.instant('ADMIN_OCCASIONS.IMAGE_PLACEHOLDER'),
          existingFileUrl: this.existingImageUrl() ?? undefined,
          existingFileLabel: this.translate.instant('ADMIN_OCCASIONS.VIEW_IMAGE'),
          replaceLabel: this.translate.instant('ADMIN_OCCASIONS.REPLACE_IMAGE'),
          validators: {
            required: isAdd ? this.translate.instant('ADMIN_OCCASIONS.IMAGE_REQUIRED') : false,
            accept: 'image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp',
            maxSizeMb: 5,
          },
        },
      ],
      submitLabel: isAdd
        ? this.translate.instant('ADMIN_OCCASIONS.ADD_SUBMIT')
        : this.translate.instant('ADMIN_OCCASIONS.UPDATE_SUBMIT'),
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
    this.occasionId.set(id);
    this.pageLoading.set(true);

    this.occasionsService
      .getOccasionById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (occasion) => {
          this.initialValue.set({ title: occasion.title ?? '' });
          this.existingImageUrl.set(this.occasionsService.resolveImageUrl(occasion.image));
          this.pageLoading.set(false);
          this.formReady.set(true);
        },
        error: () => {
          this.pageLoading.set(false);
          this.toastr.error(this.translate.instant('ADMIN_OCCASIONS.LOAD_ERROR'));
          void this.router.navigate(['/adminDashboard/occasions']);
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
      ? this.occasionsService.uploadImage(imageFile)
      : null;

    if (this.mode() === 'add') {
      if (!upload$) {
        this.loading.set(false);
        return;
      }

      upload$
        .pipe(
          switchMap((imageUrl) =>
            this.occasionsService.createOccasion({ title, image: imageUrl }),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.toastr.success(this.translate.instant('ADMIN_OCCASIONS.CREATE_SUCCESS'));
            void this.router.navigate(['/adminDashboard/occasions']);
          },
          error: (err) => {
            this.loading.set(false);
            this.toastr.error(
              err?.error?.message ?? this.translate.instant('ADMIN_OCCASIONS.CREATE_ERROR'),
            );
          },
        });
      return;
    }

    const id = this.occasionId();
    if (!id) {
      this.loading.set(false);
      return;
    }

    const request$ = upload$
      ? upload$.pipe(
          switchMap((imageUrl) =>
            this.occasionsService.updateOccasion(id, { title, image: imageUrl }),
          ),
        )
      : this.occasionsService.updateOccasion(id, { title });

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastr.success(this.translate.instant('ADMIN_OCCASIONS.UPDATE_SUCCESS'));
        void this.router.navigate(['/adminDashboard/occasions']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastr.error(
          err?.error?.message ?? this.translate.instant('ADMIN_OCCASIONS.UPDATE_ERROR'),
        );
      },
    });
  }

  onCancel(): void {
    void this.router.navigate(['/adminDashboard/occasions']);
  }
}
