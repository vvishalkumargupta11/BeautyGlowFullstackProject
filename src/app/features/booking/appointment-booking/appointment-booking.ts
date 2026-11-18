import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BeautyServiceData } from '../../../core/services/beauty-service';
import { BeautyService } from '../../../core/models/service.model';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.scss'
})
export class AppointmentBookingComponent implements OnInit {

  service?: BeautyService;

  customerName = '';
  email = '';
  mobile = '';

  appointmentDate = '';
  selectedTime = '';

  availableTimes = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beautyService: BeautyServiceData
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service = this.beautyService.getServiceById(id);

  }

  get minimumDate(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  bookAppointment(): void {

    if (
      !this.customerName ||
      !this.email ||
      !this.mobile ||
      !this.appointmentDate ||
      !this.selectedTime
    ) {
      alert('Please complete all booking details.');
      return;
    }

    const booking = {
      customerName: this.customerName,
      email: this.email,
      mobile: this.mobile,
      service: this.service?.name,
      serviceId: this.service?.id,
      date: this.appointmentDate,
      time: this.selectedTime,
      amount: this.service?.price
    };

    console.log('Booking Details:', booking);

    alert('Booking form submitted successfully!');

    this.router.navigate(['/services']);

  }

}