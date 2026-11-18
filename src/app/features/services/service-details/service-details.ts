import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BeautyServiceData } from '../../../core/services/beauty-service';
import { BeautyService } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.scss'
})
export class ServiceDetailsComponent implements OnInit {

  service?: BeautyService;

  constructor(
    private route: ActivatedRoute,
    private beautyService: BeautyServiceData
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service = this.beautyService.getServiceById(id);

  }

}