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

    // DENY BY DEFAULT: If no roles are specified, block access
    if (!requiredRoles) {
      throw new ForbiddenException('Access denied: Insufficient permissions.');
    }

    const { user } = context.switchToHttp().getRequest();

    // If user doesn't have a role, or their role is not in the allowed list, deny
    if (!user || !requiredRoles.some((role) => user.role?.includes(role))) {
      throw new ForbiddenException('Access denied: You do not have permission to perform this action.');
    }

    return true;
  }
}
