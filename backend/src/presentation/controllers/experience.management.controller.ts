import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExperienceManagementService } from '../../application/use-cases/experience.management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';

@Controller('admin/experience')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('*:*')
export class ExperienceManagementController {
  constructor(private readonly expService: ExperienceManagementService) {}

  @Get()
  async findAll() {
    return this.expService.getAllExperiences();
  }

  @Post()
  async create(@Body() data: any) {
    return this.expService.createExperience(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.expService.updateExperience(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.expService.deleteExperience(id);
  }
}
