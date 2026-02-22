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
