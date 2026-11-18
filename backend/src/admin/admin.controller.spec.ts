import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

describe('AdminController', () => {
  let controller: AdminController;
  const adminService = {
    getDashboardStats: vi.fn(),
  };

  beforeEach(async () => {
    adminService.getDashboardStats.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: adminService },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns dashboard statistics from the admin service', async () => {
    const stats = {
      message: 'Welcome to BeautyGlow Admin Dashboard',
      statistics: {
        totalCustomers: 4,
        totalAdmins: 1,
        totalUsers: 5,
      },
    };
    adminService.getDashboardStats.mockResolvedValue(stats);

    await expect(controller.getDashboard()).resolves.toEqual(stats);
  });
});
