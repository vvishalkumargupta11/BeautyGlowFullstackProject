import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  SalonService,
  SalonServicesResponse,
  SalonServiceResponse
} from '../models/salon-service.model';

@Injectable({
  providedIn: 'root'
})
export class SalonServiceApiService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/salon-services`;

  // Get all active services
  getAllServices(): Observable<SalonServicesResponse> {
    return this.http.get<SalonServicesResponse>(
      this.apiUrl,
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

  // Get service by ID
  getServiceById(id: string): Observable<SalonServiceResponse> {
    return this.http.get<SalonServiceResponse>(
      `${this.apiUrl}/${id}`,
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

  // Create new service
  createService(data: Partial<SalonService>): Observable<SalonServiceResponse> {
    return this.http.post<SalonServiceResponse>(
      this.apiUrl,
      data,
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

  // Update service
  updateService(
    id: string,
    data: Partial<SalonService>
  ): Observable<SalonServiceResponse> {
    return this.http.put<SalonServiceResponse>(
      `${this.apiUrl}/${id}`,
      data,
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

  // Delete service (soft delete)
  deleteService(id: string): Observable<SalonServiceResponse> {
    return this.http.delete<SalonServiceResponse>(
      `${this.apiUrl}/${id}`,
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

  // Restore service
  restoreService(id: string): Observable<SalonServiceResponse> {
    return this.http.put<SalonServiceResponse>(
      `${this.apiUrl}/${id}/restore`,
      {},
      { transferCache: false }
    ).pipe(timeout({ first: 10000 }));
  }

}