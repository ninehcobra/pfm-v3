import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LanguageManagementService } from '../../application/use-cases/language.management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';

@Controller('admin/languages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('*:*')
export class LanguageManagementController {
  constructor(private readonly langService: LanguageManagementService) {}

  @Get()
  async findAll() {
    return this.langService.getAllLanguages();
  }

  @Post()
  async create(@Body() data: any) {
    return this.langService.createLanguage(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.langService.updateLanguage(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.langService.deleteLanguage(id);
  }
}
