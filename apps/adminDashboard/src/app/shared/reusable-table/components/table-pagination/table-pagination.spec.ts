import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePagination } from './table-pagination';

describe('TablePagination', () => {
  let component: TablePagination;
  let fixture: ComponentFixture<TablePagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePagination],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
