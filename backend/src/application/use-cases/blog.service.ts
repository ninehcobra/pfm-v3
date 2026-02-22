import { Injectable, Inject } from '@nestjs/common';
import type { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { BLOG_REPOSITORY } from 'src/domain/repositories/blog.repository.interface';
import type { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { Blog } from 'src/domain/entities/blog.entity';

import { IMediaService, MEDIA_SERVICE } from '../services/media.service';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BLOG_REPOSITORY) private blogRepository: IBlogRepository,
    @Inject(MEDIA_SERVICE) private mediaService: IMediaService,
  ) {}

  async getAllBlogs(locale: string = 'en'): Promise<Blog[]> {
    return this.blogRepository.findAll(true); 
  }

  async getBlogBySlug(slug: string, locale: string = 'en'): Promise<Blog | null> {
    return this.blogRepository.findBySlug(slug);
  }

  async createBlog(data: CreateBlogDto): Promise<Blog> {
    const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
    return this.blogRepository.create({ ...data, slug });
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findById(id);
    if (blog && data.thumbnail && blog.thumbnailPublicId && data.thumbnailPublicId !== blog.thumbnailPublicId) {
      await this.mediaService.deleteImage(blog.thumbnailPublicId);
    }
    return this.blogRepository.update(id, data);
  }

  async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogRepository.findById(id);
    if (blog?.thumbnailPublicId) {
      await this.mediaService.deleteImage(blog.thumbnailPublicId);
    }
    return this.blogRepository.delete(id);
  }
}
