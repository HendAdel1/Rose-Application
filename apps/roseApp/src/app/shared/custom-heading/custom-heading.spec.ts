import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomHeading } from './custom-heading';

describe('CustomHeading', () => {
  let fixture: ComponentFixture<CustomHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHeading],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomHeading);
    fixture.componentRef.setInput('eyebrow', 'Gallery');
    fixture.componentRef.setInput('title', 'Check Out our Wonderful Gallery');
    fixture.componentRef.setInput('headingId', 'gallery-heading');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render eyebrow and title', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Gallery');
    expect(compiled.textContent).toContain('Check Out our Wonderful Gallery');
    expect(compiled.querySelector('#gallery-heading')).toBeTruthy();
  });
});
