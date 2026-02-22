import { baseApi } from './base-api';

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioBlogPosts: builder.query<any[], { locale?: string }>({
      query: ({ locale }) => {
        const url = locale ? `/blogs?locale=${locale}&published=true` : '/blogs?published=true';
        return url;
      },
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<any, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
  }),
});

export const {
  useGetPortfolioBlogPostsQuery,
  useGetBlogBySlugQuery,
} = portfolioApi;
