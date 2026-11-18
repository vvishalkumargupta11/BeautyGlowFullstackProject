import { Injectable } from '@angular/core';
import { BeautyService } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class BeautyServiceData {

  private services: BeautyService[] = [

    {
      id: 1,
      name: 'Hair Styling',
      category: 'Hair Care',
      description: 'Professional haircut and styling services.',
      price: 500,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1560869713-da86a9ec9e7e?w=600',
      benefits: [
        'Professional hair styling',
        'Premium hair products',
        'Expert stylist'
      ]
    },

    {
      id: 2,
      name: 'Hair Spa',
      category: 'Hair Care',
      description: 'Relaxing hair spa treatment for healthy hair.',
      price: 800,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600',
      benefits: [
        'Deep conditioning',
        'Hair nourishment',
        'Relaxing scalp massage'
      ]
    },

    {
      id: 3,
      name: 'Facial Treatment',
      category: 'Skin Care',
      description: 'Premium facial treatment for glowing skin.',
      price: 1000,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
      benefits: [
        'Skin cleansing',
        'Skin hydration',
        'Relaxing facial massage'
      ]
    },

    {
      id: 4,
      name: 'Bridal Makeup',
      category: 'Makeup',
      description: 'Professional bridal makeup for your special day.',
      price: 8000,
      duration: 120,
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600',
      benefits: [
        'Professional makeup artist',
        'Premium makeup products',
        'Customized bridal look'
      ]
    },

    {
      id: 5,
      name: 'Manicure',
      category: 'Nail Care',
      description: 'Professional nail care and hand treatment.',
      price: 400,
      duration: 40,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600',
      benefits: [
        'Nail shaping',
        'Cuticle care',
        'Hand massage'
      ]
    },

    {
      id: 6,
      name: 'Pedicure',
      category: 'Nail Care',
      description: 'Relaxing foot care and beauty treatment.',
      price: 600,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600',
      benefits: [
        'Foot cleaning',
        'Nail care',
        'Foot massage'
      ]
    }

  ];

  getServices(): BeautyService[] {
    return this.services;
  }

  getServiceById(id: number): BeautyService | undefined {
    return this.services.find(service => service.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.services.map(service => service.category))];
  }

}