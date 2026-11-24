import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import {
  AuthService,
  Booking
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings implements OnInit {

  private authService = inject(AuthService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  bookings = signal<Booking[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  updatingBookingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBookings();
  }

  // Fetch all bookings
  loadBookings(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.getAllBookings()
      .pipe(finalize(() => {
        this.loading.set(false);
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({

        next: (response) => {
          this.bookings.set(response.bookings ?? []);
        },

        error: (error) => {
          console.error('Bookings API Error:', error);

          this.errorMessage.set(
            error.error?.message || 'Unable to fetch bookings.'
          );
        }

      });
  }

  // Update booking status
  updateStatus(
    bookingId: string,
    status: 'confirmed' | 'completed' | 'cancelled'
  ): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.updatingBookingId()) {
      return;
    }

    this.updatingBookingId.set(bookingId);

    this.authService.updateBookingStatus(bookingId, status)
      .pipe(finalize(() => {
        this.updatingBookingId.set(null);
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({

        next: (response) => {

          this.successMessage.set(
            response.message || 'Booking status updated successfully.'
          );

          // Refresh booking table
          this.loadBookings();

        },

        error: (error) => {

          console.error('Booking Status Update Error:', error);

          this.errorMessage.set(
            error.error?.message || 'Unable to update booking status.'
          );

        }

      });
  }

}