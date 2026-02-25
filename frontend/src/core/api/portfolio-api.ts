import { baseApi } from './base-api';

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioContent: builder.query<any, { locale?: string }>({
      query: ({ locale }) => (locale ? `/portfolio?locale=${locale}` : '/portfolio'),
      providesTags: ['Portfolio'],
    }),
    getLanguages: builder.query<any[], void>({
      query: () => '/portfolio/languages',
      providesTags: ['Language'],
    }),
    getPortfolioBlogPosts: builder.query<any[], { locale?: string }>({
      query: ({ locale }) => {
        const url = locale ? `/blogs?locale=${locale}&published=true` : '/blogs?published=true';
        return url;
      },
      providesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetPortfolioContentQuery,
  useLazyGetPortfolioContentQuery,
  useGetLanguagesQuery,
  useGetPortfolioBlogPostsQuery,
} = portfolioApi;
