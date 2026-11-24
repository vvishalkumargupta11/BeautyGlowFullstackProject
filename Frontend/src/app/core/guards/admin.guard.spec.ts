import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const authService = {
    isLoggedIn: vi.fn(),
    getCachedUser: vi.fn(),
  };
  const executeGuard = () => TestBed.runInInjectionContext(
    () => adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );

  beforeEach(() => {
    authService.isLoggedIn.mockReset();
    authService.getCachedUser.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('allows authenticated admins', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getCachedUser.mockReturnValue({ role: 'admin' });

    expect(executeGuard()).toBe(true);
  });

  it('redirects authenticated non-admins to their profile', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getCachedUser.mockReturnValue({ role: 'customer' });
    const router = TestBed.inject(Router);

    expect(executeGuard()).toEqual(router.createUrlTree(['/profile']));
  });

  it('redirects unauthenticated users to login without accessing browser storage', () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.getCachedUser.mockReturnValue(null);
    const router = TestBed.inject(Router);

    expect(executeGuard()).toEqual(router.createUrlTree(['/login']));
  });
});
