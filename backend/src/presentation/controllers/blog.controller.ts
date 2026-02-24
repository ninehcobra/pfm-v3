import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from 'src/application/use-cases/blog.service';
import { PermissionsGuard } from 'src/presentation/guards/permissions.guard';
import { Permissions } from 'src/presentation/guards/permissions.decorator';
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard';
import type {
  CreateBlogDto,
  UpdateBlogDto,
} from 'src/application/dto/blog.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async findAll() {
    return this.blogService.getAllBlogs();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    await this.blogService.incrementView(slug);
    return this.blogService.getBlogBySlug(slug);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() data: { content: string },
    @Req() req: RequestWithUser,
  ) {
    return this.blogService.addComment(id, req.user.id, data.content);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async removeComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.blogService.deleteComment(commentId, req.user.id);
    return { success: true };
  }

  @Post(':id/reactions')
  @UseGuards(JwtAuthGuard)
  async toggleReaction(
    @Param('id') id: string,
    @Body() data: { type: string },
    @Req() req: RequestWithUser,
  ) {
    return this.blogService.toggleReaction(id, req.user.id, data.type);
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
