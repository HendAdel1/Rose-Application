import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiLabel } from './ui-label';

describe('UiLabel', () => {
  let component: UiLabel;
  let fixture: ComponentFixture<UiLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a red required asterisk when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('.ui-label__required') as HTMLElement;
    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toBe('*');
  });
});
