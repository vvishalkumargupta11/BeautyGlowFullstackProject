import {
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Required Roles:', requiredRoles);
    console.log('Logged-in User:', user);
    console.log('User Role:', user?.role);
    return !!user && requiredRoles.includes(user.role);
  }
}