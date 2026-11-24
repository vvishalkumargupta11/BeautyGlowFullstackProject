import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly message = signal<string | null>(null);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.message.set(message);
    this.timeoutId = setTimeout(() => {
      this.dismiss();
    }, 3500);
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.message.set(null);
  }
}
