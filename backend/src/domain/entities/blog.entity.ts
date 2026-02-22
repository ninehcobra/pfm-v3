export class Blog {
  id: string;
  slug: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  translations?: BlogTranslation[];
  
  // Virtual fields for convenience when loaded for a specific locale
  title?: string;
  content?: string;
}

export class BlogTranslation {
  id: string;
  title: string;
  content: string;
  blogId: string;
  languageId: string;
}
