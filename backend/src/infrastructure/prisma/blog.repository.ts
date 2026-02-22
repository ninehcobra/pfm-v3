import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { Blog } from 'src/domain/entities/blog.entity';

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Blog> & { locale?: string }): Promise<Blog> {
    const locale = data.locale || 'en';
    const language = await this.prisma.language.findUnique({ where: { code: locale } });
    if (!language) throw new Error(`Language ${locale} not found`);

    return this.prisma.blog.create({
      data: {
        slug: data.slug!,
        thumbnail: data.thumbnail,
        thumbnailPublicId: data.thumbnailPublicId,
        published: data.published ?? false,
        authorId: data.authorId!,
        translations: {
          create: {
            title: data.title!,
            content: data.content!,
            languageId: language.id,
          },
        },
      },
      include: {
        translations: { where: { languageId: language.id } },
      },
    }).then(res => this.mapToEntity(res)) as unknown as Blog;
  }

  async findAll(publishedOnly?: boolean): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({
      where: publishedOnly ? { published: true } : {},
      include: { 
        author: true,
        translations: true // Get all for now, or we could filter by a default locale
      },
    });
    return blogs.map(b => this.mapToEntity(b)) as unknown as Blog[];
  }

  async findById(id: string): Promise<Blog | null> {
    const res = await this.prisma.blog.findUnique({
      where: { id },
      include: { translations: true },
    });
    return res ? this.mapToEntity(res) : null;
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const res = await this.prisma.blog.findUnique({
      where: { slug },
      include: { translations: true },
    });
    return res ? this.mapToEntity(res) : null;
  }

  async update(id: string, data: Partial<Blog> & { locale?: string }): Promise<Blog> {
    const { title, content, locale, ...rest } = data;
    
    if (title || content) {
      const targetLocale = locale || 'en';
      const language = await this.prisma.language.findUnique({ where: { code: targetLocale } });
      if (!language) throw new Error(`Language ${targetLocale} not found`);

      await this.prisma.blogTranslation.upsert({
        where: { blogId_languageId: { blogId: id, languageId: language.id } },
        update: {
          title: title,
          content: content,
        },
        create: {
          blogId: id,
          languageId: language.id,
          title: title!,
          content: content!,
        },
      });
    }

    const res = await this.prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        thumbnail: data.thumbnail,
        thumbnailPublicId: data.thumbnailPublicId,
      } as any,
      include: { translations: true },
    });
    return this.mapToEntity(res) as unknown as Blog;
  }

  private mapToEntity(prismaBlog: any): Blog {
    const { translations, ...rest } = prismaBlog;
    return {
      ...rest,
      translations,
      title: translations?.[0]?.title,
      content: translations?.[0]?.content,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blog.delete({ where: { id } });
  }
}
