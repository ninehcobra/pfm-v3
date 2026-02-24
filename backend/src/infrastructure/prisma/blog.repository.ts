import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { Blog } from 'src/domain/entities/blog.entity';
import { ReactionType } from '@prisma/client';

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Blog> & { locale?: string }): Promise<Blog> {
    const locale = data.locale || 'en';
    const language = await this.prisma.language.findUnique({
      where: { code: locale },
    });
    if (!language) throw new Error(`Language ${locale} not found`);

    return this.prisma.blog
      .create({
        data: {
          slug: data.slug,
          thumbnail: data.thumbnail,
          thumbnailPublicId: data.thumbnailPublicId,
          published: data.published ?? false,
          authorId: data.authorId,
          translations: {
            create: {
              title: data.title,
              content: data.content,
              languageId: language.id,
            },
          },
        },
        include: {
          translations: { where: { languageId: language.id } },
        },
      })
      .then((res) => this.mapToEntity(res)) as unknown as Blog;
  }

  async findAll(publishedOnly?: boolean): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({
      where: publishedOnly ? { published: true } : {},
      include: {
        author: true,
        translations: true, // Get all for now, or we could filter by a default locale
      },
    });
    return blogs.map((b) => this.mapToEntity(b)) as unknown as Blog[];
  }

  async findById(id: string): Promise<Blog | null> {
    const res = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        translations: true,
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
        reactions: true,
      },
    });
    return res ? this.mapToEntity(res) : null;
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const res = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        translations: true,
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
        reactions: true,
      },
    });
    return res ? this.mapToEntity(res) : null;
  }

  async update(
    id: string,
    data: Partial<Blog> & { locale?: string },
  ): Promise<Blog> {
    const { title, content, locale, ...rest } = data;

    if (title || content) {
      const targetLocale = locale || 'en';
      const language = await this.prisma.language.findUnique({
        where: { code: targetLocale },
      });
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
          title: title,
          content: content,
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

  async delete(id: string): Promise<void> {
    await this.prisma.blog.delete({ where: { id } });
  }

  async incrementView(slug: string): Promise<void> {
    await this.prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  }

  async addComment(
    blogId: string,
    authorId: string,
    content: string,
  ): Promise<any> {
    return this.prisma.comment.create({
      data: {
        content,
        authorId,
        blogId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: commentId, authorId: userId },
    });
  }

  async toggleReaction(
    blogId: string,
    userId: string,
    type: ReactionType, // Changed 'any' to 'ReactionType'
  ): Promise<any> {
    const existing = await this.prisma.reaction.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });

    if (existing) {
      if (existing.type === type) {
        return this.prisma.reaction.delete({
          where: { id: existing.id },
        });
      } else {
        return this.prisma.reaction.update({
          where: { id: existing.id },
          data: { type },
        });
      }
    }

    return this.prisma.reaction.create({
      data: {
        type,
        userId,
        blogId,
      },
    });
  }

  private mapToEntity(prismaBlog: any): Blog {
    const { translations, ...rest } = prismaBlog;
    return {
      ...rest,
      translations,
      title: translations?.[0]?.title,
      content: translations?.[0]?.content,
      views: prismaBlog.views || 0,
      comments: prismaBlog.comments || [],
      reactions: prismaBlog.reactions || [],
    } as Blog;
  }
}
