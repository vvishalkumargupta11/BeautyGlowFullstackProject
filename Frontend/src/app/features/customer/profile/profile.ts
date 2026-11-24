import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthenticatedUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  profile: AuthenticatedUser | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.profile = this.authService.getCachedUser();
    this.loading = this.profile === null;
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.user;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = this.profile
          ? 'Showing saved profile. Unable to refresh profile details.'
          : 'Unable to load profile. Please login again.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}