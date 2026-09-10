import { Injectable } from '@angular/core';
import { Column } from '../../../shared/reusable-table/models/table-column.model';
import { Product } from '../models/product.model';

/**
 * Service providing reusable column presets for Products.
 */
@Injectable({ providedIn: 'root' })
export class ProductTableConfigService {
  /**
   * Returns default column configurations for Products.
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
        width: '12%',
        sort: true,
        cellStyleFn: (val): Record<string, string> =>
          Number(val) <= 4 ? { color: '#cd2e33', 'font-weight': '600' } : {},
      },
      {
        field: 'sales',
        header: 'PRODUCTS.COLUMNS.SALES',
        type: 'text',
        width: '12%',
        sort: true,
      },
      {
        field: 'rating',
        header: 'PRODUCTS.COLUMNS.RATINGS',
        type: 'composite',
        width: '18%',
        compositeKeys: ['rating', 'maxRating', 'reviewCount'],
        compositeTemplate:
          '<span class="font-semibold text-zinc-900 dark:text-zinc-100">{0}/{1}</span> <span class="text-zinc-500">({2})</span>',
        sort: false,
      },
      {
        field: 'actions',
        header: 'PRODUCTS.COLUMNS.ACTIONS',
        type: 'actions',
        width: '13%',
        sort: false,
      },
    ];
  }
}
