import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { Blog } from 'src/domain/entities/blog.entity';
import { ReactionType, Prisma } from '@prisma/client';

type BlogWithTranslations = Prisma.BlogGetPayload<{
  include: {
    translations: true;
    author: true;
    comments: { include: { author: true } };
    reactions: true;
  };
}>;

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Blog> & { locale?: string }): Promise<Blog> {
    const locale = data.locale || 'en';
    const language = await this.prisma.language.findUnique({
      where: { code: locale },
    });
    if (!language) throw new Error(`Language ${locale} not found`);

    const result = await this.prisma.blog.create({
      data: {
        slug: data.slug || '',
        thumbnail: data.thumbnail,
        thumbnailPublicId: data.thumbnailPublicId,
        published: data.published ?? false,
        authorId: data.authorId || '',
        translations: {
          create: {
            title: data.title || '',
            content: data.content || '',
            languageId: language.id,
          },
        },
      },
      include: {
        translations: { where: { languageId: language.id } },
        author: true,
        comments: { include: { author: true } },
        reactions: true,
      },
    });
    return this.mapToEntity(result as unknown as BlogWithTranslations);
  }

  async findAll(publishedOnly?: boolean): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({
      where: publishedOnly ? { published: true } : {},
      include: {
        author: true,
        translations: true,
        comments: { include: { author: true } },
        reactions: true,
      },
    });
    return (blogs as unknown as BlogWithTranslations[]).map((b) =>
      this.mapToEntity(b),
    );
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
    return res
      ? this.mapToEntity(res as unknown as BlogWithTranslations)
      : null;
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
    return res
      ? this.mapToEntity(res as unknown as BlogWithTranslations)
      : null;
  }

  async update(
    id: string,
    data: Partial<Blog> & { locale?: string },
  ): Promise<Blog> {
    const {
      title,
      content,
      locale,
      published,
      thumbnail,
      thumbnailPublicId,
      slug,
    } = data;

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
          title: title || '',
          content: content || '',
        },
      });
    }

    const res = await this.prisma.blog.update({
      where: { id },
      data: {
        published,
        thumbnail,
        thumbnailPublicId,
        slug,
      },
      include: {
        translations: true,
        author: true,
        comments: { include: { author: true } },
        reactions: true,
      },
    });
    return this.mapToEntity(res as unknown as BlogWithTranslations);
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
    return await this.prisma.comment.create({
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
    type: string,
  ): Promise<any> {
    const reactionType = type as ReactionType;
    const existing = await this.prisma.reaction.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });

    if (existing) {
      if (existing.type === reactionType) {
        return await this.prisma.reaction.delete({
          where: { id: existing.id },
        });
      } else {
        return await this.prisma.reaction.update({
          where: { id: existing.id },
          data: { type: reactionType },
        });
      }
    }

    return await this.prisma.reaction.create({
      data: {
        type: reactionType,
        userId,
        blogId,
      },
    });
  }

  private mapToEntity(prismaBlog: unknown): Blog {
    const blog = prismaBlog as Record<string, unknown>;
    const translations = (blog.translations as any[]) || [];
    const comments = (blog.comments as any[]) || [];
    const reactions = (blog.reactions as any[]) || [];

    return {
      ...(blog as any),
      translations,
      title: (translations[0] as Record<string, string>)?.title,
      content: (translations[0] as Record<string, string>)?.content,
      views: (blog.views as number) || 0,
      comments,
      reactions,
    } as unknown as Blog;
  }
}
