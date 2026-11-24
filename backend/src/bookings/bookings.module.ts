import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

import { Booking, BookingSchema } from './schemas/booking.schema.js';
import { UsersModule } from '../users/users.module.js';
import { SalonServicesModule } from '../salon-services/salon-services.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema
      }
    ]),
     UsersModule,
    SalonServicesModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {}