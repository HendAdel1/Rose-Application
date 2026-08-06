import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/types/paginator';

@Component({
  selector: 'lib-custom-pagination',
  imports: [PaginatorModule],
  template: `
    @if (totalRecords() > limit()) {
      <div class="flex justify-center">
        <p-paginator
          [first]="first()"
          [rows]="limit()"
          [totalRecords]="totalRecords()"
          (onPageChange)="onPageChange($event)"
        ></p-paginator>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPagination {
  readonly page = input<number>(1);
  readonly limit = input<number>(10);
  readonly totalRecords = input<number>(0);

  readonly pageChange = output<number>();

  readonly first = computed(() => (this.page() - 1) * this.limit());

  onPageChange(event: PaginatorState): void {
    const newPage = Math.floor((event.first ?? 0) / this.limit()) + 1;
    this.pageChange.emit(newPage);
  }
}
