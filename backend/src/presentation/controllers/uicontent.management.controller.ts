import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { UIContentManagementService } from '../../application/use-cases/uicontent.management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';

@Controller('admin/ui-content')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('*:*')
export class UIContentManagementController {
  constructor(private readonly uiService: UIContentManagementService) {}

  @Get()
  async findAll() {
    return this.uiService.getAllContent();
  }

  @Put()
  async update(@Body() data: any[]) {
    return this.uiService.updateContent(data);
  }

  @Post('keys')
  async createKey(@Body() data: { key: string; defaultValue: string }) {
    return this.uiService.createKey(data);
  }
}
