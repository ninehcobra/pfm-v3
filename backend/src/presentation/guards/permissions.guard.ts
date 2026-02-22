import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    // Fetch user role and permissions from DB
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!dbUser) return false;

    const userPermissions = dbUser.role.permissions.map(p => p.name);
    const hasWildcard = userPermissions.includes('*:*');
    const hasPermission = hasWildcard || requiredPermissions.every(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
