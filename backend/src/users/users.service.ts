import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email.toLowerCase().trim()
    }).exec();
  }

  async findByEmailForAuth(email: string) {
    return this.userModel.findOne({
      email: email.toLowerCase().trim()
    }).select('+password').exec();
  }

  async create(userData: Partial<User>) {
    const user = new this.userModel(userData);

    return user.save();
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async countCustomers(): Promise<number> {
  return this.userModel.countDocuments({
    role: 'customer'
  }).exec();
}

async countAdmins(): Promise<number> {
  return this.userModel.countDocuments({
    role: 'admin'
  }).exec();
}

async countTotalUsers(): Promise<number> {
  return this.userModel.countDocuments().exec();
}

async getAllCustomers() {
  return this.userModel
    .find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 })
    .exec();
}
}