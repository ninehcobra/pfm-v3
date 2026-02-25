import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<User>): Promise<User> {
    return (await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        roleId: data.roleId,
        avatar: data.avatar,
        avatarPublicId: data.avatarPublicId,
      },
    })) as unknown as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })) as unknown as User | null;
  }

  async findById(id: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })) as unknown as User | null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return (await this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    })) as unknown as User;
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    return (await this.prisma.user.findFirst({
      where: { refreshToken: token },
      include: { role: true },
    })) as unknown as User | null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findRoleByName(name: string): Promise<{ id: string } | null> {
    return await this.prisma.role.findUnique({
      where: { name },
      select: { id: true },
    });
  }
}
