import {
  Component,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-service.html',
  styleUrl: './add-service.scss'
})
export class AddServiceComponent {

  private fb = inject(FormBuilder);
  private salonServiceApi = inject(SalonServiceApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loading = false;
  uploadingImage = false;

  errorMessage = '';
  successMessage = '';

  imagePreview = '';

  serviceForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    duration: [30, [Validators.required, Validators.min(1)]],
    image: [''],
    benefits: ['']
  });

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.errorMessage = '';
    this.successMessage = '';

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Only JPG, PNG and WEBP images are allowed.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image size must be less than 5 MB.';
      input.value = '';
      return;
    }

    this.imagePreview = URL.createObjectURL(file);

    this.uploadingImage = true;

    this.salonServiceApi.uploadServiceImage(file).subscribe({

      next: (response) => {

        this.serviceForm.patchValue({
          image: response.imageUrl
        });

        this.uploadingImage = false;
        this.successMessage = 'Image uploaded successfully!';

      },

      error: (error) => {

        console.error('Image upload error:', error);

        this.uploadingImage = false;
        this.errorMessage =
          error.error?.message || 'Image upload failed.';

        this.serviceForm.patchValue({
          image: ''
        });

        this.imagePreview = '';

      }

    });

  }

  submitForm(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    if (this.uploadingImage) {
      this.errorMessage = 'Please wait until image upload completes.';
      return;
    }

    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.serviceForm.getRawValue();

    const serviceData = {
      ...formValue,
      benefits: formValue.benefits
        ? formValue.benefits.split(',').map(item => item.trim()).filter(Boolean)
        : []
    };

    this.salonServiceApi.createService(serviceData).subscribe({

      next: () => {

        this.loading = false;
        this.successMessage = 'Service added successfully!';

        setTimeout(() => {
          this.router.navigate(['/admin/services']);
        }, 1000);

      },

      error: (error) => {

        console.error('Add service error:', error);

        this.loading = false;

        this.errorMessage =
          error.error?.message || 'Unable to add service.';

      }

    });

  }

}