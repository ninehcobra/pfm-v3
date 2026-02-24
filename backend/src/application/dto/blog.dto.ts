export interface CreateBlogDto {
  title: string;
  content: string;
  locale: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  locale?: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  published?: boolean;
}

export interface CreateCommentDto {
  content: string;
}

export interface ReactionDto {
  type: 'LIKE' | 'LOVE' | 'WOW' | 'BRAVO';
}
