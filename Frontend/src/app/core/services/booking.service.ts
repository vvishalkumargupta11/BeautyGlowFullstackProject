import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AllBookingsResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/bookings`;

  // Fetch logged-in customer's bookings
  getMyBookings(): Observable<AllBookingsResponse> {

    return this.http.get<AllBookingsResponse>(
      this.apiUrl,
      {
        transferCache: false
      }
    ).pipe(
      timeout({ first: 10000 })
    );

  }

}