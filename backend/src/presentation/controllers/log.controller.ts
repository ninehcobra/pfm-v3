import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  LogManagementService,
  LogFilterDto,
} from '../../application/use-cases/log.management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Logs')
@ApiBearerAuth()
@Controller('logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LogController {
  constructor(private readonly logService: LogManagementService) {}

  @Get()
  @Permissions('system:log:read')
  @ApiOperation({ summary: 'Get all system logs with advanced filtering' })
  async getLogs(@Query() filter: LogFilterDto) {
    return this.logService.getLogs(filter);
  }

  @Get('stats')
  @Permissions('system:log:read')
  @ApiOperation({ summary: 'Get log statistics' })
  async getStats() {
    return this.logService.getStats();
  }

  @Get(':id')
  @Permissions('system:log:read')
  @ApiOperation({ summary: 'Get log details by ID' })
  async getLogById(@Param('id') id: string) {
    return this.logService.getLogById(id);
  }

  @Delete('clear')
  @Permissions('system:log:delete')
  @ApiOperation({ summary: 'Clear old logs' })
  async clearLogs(
    @Query('days', new ParseIntPipe({ optional: true })) days: number,
  ) {
    return this.logService.clearOldLogs(days);
  }
}
