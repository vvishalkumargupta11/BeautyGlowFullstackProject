import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('beautyglow-frontend');
  protected readonly menuOpen = signal(false);
  protected readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  isAdmin(): boolean {
    return this.authService.getCachedUser()?.role === 'admin';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}
