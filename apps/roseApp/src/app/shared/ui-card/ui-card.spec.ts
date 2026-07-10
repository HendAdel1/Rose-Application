import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { UiCard } from './ui-card';

describe('UiCard', () => {
  let component: UiCard;
  let fixture: ComponentFixture<UiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCard],
      providers: [provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', {
      id: '1',
      title: 'Rose Bouquet',
      imageUrl: '/logos/rose-logo.png',
      price: 250,
      oldPrice: 350,
      rating: 4,
      stock: 20,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
