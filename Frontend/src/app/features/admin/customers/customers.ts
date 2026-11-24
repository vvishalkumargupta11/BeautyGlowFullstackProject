import {
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { RouterLink } from '@angular/router';
import { finalize, TimeoutError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Customer } from '../../../core/models/customer.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class CustomersComponent implements OnInit {

  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  customers = signal<Customer[]>([]);
  totalCustomers = signal(0);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCustomers();
    }
  }

  loadCustomers(): void {

    this.loading.set(true);
    this.errorMessage.set('');
    this.customers.set([]);
    this.totalCustomers.set(0);

    this.authService.getAllCustomers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.customers.set(response.customers ?? []);
          this.totalCustomers.set(response.total ?? 0);
        },
        error: (error: unknown) => {
          console.error('Customers API error:', error);
          this.errorMessage.set(
            error instanceof TimeoutError
              ? 'Customer request timed out. Please try again.'
              : 'Unable to load customers. Please check your connection and try again.'
          );
        }
      });
  }

  searchText = '';

get filteredCustomers(): Customer[] {
  const search = this.searchText.toLowerCase().trim();

  if (!search) {
    return this.customers();
  }

  return this.customers().filter(customer =>
    customer.name?.toLowerCase().includes(search) ||
    customer.email?.toLowerCase().includes(search) ||
    customer.mobile?.includes(search)
  );
}
}