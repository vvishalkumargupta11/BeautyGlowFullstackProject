import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';
import { SalonService } from '../../../../core/models/salon-service.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss'
})
export class ServiceListComponent implements OnInit {

  private salonServiceApi = inject(SalonServiceApiService);
  private platformId = inject(PLATFORM_ID);
  private changeDetectorRef = inject(ChangeDetectorRef);

  services = signal<SalonService[]>([]);

  searchText = '';

  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadServices();
    }
  }

  // Load all active services
  loadServices(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.salonServiceApi.getAllServices()
      .pipe(finalize(() => {
        this.loading.set(false);
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.services.set(response.services ?? []);
        },
        error: (error: unknown) => {
          console.error('Error loading services:', error);
          this.errorMessage.set('Unable to load salon services.');
        }
      });
  }

  // Search services
  get filteredServices(): SalonService[] {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      return this.services();
    }

    return this.services().filter(service =>
      service.name.toLowerCase().includes(search) ||
      service.category.toLowerCase().includes(search)
    );
  }

  // Delete service
  deleteService(id: string): void {

    if (!confirm('Are you sure you want to deactivate this service?')) {
      return;
    }

    this.salonServiceApi.deleteService(id).subscribe({

      next: () => {
        alert('Service deactivated successfully!');
        this.loadServices();
      },

      error: (error) => {
        console.error('Delete service error:', error);
        alert('Unable to deactivate service.');
      }

    });

  }

}