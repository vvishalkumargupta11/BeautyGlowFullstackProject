import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getCachedUser();

  console.log('ADMIN GUARD CHECK');
  console.log('Is Logged In:', isLoggedIn);
  console.log('Cached User:', user);
  console.log('User Role:', user?.role);

  if (isLoggedIn && user?.role === 'admin') {
    console.log('Admin access granted');
    return true;
  }

  console.log('Admin access denied');

  return router.createUrlTree([
    isLoggedIn ? '/profile' : '/login'
  ]);
};