import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    const translateService = TestBed.inject(TranslateService);

    translateService.setTranslation('en', {
      NAV: {
        HOME: 'Home',
        PRODUCTS: 'Products',
        CATEGORIES: 'Categories',
        OCCASIONS: 'Occasions',
        CONTACT: 'Contact',
        ABOUT: 'About',
      },
      FOOTER: {
        ROSE_HOME: 'Rose home',
        COMPANY_NAME: 'Rose E-Commerce App',
        RIGHTS: 'All rights reserved | 2025',
        DISCOVER: 'Discover our website',
        TERMS: 'Terms & Conditions',
        PRIVACY: 'Privacy Policy',
        FAQ: 'FAQs',
        DISCOUNT_TITLE: 'Get <strong>20%</strong> Off Discount Coupon',
        NEWSLETTER_COPY: 'By subscribing to our newsletter',
        NEWSLETTER_INPUT: 'Newsletter input placeholder',
        EMAIL_PLACEHOLDER: 'Enter Your Email',
        SUBSCRIBE: 'Subscribe',
      },
    });
    translateService.use('en');
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
    expect(compiled.textContent).toContain('Enter Your Email');
    expect(compiled.textContent).toContain('Subscribe');
  });
});
