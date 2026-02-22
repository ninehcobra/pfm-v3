import { baseApi } from './base-api';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<any[], void>({
      query: () => '/admin/projects',
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
