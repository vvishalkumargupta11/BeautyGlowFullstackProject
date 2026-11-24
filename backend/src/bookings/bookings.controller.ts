import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Patch,
    Param
} from '@nestjs/common';

import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';

@Controller('bookings')
export class BookingsController {

    constructor(
        private readonly bookingsService: BookingsService
    ) { }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getAllBookings() {
        return this.bookingsService.getAllBookings();
    }
    @Patch('admin/:id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async updateBookingStatus(
        @Param('id') bookingId: string,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto
    ) {
        return this.bookingsService.updateBookingStatus(
            bookingId,
            updateBookingStatusDto
        );
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyBookings(
        @Req() request: {
            user: {
                userId: string;
                email: string;
                role: string;
            }
        }
    ) {
        return this.bookingsService.getMyBookings(request.user.userId);
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createBooking(
        @Req() request: {
            user: {
                userId: string;
                email: string;
                role: string;
            }
        },
        @Body() createBookingDto: CreateBookingDto
    ) {

        return this.bookingsService.createBooking(
            request.user.userId,
            createBookingDto
        );

    }

}