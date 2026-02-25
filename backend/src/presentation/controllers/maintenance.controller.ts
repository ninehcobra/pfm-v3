import { Controller, Post, UseGuards } from '@nestjs/common';
import { MaintenanceService } from '../../application/use-cases/maintenance.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Maintenance')
@ApiBearerAuth()
@Controller('maintenance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post('clear-logs')
  @Permissions('system:maintenance:execute')
  @ApiOperation({ summary: 'Clear all system logs' })
  async clearLogs() {
    const result = await this.maintenanceService.clearLogs();
    return result;
  }

  @Post('seed')
  @Permissions('system:maintenance:execute')
  @ApiOperation({ summary: 'Run database seed' })
  async runSeed() {
    const result = await this.maintenanceService.runSeed();
    return result;
  }

  @Post('reset-all')
  @Permissions('system:maintenance:execute')
  @ApiOperation({ summary: 'Reset all data and re-seed' })
  async resetAll() {
    const result = await this.maintenanceService.resetAll();
    return result;
  }
}
