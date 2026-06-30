import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', {
      id: 'test-product',
      title: 'Test Product',
      description: 'Test description',
      rating: 4,
      ratings: 10,
      stock: 5,
      price: '100',
      discountType: 'FIXED',
      discountValue: '0',
      cover: '/images/g1.webp',
      gallery: '',
      categoryId: 'category-id',
      subCategoryId: null,
      immutable: false,
      createdAt: '',
      updatedAt: '',
      category: null,
      subCategory: null,
      occasions: [],
      _count: { reviews: 0, cartItems: 0, wishlistItems: 0 },
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
