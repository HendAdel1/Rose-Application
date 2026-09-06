import { Component } from '@angular/core';
import { TableData } from './components/table-data/table-data';
import { TableSearch } from './components/table-search/table-search';
import { TablePagination } from './components/table-pagination/table-pagination';

@Component({
  selector: 'app-reusable-table',
  imports: [TableData, TableSearch, TablePagination],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
})
export class ReusableTable {}
