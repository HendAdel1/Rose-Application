import { Injectable } from '@angular/core';
import { Column } from '../../../shared/reusable-table/models/table-column.model';
import { Product } from '../models/product.model';

/**
 * Service providing reusable column presets for Soft-Deleted Products.
 */
@Injectable({ providedIn: 'root' })
export class DeletedProductTableConfigService {
  /**
   * Returns default column configurations for Deleted Products.
   */
  getDefaultColumns(): Column<Product>[] {
    return [
      {
        field: 'name',
        header: 'PRODUCTS.COLUMNS.NAME',
        type: 'text',
        width: '30%',
        sort: true,
        cellStyleFn: () => ({ 'font-weight': '600' }),
      },
      {
        field: 'price',
        header: 'PRODUCTS.COLUMNS.PRICE',
        type: 'formatted',
        width: '15%',
        suffix: 'EGP',
        sort: true,
      },
      {
        field: 'stock',
        header: 'PRODUCTS.COLUMNS.STOCK',
        type: 'text',
        width: '15%',
        sort: true,
      },
      {
        field: 'deletedAt',
        header: 'PRODUCTS.COLUMNS.DELETED_AT',
        type: 'text',
        width: '25%',
        sort: true,
        formatter: (val: unknown): string => {
          if (!val) {
            return '-';
          }
          const d = new Date(val as string);
          return Number.isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
        },
      },
      {
        field: 'actions',
        header: 'PRODUCTS.COLUMNS.ACTIONS',
        type: 'actions',
        width: '15%',
        sort: false,
      },
    ];
  }
}
