import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';


@Injectable()
export class AdminService {

  constructor(
    private readonly usersService: UsersService
  ) {}

  async getDashboardStats() {

    const totalCustomers =
      await this.usersService.countCustomers();

    const totalAdmins =
      await this.usersService.countAdmins();

    const totalUsers =
      await this.usersService.countTotalUsers();

    return {
      message: 'Welcome to BeautyGlow Admin Dashboard',

      statistics: {
        totalCustomers,
        totalAdmins,
        totalUsers
      }
    };
  }
}