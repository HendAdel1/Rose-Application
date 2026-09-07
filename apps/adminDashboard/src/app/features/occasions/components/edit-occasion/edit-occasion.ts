import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap, map } from 'rxjs';
import {
  LucideChevronRight,
  LucideImage,
  LucideLoader2,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { OccasionsService } from '../../services/occasions.service';
import { Occasion } from '../../models/occasion.model';

@Component({
  selector: 'app-edit-occasion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    LucideChevronRight,
    LucideImage,
    LucideLoader2,
    LucideUpload,
    LucideX,
  ],
  templateUrl: './edit-occasion.html',
  styleUrl: './edit-occasion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOccasion implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly occasionsService = inject(OccasionsService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  readonly occasionId = signal<string>('');
  readonly occasionTitle = signal<string>('');
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly showImageModal = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    image: [''],
  });

  get nameControl() {
    return this.form.get('name');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.occasionId.set(id);
      this.fetchOccasion(id);
    } else {
      this.isLoading.set(false);
      void this.router.navigate(['/adminDashboard/occasions']);
    }
  }

  fetchOccasion(id: string): void {
    this.isLoading.set(true);
    this.occasionsService.getOccasionById(id).subscribe({
      next: (occasion: Occasion) => {
        this.occasionTitle.set(occasion.title);
        this.imagePreview.set(occasion.image || null);
        this.form.patchValue({
          name: occasion.title,
          description: occasion.description || '',
          image: occasion.image || '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        const errorMsg =
          this.translate.instant('DASHBOARDOCCASIONS.FETCH_ERROR') ||
          'Failed to load occasion details.';
        this.toastr.error(errorMsg);
        void this.router.navigate(['/adminDashboard/occasions']);
      },
    });
  }

  openImageModal(): void {
    if (this.imagePreview()) {
      this.showImageModal.set(true);
    }
  }

  closeImageModal(): void {
    this.showImageModal.set(false);
  }

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        const errorMsg =
          this.translate.instant('DASHBOARDOCCASIONS.INVALID_IMAGE_TYPE') ||
          'Please select a valid image file.';
        this.toastr.error(errorMsg);
        return;
      }

      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview.set(result);
        this.form.patchValue({ image: file.name });
        this.form.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, description } = this.form.value;
    if (!name) return;

    this.isSubmitting.set(true);
    const id = this.occasionId();
    const file = this.selectedFile();

    // If new file chosen, upload it first; otherwise update text fields
    const uploadStream$ = file
      ? this.occasionsService.uploadImage(file).pipe(map((res) => res.url))
      : of(undefined);

    uploadStream$
      .pipe(
        switchMap((uploadedUrl) => {
          return this.occasionsService.updateOccasion(id, {
            title: name.trim(),
            description: description?.trim(),
            image: uploadedUrl,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const successMsg =
            this.translate.instant('DASHBOARDOCCASIONS.UPDATE_SUCCESS') ||
            'Occasion updated successfully!';
          this.toastr.success(successMsg);
          void this.router.navigate(['/adminDashboard/occasions']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const errorMsg =
            err.error?.message ||
            this.translate.instant('DASHBOARDOCCASIONS.UPDATE_ERROR') ||
            'Failed to update occasion. Please try again.';
          this.toastr.error(errorMsg);
        },
      });
  }
}
