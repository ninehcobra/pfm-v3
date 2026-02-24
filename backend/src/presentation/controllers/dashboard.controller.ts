import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../../application/use-cases/dashboard.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Permissions('system:dashboard:read')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.dashboardService.getStats();
  }
}
