import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    // ENTERPRISE RULE: Super Admin bypasses all role checks
    if (user && user.role === 'SUPER_ADMIN') {
      return true;
    }

    // DENY BY DEFAULT: If no roles are specified, block access for non-super-admins
    if (!requiredRoles) {
      throw new ForbiddenException('Access denied: Insufficient permissions.');
    }

    // If user doesn't have a role, or their role is not in the allowed list, deny
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: You do not have permission to perform this action.');
    }

    return true;
  }
}
