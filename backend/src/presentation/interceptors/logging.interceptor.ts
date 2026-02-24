import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SystemLoggerService } from '../../infrastructure/logger/system-logger.service';
import { SystemLogLevel, SystemLogStatus } from '@prisma/client';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: SystemLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const { method, url, ip, headers } = request;
    const userAgent = (headers['user-agent'] as string) || '';
    const startTime = Date.now();

    // Sensitive fields to mask in metadata
    const maskFields = ['password', 'refreshToken', 'token', 'authorization'];

    const maskData = (data: Record<string, unknown> | any): any => {
      if (!data || typeof data !== 'object') return data;
      const masked = { ...data } as Record<string, unknown>;
      maskFields.forEach((field) => {
        if (field in masked) {
          masked[field] = '********';
        }
      });
      return masked;
    };

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;

        const bodyMetadata = maskData(request.body);
        const queryMetadata = request.query as Record<string, unknown>;
        const paramsMetadata = request.params as Record<string, unknown>;

        void this.logger.logToDb({
          level: SystemLogLevel.INFO,
          source: 'API',
          action: `${method} ${url}`,
          message: `Request processed successfully`,
          metadata: {
            body: bodyMetadata,
            query: queryMetadata,
            params: paramsMetadata,
          },
          userId: request.user?.id,
          path: url,
          method,
          statusCode,
          duration,
          ip,
          userAgent,
          status: SystemLogStatus.SUCCESS,
        });
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorMessage = error instanceof Error 
          ? error.message 
          : (typeof error === 'object' && error !== null && 'message' in error) 
            ? String((error as Record<string, unknown>).message) 
            : 'Internal server error';

        const bodyMetadata = maskData(request.body);
        const queryMetadata = request.query as Record<string, unknown>;
        const paramsMetadata = request.params as Record<string, unknown>;
        const errorMetadata = JSON.parse(JSON.stringify(error)) as Record<string, unknown>;

        void this.logger.logToDb({
          level: SystemLogLevel.ERROR,
          source: 'API',
          action: `${method} ${url}`,
          message: errorMessage,
          metadata: {
            body: bodyMetadata,
            query: queryMetadata,
            params: paramsMetadata,
            stack: error instanceof Error ? error.stack : undefined,
            error: errorMetadata,
          },
          userId: request.user?.id,
          path: url,
          method,
          statusCode,
          duration,
          ip,
          userAgent,
          status: SystemLogStatus.FAILED,
        });

        return throwError(() => error);
      }),
    );
  }
}
