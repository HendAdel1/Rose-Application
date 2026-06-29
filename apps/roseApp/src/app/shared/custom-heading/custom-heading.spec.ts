import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomHeading } from './custom-heading';

describe('CustomHeading', () => {
  let component: CustomHeading;
  let fixture: ComponentFixture<CustomHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHeading],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
