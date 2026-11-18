import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  SalonService,
  SalonServiceSchema
} from './schemas/salon-service.schema.js';

import { SalonServicesController } from './salon-services.controller.js';
import { SalonServicesService } from './salon-services.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SalonService.name,
        schema: SalonServiceSchema
      }
    ])
  ],
  controllers: [SalonServicesController],
  providers: [SalonServicesService],
  exports: [SalonServicesService]
})
export class SalonServicesModule {}