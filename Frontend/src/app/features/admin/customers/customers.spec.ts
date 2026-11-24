import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CustomersComponent } from './customers';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;

  const authService = {
    getAllCustomers: vi.fn(),
  };

  beforeEach(async () => {
    authService.getAllCustomers.mockReset();
    authService.getAllCustomers.mockReturnValue(of({
      message: 'Customers fetched successfully',
      total: 1,
      customers: [{
        _id: 'customer-1',
        name: 'Nancy Customer',
        email: 'customer@example.com',
        mobile: '1234567890',
        role: 'customer',
        createdAt: '2026-11-17T00:00:00.000Z',
      }],
    }));

    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders customer data and exits the loading state', () => {
    expect(component.loading()).toBe(false);
    expect(component.totalCustomers()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Nancy Customer');
    expect(fixture.nativeElement.textContent).not.toContain('Loading customers...');
  });

  it('links back to the admin dashboard', () => {
    const dashboardLink = fixture.nativeElement.querySelector(
      'a[href="/admin/dashboard"]'
    );

    expect(dashboardLink).toBeTruthy();
    expect(dashboardLink.textContent).toContain('Dashboard');
  });

  it('exits the loading state and displays an error when the request fails', () => {
    authService.getAllCustomers.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadCustomers();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toContain('Unable to load customers.');
    expect(fixture.nativeElement.textContent).toContain('Unable to load customers.');
  });
});
