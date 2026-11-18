import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerDetailsComponent } from './customer-details';

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;

  const authService = {
    getCustomerById: vi.fn(),
  };

  beforeEach(async () => {
    authService.getCustomerById.mockReset();
    authService.getCustomerById.mockReturnValue(of({
      message: 'Customer details fetched successfully',
      customer: {
        _id: 'customer-1',
        name: 'Nancy Customer',
        email: 'customer@example.com',
        mobile: '1234567890',
        role: 'customer',
        createdAt: '2026-11-17T00:00:00.000Z',
      },
    }));

    await TestBed.configureTestingModule({
      imports: [CustomerDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'customer-1' } } },
        },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the customer details and stops loading after success', () => {
    expect(authService.getCustomerById).toHaveBeenCalledWith('customer-1');
    expect(component.loading()).toBe(false);
    expect(component.customer()?.name).toBe('Nancy Customer');
    expect(fixture.nativeElement.textContent).toContain('Nancy Customer');
  });

  it('stops loading and displays an error when the request fails', () => {
    authService.getCustomerById.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadCustomer('customer-1');
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe('Unable to load customer details.');
  });
});
