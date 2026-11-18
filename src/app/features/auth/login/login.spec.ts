import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const authService = { login: vi.fn() };
  const toastService = { show: vi.fn() };

  beforeEach(async () => {
    authService.login.mockReset();
    toastService.show.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows field-level validation messages for invalid login data', () => {
    component.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email address is required.');
    expect(fixture.nativeElement.textContent).toContain('Password is required.');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('shows a success toast and navigates admins to the dashboard', () => {
    authService.login.mockReturnValue(of({ user: { role: 'admin' } }));
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'password123',
    });

    component.submit();

    expect(toastService.show).toHaveBeenCalledWith('Login successful.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('navigates non-admin users to their profile after login', () => {
    authService.login.mockReturnValue(of({ user: { role: 'customer' } }));
    component.loginForm.setValue({
      email: 'nancy@example.com',
      password: 'password123',
    });

    component.submit();

    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
