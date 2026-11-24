import {
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';

import { SalonServicesService } from './salon-services.service.js';
import { isValidObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateSalonServiceDto } from './dto/create-salon-service.dto.js';
import { UpdateSalonServiceDto } from './dto/update-salon-service.dto.js';

@Controller('salon-services')
export class SalonServicesController {

    constructor(
        private readonly salonServicesService: SalonServicesService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    // Add new salon service
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createService(@Body() data: CreateSalonServiceDto) {
        const service = await this.salonServicesService.createService(data);

        return {
            message: 'Salon service created successfully',
            service
        };
    }
    // Upload salon service image - Admin only
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('upload-image')
    @UseInterceptors(
        FileInterceptor('image', {
            limits: {
                fileSize: 5 * 1024 * 1024 // 5 MB
            }
        })
    )
    async uploadServiceImage(
        @UploadedFile() file: Express.Multer.File
    ) {

        if (!file) {
            throw new BadRequestException('Please select an image.');
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Only JPG, PNG and WEBP images are allowed.'
            );
        }

        const imageUrl = await this.cloudinaryService.uploadImage(file);

        return {
            message: 'Service image uploaded successfully',
            imageUrl
        };

    }

    // Get all active salon services
    @Get()
    async getAllServices() {
        const services = await this.salonServicesService.getAllServices();

        return {
            message: 'Salon services fetched successfully',
            total: services.length,
            services
        };
    }
    // Get all services (Active + Inactive) - Admin only
    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getAllServicesForAdmin() {

        const services =
            await this.salonServicesService.getAllServicesForAdmin();

        return {
            message: 'All salon services fetched successfully',
            total: services.length,
            services
        };

    }

    // Get service by ID
    @Get(':id')
    async getServiceById(@Param('id') id: string) {

        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid service ID');
        }

        const service = await this.salonServicesService.getServiceById(id);

        if (!service) {
            throw new NotFoundException('Salon service not found');
        }

        return {
            message: 'Salon service details fetched successfully',
            service
        };
    }
    // Update salon service
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async updateService(
        @Param('id') id: string,
        @Body() data: UpdateSalonServiceDto
    ) {

        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid service ID');
        }

        const service = await this.salonServicesService.updateService(
            id,
            data
        );

        if (!service) {
            throw new NotFoundException('Salon service not found');
        }

        return {
            message: 'Salon service updated successfully',
            service
        };
    }
    // Delete salon service (Soft Delete)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteService(@Param('id') id: string) {

        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid service ID');
        }

        const service = await this.salonServicesService.deleteService(id);

        if (!service) {
            throw new NotFoundException('Salon service not found');
        }

        return {
            message: 'Salon service deactivated successfully',
            service
        };
    }
    // Restore inactive salon service
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/restore')
    async restoreService(@Param('id') id: string) {

        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid service ID');
        }

        const service = await this.salonServicesService.restoreService(id);

        if (!service) {
            throw new NotFoundException('Salon service not found');
        }

        return {
            message: 'Salon service restored successfully',
            service
        };
    }


}