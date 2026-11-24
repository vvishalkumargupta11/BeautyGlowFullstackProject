import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class GalleryComponent {

  images = [
    {
      title: 'Hair Styling',
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600'
    },
    {
      title: 'Beauty Treatment',
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'
    },
    {
      title: 'Salon Interior',
      url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600'
    },
    {
      title: 'Makeup',
      url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600'
    }
  ];

}