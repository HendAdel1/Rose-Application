import '@angular/localize/init';
import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('should render footer content', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Rose E-Commerce App');
    expect(compiled.textContent).toContain('Privacy Policy');
    expect(compiled.textContent).toContain('Terms & Conditions');
    expect(compiled.textContent).toContain('FAQs');
    expect(compiled.textContent).toContain('Get 20% Off Discount Coupon');
    expect(compiled.textContent).toContain('Subscribe');
    expect(compiled.querySelector('lib-custom-input')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });
});
