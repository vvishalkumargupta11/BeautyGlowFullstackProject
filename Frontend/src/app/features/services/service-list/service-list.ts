import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { SalonService } from '../../../core/models/salon-service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss'
})
export class ServiceListComponent implements OnInit {

  private salonServiceApi = inject(SalonServiceApiService);
  private platformId = inject(PLATFORM_ID);
  private changeDetectorRef = inject(ChangeDetectorRef);

  services = signal<SalonService[]>([]);

  categories = signal<string[]>([]);

  selectedCategory = signal('All');

  searchText = '';

  loading = signal(false);

  errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadServices();
    }
  }

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
          const services = response.services ?? [];
          this.services.set(services);
          this.categories.set([
            'All',
            ...new Set(services.map(service => service.category))
          ]);
        },
        error: (error: unknown) => {
          console.error('Error loading public services:', error);
          this.errorMessage.set(
            'Unable to load services. Please try again later.'
          );
        }
      });
  }

  get filteredServices(): SalonService[] {
    const search = this.searchText.toLowerCase().trim();

    return this.services().filter(service => {
      const matchesCategory =
        this.selectedCategory() === 'All' ||
        service.category === this.selectedCategory();
      const matchesSearch = service.name.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

}