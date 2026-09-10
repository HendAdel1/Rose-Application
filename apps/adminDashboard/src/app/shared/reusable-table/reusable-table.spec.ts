import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { ReusableTable } from './reusable-table';
import { DataTableService } from './services/data-table.service';

@Component({
  imports: [ReusableTable],
  providers: [DataTableService],
  template: `
    <app-reusable-table>
      <header class="projected-header">
        <h1>Projected Table Title</h1>
      </header>
    </app-reusable-table>
  `,
})
class TestTableHostComponent {}

describe('ReusableTable Component', () => {
  let component: ReusableTable;
  let fixture: ComponentFixture<ReusableTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableTable, TestTableHostComponent],
      providers: [provideTranslateService(), DataTableService],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create ReusableTable component', () => {
    expect(component).toBeTruthy();
  });

  it('should render table-search, table-data, and table-pagination child components', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-table-search')).toBeTruthy();
    expect(compiled.querySelector('app-table-data')).toBeTruthy();
    expect(compiled.querySelector('app-table-pagination')).toBeTruthy();
  });

  it('should project content (such as header) into the table card', async () => {
    const hostFixture = TestBed.createComponent(TestTableHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.reusable-table-card');
    const projectedHeader = card?.querySelector('.projected-header');

    expect(projectedHeader).toBeTruthy();
    expect(projectedHeader?.textContent?.trim()).toBe('Projected Table Title');
  });
});
