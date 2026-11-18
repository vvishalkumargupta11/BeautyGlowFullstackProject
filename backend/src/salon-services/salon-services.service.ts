import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  SalonService,
  SalonServiceDocument
} from './schemas/salon-service.schema.js';

@Injectable()
export class SalonServicesService {

  constructor(
    @InjectModel(SalonService.name)
    private salonServiceModel: Model<SalonServiceDocument>
  ) {}

  // Add new salon service
  async createService(data: Partial<SalonService>) {
    const service = new this.salonServiceModel(data);
    return service.save();
  }

  // Get all active salon services
  async getAllServices() {
    return this.salonServiceModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get service by ID
  async getServiceById(id: string) {
    return this.salonServiceModel.findById(id).exec();
  }

  // Update salon service
async updateService(id: string, data: Partial<SalonService>) {
  return this.salonServiceModel.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  ).exec();
}
// Delete salon service (Soft Delete)
async deleteService(id: string) {
  return this.salonServiceModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).exec();
}
// Restore inactive salon service
async restoreService(id: string) {
  return this.salonServiceModel.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  ).exec();
}

}