import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemLogLevel, SystemLogStatus, Prisma } from '@prisma/client';

export interface LogEntry {
  level: SystemLogLevel;
  source: string;
  action: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
  userId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  status?: SystemLogStatus;
}

@Injectable({ scope: Scope.TRANSIENT })
export class SystemLoggerService extends ConsoleLogger {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async logToDb(data: LogEntry) {
    try {
      await this.prisma.systemLog.create({
        data: {
          level: data.level,
          source: data.source,
          action: data.action,
          message: data.message,
          metadata: data.metadata || {},
          userId: data.userId,
          path: data.path,
          method: data.method,
          statusCode: data.statusCode,
          duration: data.duration,
          ip: data.ip,
          userAgent: data.userAgent,
          status: data.status || SystemLogStatus.SUCCESS,
        },
      });
    } catch (error) {
      this.error(
        'Failed to save log to database',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
