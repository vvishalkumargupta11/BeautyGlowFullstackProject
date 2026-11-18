import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, CustomersResponse } from '../models/customer.model';


export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
}

export interface ProfileResponse {
  message: string;
  user: AuthenticatedUser;
}

export interface AdminDashboardResponse {
  message: string;
  statistics: {
    totalCustomers: number;
    totalAdmins: number;
    totalUsers: number;
  };
}

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return typeof user['id'] === 'string' &&
    typeof user['fullName'] === 'string' &&
    typeof user['email'] === 'string' &&
    typeof user['mobile'] === 'string' &&
    typeof user['role'] === 'string';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private readonly authenticated = signal(
    typeof localStorage !== 'undefined' &&
      !!localStorage.getItem('accessToken')
  );

  private apiUrl = `${environment.apiUrl}/auth`;

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authenticated.set(true);
        }
      })
    );
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`).pipe(
      timeout({ first: 10000 })
    );
  }

 getAdminDashboard(): Observable<AdminDashboardResponse> {
  return this.http.get<AdminDashboardResponse>(
    `${environment.apiUrl}/admin/dashboard`,
    {
      transferCache: false
    }
  ).pipe(
    timeout({ first: 10000 })
  );
}

  getCachedUser(): AuthenticatedUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      const user: unknown = JSON.parse(storedUser);
      return isAuthenticatedUser(user) ? user : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  getAllCustomers(): Observable<CustomersResponse> {
  return this.http.get<CustomersResponse>(
    `${environment.apiUrl}/users/customers`,
    {
      transferCache: false
    }
  ).pipe(
    timeout({ first: 10000 })
  );
}

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    this.authenticated.set(false);
  }

  isLoggedIn(): boolean {
    return this.authenticated();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
getCustomerById(id: string) {
  return this.http.get<any>(
    `${environment.apiUrl}/users/customers/${id}`,
    {
      transferCache: false
    }
  ).pipe(
    timeout({ first: 10000 })
  );
}
}