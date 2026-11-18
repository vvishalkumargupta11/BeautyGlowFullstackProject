import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    findByEmail: vi.fn(),
    findByEmailForAuth: vi.fn(),
    create: vi.fn(),
  };
  const jwtService = {
    signAsync: vi.fn(),
  };

  beforeEach(async () => {
    usersService.findByEmail.mockReset();
    usersService.findByEmailForAuth.mockReset();
    usersService.create.mockReset();
    jwtService.signAsync.mockReset();
    jwtService.signAsync.mockResolvedValue('access-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('stores the registration fullName in the schema name field', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockImplementation(async (userData) => ({
      ...userData,
      _id: 'user-id',
    }));

    const result = await service.register({
      fullName: 'Nancy Beauty',
      email: 'Nancy@example.com',
      mobile: '1234567890',
      password: 'password123',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Nancy Beauty',
        email: 'nancy@example.com',
      }),
    );
    expect(result.user.fullName).toBe('Nancy Beauty');
  });

  it('uses the selected password hash when logging in', async () => {
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 4);
    usersService.findByEmailForAuth.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      name: 'Nancy Beauty',
      email: 'nancy@example.com',
      mobile: '1234567890',
      password: passwordHash,
      role: 'customer',
    });

    const result = await service.login({
      email: 'nancy@example.com',
      password,
    });

    expect(usersService.findByEmailForAuth).toHaveBeenCalledWith(
      'nancy@example.com',
    );
    expect(result.accessToken).toBe('access-token');
  });
});
