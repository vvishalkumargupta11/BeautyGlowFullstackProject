import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss'
})
export class CustomerDetailsComponent implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);

  customer = signal<Customer | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');

    if (customerId) {
      this.loadCustomer(customerId);
    } else {
      this.errorMessage.set('Invalid customer ID.');
      this.loading.set(false);
    }
  }

  loadCustomer(id: string): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.customer.set(null);

    this.authService.getCustomerById(id)
      .pipe(finalize(() => {
        this.loading.set(false);
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.customer.set(response.customer);
        },
        error: (error: unknown) => {
          console.error('Customer details API error:', error);
          this.errorMessage.set('Unable to load customer details.');
        }
      });
  }
}