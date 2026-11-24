import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const authService = { register: vi.fn() };
  const toastService = { show: vi.fn() };

  beforeEach(async () => {
    authService.register.mockReset();
    toastService.show.mockReset();

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows field-level validation messages for invalid registration data', () => {
    component.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Full name is required.');
    expect(fixture.nativeElement.textContent).toContain('Email address is required.');
    expect(fixture.nativeElement.textContent).toContain('Mobile number is required.');
    expect(fixture.nativeElement.textContent).toContain('Password is required.');
    expect(fixture.nativeElement.textContent).toContain('Please confirm your password.');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('shows a success toast and navigates to login after registration', () => {
    authService.register.mockReturnValue(of({}));
    component.registerForm.setValue({
      fullName: 'Nancy Beauty',
      email: 'nancy@example.com',
      mobile: '1234567890',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.submit();

    expect(toastService.show).toHaveBeenCalledWith(
      'Registration successful. Please log in.',
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
