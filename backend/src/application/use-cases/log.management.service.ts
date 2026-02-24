import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SystemLogLevel, SystemLogStatus, Prisma } from '@prisma/client';

export interface LogFilterDto {
  page?: number;
  limit?: number;
  level?: SystemLogLevel;
  source?: string;
  action?: string;
  status?: SystemLogStatus;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  statusCode?: number;
}

@Injectable()
export class LogManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogs(filter: LogFilterDto) {
    const {
      page = 1,
      limit = 20,
      level,
      source,
      action,
      status,
      userId,
      search,
      startDate,
      endDate,
      method,
      statusCode,
    } = filter;

    const skip = (page - 1) * limit;

    const where: Prisma.SystemLogWhereInput = {
      AND: [
        level ? { level } : {},
        source ? { source: { contains: source, mode: 'insensitive' } } : {},
        action ? { action: { contains: action, mode: 'insensitive' } } : {},
        status ? { status } : {},
        userId ? { userId } : {},
        method ? { method } : {},
        statusCode ? { statusCode: Number(statusCode) } : {},
        search
          ? {
              OR: [
                { message: { contains: search, mode: 'insensitive' } },
                { path: { contains: search, mode: 'insensitive' } },
                { action: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        startDate || endDate
          ? {
              createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
              },
            }
          : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.systemLog.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      }),
      this.prisma.systemLog.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLogById(id: string) {
    return this.prisma.systemLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async getStats() {
    // Basic stats for dashboard
    const [total, errors, last24h] = await Promise.all([
      this.prisma.systemLog.count(),
      this.prisma.systemLog.count({ where: { level: SystemLogLevel.ERROR } }),
      this.prisma.systemLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return { total, errors, last24h };
  }

  async clearOldLogs(days: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.prisma.systemLog.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });
  }
}
