import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  services = [
    {
      name: 'Hair Styling',
      description: 'Professional haircuts and styling.',
      price: 500,
      icon: 'bi-scissors'
    },
    {
      name: 'Facial Treatment',
      description: 'Relaxing and glowing skin treatments.',
      price: 1000,
      icon: 'bi-stars'
    },
    {
      name: 'Bridal Makeup',
      description: 'Beautiful makeup for your special day.',
      price: 5000,
      icon: 'bi-brush'
    },
    {
      name: 'Manicure',
      description: 'Professional nail care and beauty.',
      price: 400,
      icon: 'bi-hand-index'
    }
  ];

  testimonials = [
    {
      name: 'Priya Sharma',
      review: 'Amazing service and very professional staff.',
      rating: 5
    },
    {
      name: 'Sneha Patel',
      review: 'Beautiful experience. Highly recommended!',
      rating: 5
    },
    {
      name: 'Neha Verma',
      review: 'Very friendly staff and excellent service.',
      rating: 5
    }
  ];

}