import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {

    const { fullName, email, mobile, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = await this.usersService.create({
        name: fullName,
        email: email.toLowerCase().trim(),
        mobile,
        password: hashedPassword,
        role: 'customer'
      });

      return {
        message: 'Registration successful',
        user: {
          id: user._id,
          fullName: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        }
      };

    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  // CUSTOMER LOGIN

  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailForAuth(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: user._id,
        fullName: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    };
  }
}