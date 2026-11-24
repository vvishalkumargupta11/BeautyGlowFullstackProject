import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardComponent } from './dashboard';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const authService = {
    getAdminDashboard: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    authService.getAdminDashboard.mockReset();
    authService.getAdminDashboard.mockReturnValue(of({
      message: 'Dashboard loaded',
      statistics: {
        totalCustomers: 4,
        totalAdmins: 1,
        totalUsers: 5,
      },
    }));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates dashboard data after each load', () => {
    expect(component.loading()).toBe(false);
    expect(component.dashboardData()?.statistics.totalUsers).toBe(5);

    authService.getAdminDashboard.mockReturnValue(of({
      message: 'Dashboard refreshed',
      statistics: {
        totalCustomers: 8,
        totalAdmins: 2,
        totalUsers: 10,
      },
    }));

    component.loadDashboard();
    fixture.detectChanges();

    expect(authService.getAdminDashboard).toHaveBeenCalledTimes(2);
    expect(component.loading()).toBe(false);
    expect(component.dashboardData()?.statistics.totalUsers).toBe(10);
    expect(fixture.nativeElement.textContent).toContain('10');
  });

  it('stops loading and shows an error when the request fails', () => {
    authService.getAdminDashboard.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadDashboard();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe('Unable to load dashboard statistics.');
    expect(fixture.nativeElement.textContent).not.toContain('Loading dashboard...');
  });

  it('links the Customers sidebar item to the customer management page', () => {
    const customersLink = fixture.nativeElement.querySelector(
      'a[href="/admin/customers"]'
    );

    expect(customersLink).toBeTruthy();
    expect(customersLink.textContent).toContain('Customers');
  });
});
