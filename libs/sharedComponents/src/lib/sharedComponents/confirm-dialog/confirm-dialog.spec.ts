import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let component: ConfirmDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is hidden when open is false', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.confirm-dialog__panel')).toBeNull();
  });

  it('renders dynamic entity message when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('entityName', 'category');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.confirm-dialog__title') as HTMLElement;
    expect(title.textContent).toContain('delete this category');
  });

  it('prefers custom message over entity template', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('entityName', 'product');
    fixture.componentRef.setInput('message', 'Remove this item forever?');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.confirm-dialog__title') as HTMLElement;
    expect(title.textContent).toContain('Remove this item forever?');
  });

  it('emits confirmed and cancelled', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let confirmed = false;
    let cancelled = false;
    component.confirmed.subscribe(() => {
      confirmed = true;
    });
    component.cancelled.subscribe(() => {
      cancelled = true;
    });

    component.onConfirm();
    component.onCancel();

    expect(confirmed).toBe(true);
    expect(cancelled).toBe(true);
  });

  it('blocks actions while loading', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    let confirmed = false;
    component.confirmed.subscribe(() => {
      confirmed = true;
    });

    component.onConfirm();
    expect(confirmed).toBe(false);
  });
});
