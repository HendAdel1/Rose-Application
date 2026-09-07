import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideEdit,
  LucideMoreVertical,
  LucidePlus,
  LucideSearch,
  LucideTrash2,
  LucideX,
} from '@lucide/angular';
import { OccasionsService } from './services/occasions.service';
import { Occasion, OccasionsMetadata } from './models/occasion.model';
import { DeleteOccasionDialog } from './components/delete-occasion-dialog/delete-occasion-dialog';

@Component({
  selector: 'app-admin-occasions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideEdit,
    LucideMoreVertical,
    LucidePlus,
    LucideSearch,
    LucideTrash2,
    LucideX,
    DeleteOccasionDialog,
  ],
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Occasions implements OnInit {
  private readonly occasionsService = inject(OccasionsService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef);

  readonly searchControl = new FormControl('');

  readonly occasions = signal<Occasion[]>([]);
  readonly metadata = signal<OccasionsMetadata>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalItems: 0,
  });

  readonly isLoading = signal(true);
  readonly currentPage = signal(1);
  readonly searchQuery = signal('');
  readonly pageSize = signal(10);

  // Mobile Action Menu State
  readonly activeMobileMenuId = signal<string | null>(null);

  // Delete Dialog State
  readonly deleteDialogOpen = signal(false);
  readonly occasionToDelete = signal<Occasion | null>(null);
  readonly isDeleting = signal(false);

  readonly paginationPages = computed(() => {
    const total = this.metadata().totalPages;
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  });

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery.set(query ?? '');
        this.currentPage.set(1);
        this.loadOccasions();
      });

    this.loadOccasions();
  }

  loadOccasions(): void {
    this.isLoading.set(true);
    this.occasionsService
      .getOccasions({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchQuery(),
      })
      .subscribe({
        next: ({ occasions, metadata }) => {
          this.occasions.set(occasions);
          this.metadata.set(metadata);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          const errorMsg =
            this.translate.instant('DASHBOARDOCCASIONS.FETCH_ERROR') ||
            'Failed to load occasions list.';
          this.toastr.error(errorMsg);
        },
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number' || page === this.currentPage()) return;
    if (page < 1 || page > this.metadata().totalPages) return;
    this.currentPage.set(page);
    this.loadOccasions();
  }

  nextPage(): void {
    if (this.currentPage() < this.metadata().totalPages) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this.metadata().totalPages);
  }

  toggleMobileMenu(id: string, event?: Event): void {
    event?.stopPropagation();
    if (this.activeMobileMenuId() === id) {
      this.activeMobileMenuId.set(null);
    } else {
      this.activeMobileMenuId.set(id);
    }
  }

  closeMobileMenu(): void {
    this.activeMobileMenuId.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  navigateToEdit(occasion: Occasion): void {
    this.closeMobileMenu();
    if (occasion.id) {
      void this.router.navigate(['edit', occasion.id], {
        relativeTo: this.route,
      });
    }
  }

  openDeleteDialog(occasion: Occasion, event?: Event): void {
    event?.stopPropagation();
    this.closeMobileMenu();
    this.occasionToDelete.set(occasion);
    this.deleteDialogOpen.set(true);
  }

  cancelDelete(): void {
    this.deleteDialogOpen.set(false);
    this.occasionToDelete.set(null);
  }

  confirmDelete(): void {
    const occasion = this.occasionToDelete();
    if (!occasion?.id) return;

    this.isDeleting.set(true);
    this.occasionsService.deleteOccasion(occasion.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.deleteDialogOpen.set(false);
        this.occasionToDelete.set(null);
        const successMsg =
          this.translate.instant('DASHBOARDOCCASIONS.DELETE_SUCCESS') ||
          'Occasion deleted successfully!';
        this.toastr.success(successMsg);
        this.loadOccasions();
      },
      error: (err) => {
        this.isDeleting.set(false);
        const errorMsg =
          err.error?.message ||
          this.translate.instant('DASHBOARDOCCASIONS.DELETE_ERROR') ||
          'Failed to delete occasion. Please try again.';
        this.toastr.error(errorMsg);
      },
    });
  }
}
