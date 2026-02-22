import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectManagementService } from '../../application/use-cases/project.management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('*:*') // Only SuperAdmin
export class ProjectManagementController {
  constructor(private readonly projectService: ProjectManagementService) {}

  @Get()
  async findAll() {
    return this.projectService.getAllProjects();
  }

  @Post()
  async create(@Body() data: any) {
    return this.projectService.createProject(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
