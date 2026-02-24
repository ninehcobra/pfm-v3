import { Module, Global } from '@nestjs/common';
import { SystemLoggerService } from './system-logger.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [SystemLoggerService],
  exports: [SystemLoggerService],
})
export class LoggerModule {}
