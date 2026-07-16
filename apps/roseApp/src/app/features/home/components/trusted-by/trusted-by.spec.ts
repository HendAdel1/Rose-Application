import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TrustedBy } from './trusted-by';

describe('TrustedBy', () => {
  let component: TrustedBy;
  let fixture: ComponentFixture<TrustedBy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedBy],
      providers: [provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustedBy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
