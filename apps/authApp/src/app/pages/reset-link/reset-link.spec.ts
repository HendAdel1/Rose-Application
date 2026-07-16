import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetLink } from './reset-link';

describe('ResetLink', () => {
  let component: ResetLink;
  let fixture: ComponentFixture<ResetLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLink],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
