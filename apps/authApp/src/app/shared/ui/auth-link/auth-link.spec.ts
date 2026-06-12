import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLink } from './auth-link';

describe('AuthLink', () => {
  let component: AuthLink;
  let fixture: ComponentFixture<AuthLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLink],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
