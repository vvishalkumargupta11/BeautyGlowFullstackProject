import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    register: vi.fn(),
    login: vi.fn(),
  };
  const usersService = {
    findById: vi.fn(),
  };

  beforeEach(async () => {
    usersService.findById.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns a normalized user profile', async () => {
    usersService.findById.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      name: 'Nancy Beauty',
      email: 'nancy@example.com',
      mobile: '1234567890',
      role: 'customer',
    });

    await expect(controller.getProfile({ user: { userId: 'user-id' } }))
      .resolves.toEqual({
        message: 'Profile fetched successfully',
        user: {
          id: 'user-id',
          fullName: 'Nancy Beauty',
          email: 'nancy@example.com',
          mobile: '1234567890',
          role: 'customer',
        },
      });
  });
});
