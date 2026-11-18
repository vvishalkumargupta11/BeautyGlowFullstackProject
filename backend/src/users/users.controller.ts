import { Controller, Get, UseGuards, Param,NotFoundException, BadRequestException} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { isValidObjectId } from 'mongoose';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {

  constructor(private usersService: UsersService) { }

  @Get('customers')
  async getAllCustomers() {
    const customers = await this.usersService.getAllCustomers();

    return {
      message: 'Customers fetched successfully',
      total: customers.length,
      customers
    };
  }
  @Get('customers/:id')
async getCustomerById(@Param('id') id: string) {

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid customer ID');
  }

  const customer = await this.usersService.findById(id);

  if (!customer || customer.role !== 'customer') {
    throw new NotFoundException('Customer not found');
  }

  return {
    message: 'Customer details fetched successfully',
    customer
  };
}
}