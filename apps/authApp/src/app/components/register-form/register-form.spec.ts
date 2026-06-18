import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  let component: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;
  let httpMock: HttpTestingController;
  let toastr: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterForm],
      providers: [
        provideRouter([]),
        provideAuthDataAccess({ apiBaseUrl: '/api/auth' }),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    toastr = TestBed.inject(ToastrService);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a toast when email verification fails', () => {
    const errorToastSpy = vi
      .spyOn(toastr, 'error')
      .mockImplementation(() => null);

    component.verifyEmail.setValue({ email: 'user@example.com' });
    component.sendEmailVerification();

    const request = httpMock.expectOne('/api/auth/send-email-verification');

    request.flush(
      { message: 'Email already exists' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(errorToastSpy).toHaveBeenCalledWith(
      'Email already exists',
      'Authentication error'
    );
  });
});
