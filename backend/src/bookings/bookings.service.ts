import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Booking,
    BookingDocument
} from './schemas/booking.schema.js';

import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UsersService } from '../users/users.service.js';
import { SalonServicesService } from '../salon-services/salon-services.service.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';

@Injectable()
export class BookingsService {

    constructor(
        @InjectModel(Booking.name)
        private readonly bookingModel: Model<BookingDocument>,

        private readonly usersService: UsersService,

        private readonly salonServicesService: SalonServicesService
    ) { }

    async getAllBookings() {
        const bookings = await this.bookingModel
            .find()
            .populate('customerId', 'name email mobile')
            .populate('serviceId', 'name category image price duration')
            .sort({ createdAt: -1 })
            .exec();

        return {
            message: 'All bookings fetched successfully.',
            total: bookings.length,
            bookings
        };
    }
    async updateBookingStatus(
        bookingId: string,
        updateBookingStatusDto: UpdateBookingStatusDto
    ) {

        // 1. Validate booking ID
        if (!Types.ObjectId.isValid(bookingId)) {
            throw new BadRequestException('Invalid booking ID.');
        }

        // 2. Find booking
        const booking = await this.bookingModel.findById(bookingId);

        if (!booking) {
            throw new NotFoundException('Booking not found.');
        }

        // 3. Get current and requested status
        const currentStatus = booking.status;
        const newStatus = updateBookingStatusDto.status;

        // 4. Prevent updating completed or cancelled bookings
        if (currentStatus === 'completed' || currentStatus === 'cancelled') {
            throw new BadRequestException(
                `Cannot update a ${currentStatus} booking.`
            );
        }

        // 5. Validate status transitions
        const allowedTransitions: Record<string, string[]> = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['completed', 'cancelled']
        };

        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
            throw new BadRequestException(
                `Cannot change booking status from ${currentStatus} to ${newStatus}.`
            );
        }

        // 6. Update booking status
        booking.status = newStatus;

        await booking.save();

        // 7. Return updated booking with customer and service details
        const updatedBooking = await this.bookingModel
            .findById(bookingId)
            .populate('customerId', 'name email mobile')
            .populate('serviceId', 'name category image price duration')
            .exec();

        return {
            message: 'Booking status updated successfully.',
            booking: updatedBooking
        };
    }
    async getMyBookings(userId: string) {
        const customerObjectId = new Types.ObjectId(userId);


        const bookings = await this.bookingModel
            .find({ customerId: customerObjectId })
            .populate('serviceId', 'name category image price duration')
            .sort({ createdAt: -1 })
            .exec();



        return {
            message: 'Bookings fetched successfully.',
            total: bookings.length,
            bookings
        };
    }
    async createBooking(
        userId: string,
        createBookingDto: CreateBookingDto
    ) {

        // 1. Find customer
        const customer = await this.usersService.findById(userId);

        if (!customer) {
            throw new NotFoundException('Customer not found.');
        }

        if (customer.role !== 'customer') {
            throw new BadRequestException('Only customers can book appointments.');
        }

        // 2. Find selected service
        const service = await this.salonServicesService.getServiceById(
            createBookingDto.serviceId
        );

        if (!service || !service.isActive) {
            throw new NotFoundException('Selected service is not available.');
        }

        // 3. Prevent past-date bookings
        const selectedDate = new Date(
            `${createBookingDto.appointmentDate}T00:00:00`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            throw new BadRequestException(
                'You cannot book an appointment for a past date.'
            );
        }

        // 4. Check whether the time slot is already booked
        const existingBooking = await this.bookingModel.findOne({
            appointmentDate: createBookingDto.appointmentDate,
            appointmentTime: createBookingDto.appointmentTime,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            throw new ConflictException(
                'This appointment slot is already booked. Please select another time.'
            );
        }

        // 5. Save booking
        const booking = await this.bookingModel.create({

            customerId: customer._id,

            serviceId: service._id,

            customerName: customer.name,

            email: customer.email,

            mobile: customer.mobile,

            appointmentDate: createBookingDto.appointmentDate,

            appointmentTime: createBookingDto.appointmentTime,

            amount: service.price,

            status: 'pending'

        });

        return {
            message: 'Appointment booked successfully.',
            booking
        };

    }

}