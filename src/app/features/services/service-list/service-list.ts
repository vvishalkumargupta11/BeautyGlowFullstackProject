import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BeautyServiceData } from '../../../core/services/beauty-service';
import { BeautyService } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss'
})
export class ServiceListComponent implements OnInit {

  services: BeautyService[] = [];

  categories: string[] = [];

  selectedCategory = 'All';

  searchText = '';

  constructor(private beautyService: BeautyServiceData) {}

  ngOnInit(): void {

    this.services = this.beautyService.getServices();

    this.categories = [
      'All',
      ...this.beautyService.getCategories()
    ];

  }

  get filteredServices(): BeautyService[] {

    return this.services.filter(service => {

      const matchesCategory =
        this.selectedCategory === 'All' ||
        service.category === this.selectedCategory;

      const matchesSearch =
        service.name.toLowerCase().includes(
          this.searchText.toLowerCase()
        );

      return matchesCategory && matchesSearch;

    });

  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

}