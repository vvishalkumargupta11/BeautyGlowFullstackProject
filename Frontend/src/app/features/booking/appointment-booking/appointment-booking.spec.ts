import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { AppointmentBookingComponent } from './appointment-booking';

describe('AppointmentBookingComponent', () => {
  let component: AppointmentBookingComponent;
  let fixture: ComponentFixture<AppointmentBookingComponent>;

  const serviceApi = {
    getServiceById: vi.fn(),
  };

  const authService = {
    createBooking: vi.fn(),
  };

  beforeEach(async () => {
    serviceApi.getServiceById.mockReset();
    authService.createBooking.mockReset();
    serviceApi.getServiceById.mockReturnValue(of({
      message: 'Salon service details fetched successfully',
      service: {
        _id: 'service-1',
        name: 'Hair Spa',
        category: 'Hair',
        description: 'Deep conditioning treatment',
        price: 1200,
        duration: 60,
        image: '',
        benefits: ['Smoothness'],
        isActive: true,
      },
    }));
    authService.createBooking.mockReturnValue(of({
      message: 'Appointment booked successfully.',
      booking: {},
    }));

    await TestBed.configureTestingModule({
      imports: [AppointmentBookingComponent],
      providers: [
        provideRouter([]),
        { provide: SalonServiceApiService, useValue: serviceApi },
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'service-1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the selected service and exits loading', () => {
    expect(component.loading).toBe(false);
    expect(component.service?.name).toBe('Hair Spa');
    expect(fixture.nativeElement.textContent).toContain('Hair Spa');
    expect(fixture.nativeElement.textContent).not.toContain('Loading selected service...');
  });

  it('exits loading and displays an error when the service request fails', () => {
    serviceApi.getServiceById.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadService();
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Unable to load the selected service.');
    expect(fixture.nativeElement.textContent).toContain('Unable to Load Service');
  });

  it('saves the booking with the service and appointment details', () => {
    component.customerName = 'Utpal';
    component.email = 'utpal@example.com';
    component.mobile = '1234567890';
    component.appointmentDate = '2026-11-25';
    component.selectedTime = '10:00 AM';

    component.bookAppointment();
    fixture.detectChanges();

    expect(authService.createBooking).toHaveBeenCalledWith({
      serviceId: 'service-1',
      appointmentDate: '2026-11-25',
      appointmentTime: '10:00 AM',
    });
    expect(component.saving).toBe(false);
    expect(component.successMessage).toBe('Appointment booked successfully.');
    expect(fixture.nativeElement.textContent).toContain('Appointment booked successfully.');
  });

  it('displays the API error when saving a booking fails', () => {
    authService.createBooking.mockReturnValue(
      throwError(() => ({
        error: { message: 'This appointment slot is already booked.' },
      })),
    );
    component.customerName = 'Utpal';
    component.email = 'utpal@example.com';
    component.mobile = '1234567890';
    component.appointmentDate = '2026-11-25';
    component.selectedTime = '10:00 AM';

    component.bookAppointment();
    fixture.detectChanges();

    expect(component.saving).toBe(false);
    expect(component.errorMessage).toBe('This appointment slot is already booked.');
    expect(fixture.nativeElement.textContent).toContain(
      'This appointment slot is already booked.',
    );
  });
});
