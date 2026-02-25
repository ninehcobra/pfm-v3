import { baseApi } from './base-api';

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUIContent: builder.query<any[], void>({
      query: () => '/admin/ui-content',
      providesTags: ['UIContent'],
    }),
    updateUIContent: builder.mutation<void, any[]>({
      query: (data) => ({
        url: '/admin/ui-content',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UIContent'],
    }),
    createUIKey: builder.mutation<void, { key: string; defaultValue: string }>({
      query: (data) => ({
        url: '/admin/ui-content/keys',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UIContent'],
    }),
    getAdminLanguages: builder.query<any[], void>({
      query: () => '/admin/languages',
      providesTags: ['Language'],
    }),
  }),
});

export const {
  useGetUIContentQuery,
  useUpdateUIContentMutation,
  useCreateUIKeyMutation,
  useGetAdminLanguagesQuery,
} = configApi;
