import { baseApi } from './base-api';

export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query<any[], void>({
      query: () => '/admin/experience',
      providesTags: ['Experience'],
    }),
    createExperience: builder.mutation<void, any>({
      query: (data) => ({
        url: '/admin/experience',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Experience'],
    }),
    updateExperience: builder.mutation<void, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/experience/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Experience'],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/experience/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experience'],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
