import {
  Injectable,
  inject,
  signal,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = `${environment.apiUrl}/auth`;

  private isBrowser = isPlatformBrowser(this.platformId);

  isAuthenticated = signal<boolean>(
    this.isBrowser && !!localStorage.getItem('accessToken')
  );

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {

        if (this.isBrowser) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isAuthenticated.set(true);
        }

      })
    );
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      this.isAuthenticated.set(false);
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}