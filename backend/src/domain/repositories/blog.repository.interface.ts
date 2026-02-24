import { Blog } from '../entities/blog.entity';

export interface IBlogRepository {
  create(data: Partial<Blog>): Promise<Blog>;
  findAll(publishedOnly?: boolean): Promise<Blog[]>;
  findById(id: string): Promise<Blog | null>;
  findBySlug(slug: string): Promise<Blog | null>;
  update(id: string, data: Partial<Blog>): Promise<Blog>;
  delete(id: string): Promise<void>;
  incrementView(slug: string): Promise<void>;
  addComment(
    blogId: string,
    authorId: string,
    content: string,
  ): Promise<unknown>;
  deleteComment(commentId: string, userId: string): Promise<void>;
  toggleReaction(
    blogId: string,
    userId: string,
    type: string,
  ): Promise<unknown>;
}

export const BLOG_REPOSITORY = 'IBlogRepository';
