import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('should render company information and support links', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Rose E-Commerce App');
    expect(compiled.textContent).toContain('Privacy Policy');
    expect(compiled.textContent).toContain('Terms & Conditions');
    expect(compiled.textContent).toContain('FAQs');
    expect(compiled.textContent).toContain('support@rose-app.com');
    expect(compiled.textContent).toContain('+20 100 000 0000');
  });

  it('should open social links in new tabs', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const socialLinks = Array.from(
      fixture.nativeElement.querySelectorAll('.social-links a'),
    ) as HTMLAnchorElement[];

    expect(socialLinks.length).toBeGreaterThan(0);
    expect(socialLinks.every((link) => link.target === '_blank')).toBe(true);
    expect(
      socialLinks.every((link) => link.rel.includes('noopener noreferrer')),
    ).toBe(true);
  });
});
