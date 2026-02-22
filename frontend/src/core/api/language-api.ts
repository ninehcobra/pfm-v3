import { baseApi } from './base-api';

export const languageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminLanguages: builder.query<any[], void>({
      query: () => '/admin/languages',
      providesTags: ['Language'],
    }),
    createLanguage: builder.mutation<void, any>({
      query: (data) => ({
        url: '/admin/languages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Language'],
    }),
    updateLanguage: builder.mutation<void, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/languages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Language'],
    }),
    deleteLanguage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/languages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Language'],
    }),
  }),
});

export const {
  useGetAdminLanguagesQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languageApi;
