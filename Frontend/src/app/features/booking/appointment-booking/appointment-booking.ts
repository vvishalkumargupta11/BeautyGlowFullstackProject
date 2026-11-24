import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { SalonService } from '../../../core/models/salon-service.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.scss'
})
export class AppointmentBookingComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private salonServiceApi = inject(SalonServiceApiService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private changeDetectorRef = inject(ChangeDetectorRef);

  service?: SalonService;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  customerName = '';
  email = '';
  mobile = '';

  appointmentDate = '';
  selectedTime = '';

  availableTimes = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadService();
    }
  }

  loadService(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid service ID.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.service = undefined;

    this.salonServiceApi.getServiceById(id)
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.service = response.service;
        },
        error: (error) => {
          console.error('Error loading booking service:', error);
          this.errorMessage = 'Unable to load the selected service.';
        }
      });
  }

  get minimumDate(): string {

    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  bookAppointment(): void {

    if (this.saving || this.successMessage) {
      return;
    }

    if (
      !this.service ||
      !this.customerName ||
      !this.email ||
      !this.mobile ||
      !this.appointmentDate ||
      !this.selectedTime
    ) {
      this.errorMessage = 'Please complete all booking details.';
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    this.authService.createBooking({
      serviceId: this.service._id,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.selectedTime
    })
      .pipe(finalize(() => {
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.successMessage =
            response.message || 'Appointment booked successfully.';
        },
        error: (error) => {
          console.error('Appointment booking error:', error);
          this.errorMessage =
            error.error?.message || 'Unable to book appointment. Please try again.';
        }
      });
  }

}