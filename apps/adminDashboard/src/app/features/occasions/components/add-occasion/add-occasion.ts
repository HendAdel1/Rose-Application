import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import {
  LucideLoader2,
  LucideTrash2,
  LucideUpload,
} from '@lucide/angular';
import { OccasionsService } from '../../services/occasions.service';

@Component({
  selector: 'app-add-occasion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideLoader2,
    LucideTrash2,
    LucideUpload,
  ],
  templateUrl: './add-occasion.html',
  styleUrl: './add-occasion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOccasion {
  private readonly fb = inject(FormBuilder);
  private readonly occasionsService = inject(OccasionsService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  readonly isSubmitting = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly imageName = signal<string | null>(null);
  readonly imageError = signal<string | null>(null);
  readonly isDragging = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    image: ['', [Validators.required]],
  });

  get nameControl() {
    return this.form.get('name');
  }

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File): void {
    this.imageError.set(null);
    if (!file.type.startsWith('image/')) {
      const errorMsg = this.translate.instant('DASHBOARDOCCASIONS.INVALID_IMAGE_TYPE') || 'Please select a valid image file.';
      this.imageError.set(errorMsg);
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = this.translate.instant('DASHBOARDOCCASIONS.IMAGE_TOO_LARGE') || 'Image size should be less than 5MB.';
      this.imageError.set(errorMsg);
      return;
    }

    this.selectedFile.set(file);
    this.imageName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.imagePreview.set(result);
      this.form.patchValue({ image: file.name });
      this.form.get('image')?.markAsDirty();
    };
    reader.readAsDataURL(file);
  }

  removeImage(event?: Event): void {
    event?.stopPropagation();
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.imageName.set(null);
    this.form.patchValue({ image: '' });
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, description } = this.form.value;
    const file = this.selectedFile();
    if (!name || !file) return;

    this.isSubmitting.set(true);
    // Upload image first, then create occasion with the resulting URL/path
    this.occasionsService
      .uploadImage(file)
      .pipe(
        switchMap((uploadRes) => {
          return this.occasionsService.createOccasion({
            title: name.trim(),
            description: description?.trim() || name.trim(),
            image: uploadRes.url,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const successMsg =
            this.translate.instant('DASHBOARDOCCASIONS.CREATE_SUCCESS') ||
            'Occasion created successfully!';
          this.toastr.success(successMsg);
          void this.router.navigate(['/adminDashboard/occasions']);
        },
        error: (err: { error?: { message?: string } }) => {
          this.isSubmitting.set(false);
          const errorMsg =
            err.error?.message ||
            this.translate.instant('DASHBOARDOCCASIONS.CREATE_ERROR') ||
            'Failed to create occasion. Please try again.';
          this.toastr.error(errorMsg);
        },
      });
  }
}
