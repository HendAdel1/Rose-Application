import { Injectable } from '@angular/core';
import { Column } from '../../../shared/reusable-table/models/table-column.model';
import { OccasionRow } from '../models/occasion-row.model';

@Injectable({ providedIn: 'root' })
export class OccasionTableConfigService {
  getDefaultColumns(): Column<OccasionRow>[] {
    return [
      {
        field: 'name',
        header: 'TABLE.COLUMNS.NAME',
        type: 'text',
        width: '40%',
        sort: true,
        cellStyleFn: () => ({ 'font-weight': '600' }),
      },
      {
        field: 'products',
        header: 'TABLE.COLUMNS.PRODUCTS',
        type: 'text',
        width: '25%',
        sort: true,
      },
      {
        field: 'actions',
        header: 'TABLE.COLUMNS.ACTIONS',
        type: 'actions',
        width: '20%',
        sort: false,
      },
    ];
  }
}
