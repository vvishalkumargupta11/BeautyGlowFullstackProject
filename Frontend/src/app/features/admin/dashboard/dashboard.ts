import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize, TimeoutError } from 'rxjs';
import {
  AdminDashboardResponse,
  AuthService
} from '../../../core/services/auth.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  dashboardData = signal<AdminDashboardResponse | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.dashboardData.set(null);

    this.authService.getAdminDashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.dashboardData.set(response);
        },
        error: (error: unknown) => {
          console.error('Dashboard API error:', error);
          this.errorMessage.set(
            error instanceof TimeoutError
              ? 'Dashboard request timed out. Please try again.'
              : 'Unable to load dashboard statistics.'
          );
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}