import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from 'src/application/use-cases/blog.service';
import { PermissionsGuard } from 'src/presentation/guards/permissions.guard';
import { Permissions } from 'src/presentation/guards/permissions.decorator';
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard';
import type {
  CreateBlogDto,
  UpdateBlogDto,
} from 'src/application/dto/blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async findAll() {
    return this.blogService.getAllBlogs();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.blogService.getBlogBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog:create')
  async create(@Body() data: CreateBlogDto) {
    return this.blogService.createBlog(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog:update')
  async update(@Param('id') id: string, @Body() data: UpdateBlogDto) {
    return this.blogService.updateBlog(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog:delete')
  async remove(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
