import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';
import {
  SalonService,
  SalonServiceResponse
} from '../../../../core/models/salon-service.model';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit-service.html',
  styleUrl: './edit-service.scss'
})
export class EditServiceComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private salonServiceApi = inject(SalonServiceApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private changeDetectorRef = inject(ChangeDetectorRef);

  serviceId = '';

  loading = false;
  saving = false;
  uploadingImage = false;

  errorMessage = '';
  successMessage = '';

  imagePreview = '';
  existingImageUrl = '';

  private temporaryImageUrl = '';

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    duration: [30, [Validators.required, Validators.min(1)]],
    image: [''],
    benefits: ['']
  });

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.serviceId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.serviceId) {
      this.errorMessage = 'Invalid service ID.';
      return;
    }

    this.loadService();

  }

  ngOnDestroy(): void {
    this.clearTemporaryImage();
  }

  loadService(): void {

    this.loading = true;
    this.errorMessage = '';

    this.salonServiceApi.getServiceById(this.serviceId)
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }))
      .subscribe({

        next: (response: SalonServiceResponse | SalonService) => {

          const service = response && 'service' in response
            ? response.service
            : response;

          if (!service?.name) {
            this.errorMessage = 'Service details not found.';
            return;
          }

          this.existingImageUrl = service.image || '';
          this.imagePreview = this.existingImageUrl;

          this.serviceForm.patchValue({
            name: service.name,
            category: service.category,
            description: service.description,
            price: service.price,
            duration: service.duration,
            image: service.image || '',
            benefits: service.benefits?.join(', ') || ''
          });

        },

        error: (error) => {

          console.error('Get Service API Error:', error);

          this.errorMessage =
            error.error?.message || 'Unable to load service details.';

        }

      });

  }

  // Select and upload new image
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

    this.clearTemporaryImage();

    this.temporaryImageUrl = URL.createObjectURL(file);
    this.imagePreview = this.temporaryImageUrl;

    this.uploadingImage = true;

    this.salonServiceApi.uploadServiceImage(file).subscribe({

      next: (response) => {

        this.serviceForm.patchValue({
          image: response.imageUrl
        });

        this.clearTemporaryImage();

        this.imagePreview = response.imageUrl;

        this.uploadingImage = false;

        this.successMessage = 'Image uploaded successfully!';

      },

      error: (error) => {

        console.error('Image upload error:', error);

        this.uploadingImage = false;

        this.serviceForm.patchValue({
          image: this.existingImageUrl
        });

        this.clearTemporaryImage();

        this.imagePreview = this.existingImageUrl;

        this.errorMessage =
          error.error?.message || 'Image upload failed.';

      }

    });

  }

  private clearTemporaryImage(): void {

    if (this.temporaryImageUrl) {

      URL.revokeObjectURL(this.temporaryImageUrl);

      this.temporaryImageUrl = '';

    }

  }

  // Update service
  submitForm(): void {

    if (this.uploadingImage) {
      this.errorMessage = 'Please wait until image upload completes.';
      return;
    }

    if (this.serviceForm.invalid) {

      this.serviceForm.markAllAsTouched();
      return;

    }

    this.saving = true;
    this.errorMessage = '';

    const formValue = this.serviceForm.getRawValue();

    const serviceData = {

      name: formValue.name ?? '',
      category: formValue.category ?? '',
      description: formValue.description ?? '',
      price: formValue.price ?? 0,
      duration: formValue.duration ?? 30,
      image: formValue.image ?? '',

      benefits: formValue.benefits
        ? formValue.benefits.split(',').map(item => item.trim()).filter(Boolean)
        : []

    };

    this.salonServiceApi.updateService(
      this.serviceId,
      serviceData
    ).subscribe({

      next: () => {

        this.saving = false;

        this.successMessage = 'Service updated successfully!';

        setTimeout(() => {
          this.router.navigate(['/admin/services']);
        }, 1000);

      },

      error: (error) => {

        console.error('Update service error:', error);

        this.saving = false;

        this.errorMessage =
          error.error?.message || 'Unable to update service.';

      }

    });

  }

}