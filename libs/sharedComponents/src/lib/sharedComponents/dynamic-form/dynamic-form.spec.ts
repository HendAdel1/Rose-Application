import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicForm } from './dynamic-form';
import { DynamicFormConfig } from './models/dynamic-form.model';

describe('DynamicForm layout', () => {
  let fixture: ComponentFixture<DynamicForm>;
  let component: DynamicForm;

  const config: DynamicFormConfig = {
    fields: [
      { key: 'title', type: 'text', label: 'Title', width: 'full' },
      { key: 'price', type: 'number', label: 'Price', width: 'third' },
      { key: 'discount', type: 'number', label: 'Discount', width: 'third' },
      {
        key: 'priceAfter',
        type: 'number',
        label: 'Price after discount',
        width: 'third',
        readonly: true,
      },
      { key: 'cover', type: 'file', label: 'Cover', width: 'half' },
      {
        key: 'gallery',
        type: 'file',
        label: 'Gallery',
        width: 'half',
        multiple: true,
      },
    ],
    submitLabel: 'Save',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  });

  it('maps width shortcuts to 12-column spans', () => {
    expect(component.resolveColSpan(config.fields[0])).toBe(12);
    expect(component.resolveColSpan(config.fields[1])).toBe(4);
    expect(component.resolveColSpan(config.fields[4])).toBe(6);
  });

  it('prefers explicit colSpan over width', () => {
    expect(
      component.resolveColSpan({
        key: 'x',
        type: 'text',
        label: 'X',
        width: 'half',
        colSpan: 3,
      }),
    ).toBe(3);
  });

  it('forces a new row when breakBefore is set', () => {
    expect(
      component.fieldGridColumn({
        key: 'x',
        type: 'text',
        label: 'X',
        width: 'half',
        breakBefore: true,
      }),
    ).toBe('1 / span 6');
  });

  it('renders side-by-side grid columns on field wrappers', () => {
    const fields = fixture.nativeElement.querySelectorAll(
      '.dynamic-form__field',
    ) as NodeListOf<HTMLElement>;
    expect(fields.length).toBe(6);
    expect(fields[1].style.gridColumn).toContain('span 4');
    expect(fields[4].style.gridColumn).toContain('span 6');
  });

  it('disables readonly fields and enables multiple file input', () => {
    expect(component.control('priceAfter').disabled).toBe(true);
    const gallery = fixture.nativeElement.querySelector('#gallery') as HTMLInputElement;
    expect(gallery.multiple).toBe(true);
  });
});
