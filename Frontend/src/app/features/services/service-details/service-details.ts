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

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import { finalize } from 'rxjs';

import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { SalonService } from '../../../core/models/salon-service.model';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.scss'
})
export class ServiceDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private salonServiceApi = inject(SalonServiceApiService);
  private platformId = inject(PLATFORM_ID);
  private changeDetectorRef = inject(ChangeDetectorRef);

  service?: SalonService;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.loadServiceDetails();
    }

  }

  loadServiceDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid service ID.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

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
          console.error('Error loading service details:', error);
          this.errorMessage = 'Unable to load service details.';
        }
      });
  }

}