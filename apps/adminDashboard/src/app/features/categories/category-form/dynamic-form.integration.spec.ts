import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DynamicForm, DynamicFormConfig } from '@org/sharedComponents';

describe('DynamicForm (shared)', () => {
  let fixture: ComponentFixture<DynamicForm>;
  let component: DynamicForm;

  const config: DynamicFormConfig = {
    fields: [
      {
        key: 'title',
        type: 'text',
        label: 'Name',
        validators: { required: 'Name is required', minLength: 2 },
      },
      {
        key: 'secret',
        type: 'password',
        label: 'Password',
        validators: {
          required: true,
          pattern: /^(?=.*[A-Z]).{8,}$/,
          patternMessage: 'Password must include an uppercase letter',
        },
      },
      {
        key: 'image',
        type: 'file',
        label: 'Image',
        validators: {
          required: 'Image is required',
          accept: 'image/png,image/jpeg',
          maxSizeMb: 1,
        },
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

  it('renders schema fields including password and file upload', () => {
    expect(fixture.nativeElement.querySelector('#title')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#secret')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#image')).toBeTruthy();
  });

  it('shows instant validation errors on submit', () => {
    const submitSpy = vi.fn();
    component.formSubmit.subscribe(submitSpy);

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({ valid: false }));
    expect(component.isInvalid('title')).toBe(true);
    expect(component.errorMessage(config.fields[0])).toBe('Name is required');
  });

  it('emits submitted data when valid', () => {
    const submitSpy = vi.fn();
    component.formSubmit.subscribe(submitSpy);

    component.control('title').setValue('Flowers');
    component.control('secret').setValue('Password1');
    component.control('image').setValue(new File(['x'], 'a.png', { type: 'image/png' }));
    component.control('image').updateValueAndValidity();

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        valid: true,
        value: expect.objectContaining({ title: 'Flowers', secret: 'Password1' }),
      }),
    );
  });

  it('enforces file format and size restrictions', () => {
    component.control('image').setValue(new File(['x'], 'a.txt', { type: 'text/plain' }));
    component.control('image').updateValueAndValidity();
    expect(component.control('image').hasError('fileType')).toBe(true);

    component.control('image').setValue(
      new File([new Uint8Array(1024 * 1024 + 1)], 'big.png', { type: 'image/png' }),
    );
    component.control('image').updateValueAndValidity();
    expect(component.control('image').hasError('fileSize')).toBe(true);
  });

  it('supports existing image preview/replace state', () => {
    fixture.componentRef.setInput('config', {
      ...config,
      fields: config.fields.map((field) =>
        field.key === 'image'
          ? {
              ...field,
              existingFileUrl: 'https://cdn.example.com/cat.png',
              existingFileLabel: 'View category image',
              replaceLabel: 'Upload file',
            }
          : field,
      ),
    });
    fixture.detectChanges();

    expect(component.control('image').valid).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('View category image');
    expect(fixture.nativeElement.textContent).toContain('Upload file');
  });

  it('emits cancel when cancel is enabled', () => {
    fixture.componentRef.setInput('config', { ...config, showCancel: true, cancelLabel: 'Cancel' });
    fixture.detectChanges();

    const cancelSpy = vi.fn();
    component.formCancel.subscribe(cancelSpy);
    fixture.debugElement.query(By.css('.dynamic-form__cancel')).nativeElement.click();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
