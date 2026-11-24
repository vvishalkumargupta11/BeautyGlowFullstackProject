import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {

  authService = inject(AuthService);

  private router = inject(Router);
   isAdmin(): boolean {
    return this.authService.getCachedUser()?.role === 'admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}