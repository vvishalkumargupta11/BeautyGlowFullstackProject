import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthService} from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    fullName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', Validators.required]
  });

  get passwordsDoNotMatch(): boolean {
    const { password, confirmPassword } = this.registerForm.controls;

    return confirmPassword.touched &&
      !!confirmPassword.value &&
      password.value !== confirmPassword.value;
  }

  submit(): void {

    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.registerForm.getRawValue();

    if (userData.password !== confirmPassword) {
      this.registerForm.controls.confirmPassword.markAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(userData).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.show('Registration successful. Please log in.');
        this.router.navigate(['/login']);
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}