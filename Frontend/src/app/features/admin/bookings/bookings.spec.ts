import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Bookings } from './bookings';

describe('Bookings', () => {
  let component: Bookings;
  let fixture: ComponentFixture<Bookings>;

  const authService = {
    getAllBookings: vi.fn(),
    updateBookingStatus: vi.fn(),
  };

  beforeEach(async () => {
    authService.getAllBookings.mockReset();
    authService.getAllBookings.mockReturnValue(of({
      message: 'Bookings fetched successfully',
      total: 1,
      bookings: [{
        _id: 'booking-1',
        customerId: {
          _id: 'customer-1',
          name: 'Taylor Customer',
          email: 'taylor@example.com',
          mobile: '1234567890',
        },
        serviceId: {
          _id: 'service-1',
          name: 'Hair Spa',
          category: 'Hair',
          price: 1200,
          duration: 60,
          image: '',
        },
        customerName: 'Taylor Customer',
        email: 'taylor@example.com',
        mobile: '1234567890',
        appointmentDate: '2026-11-20T00:00:00.000Z',
        appointmentTime: '10:00 AM',
        amount: 1200,
        status: 'pending' as const,
        createdAt: '2026-11-19T00:00:00.000Z',
        updatedAt: '2026-11-19T00:00:00.000Z',
      }],
    }));

    await TestBed.configureTestingModule({
      imports: [Bookings],
      providers: [
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Bookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders bookings and exits the loading state', () => {
    expect(component.loading()).toBe(false);
    expect(component.bookings()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Taylor Customer');
    expect(fixture.nativeElement.textContent).toContain('Hair Spa');
    expect(fixture.nativeElement.textContent).not.toContain('Loading bookings...');
  });

  it('shows status-appropriate actions for pending and confirmed bookings', () => {
    const pendingActions = fixture.nativeElement.querySelector(
      '.booking-actions',
    ) as HTMLElement;

    expect(pendingActions.textContent).toContain('Confirm');
    expect(pendingActions.textContent).toContain('Cancel');

    component.bookings.update(bookings =>
      bookings.map(booking => ({ ...booking, status: 'confirmed' })),
    );
    fixture.detectChanges();

    const confirmedActions = fixture.nativeElement.querySelector(
      '.booking-actions',
    ) as HTMLElement;

    expect(confirmedActions.textContent).toContain('Complete');
    expect(confirmedActions.textContent).toContain('Cancel');
    expect(confirmedActions.textContent).not.toContain('Confirm');
  });

  it('exits loading and displays an error when the request fails', () => {
    authService.getAllBookings.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadBookings();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe('Unable to fetch bookings.');
    expect(fixture.nativeElement.textContent).toContain('Unable to fetch bookings.');
  });
});
