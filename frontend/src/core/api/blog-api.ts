import { baseApi } from './base-api';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<any[], void>({
      query: () => '/blogs',
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: '/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<any, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    addComment: builder.mutation<any, { blogId: string; content: string }>({
      query: ({ blogId, content }) => ({
        url: `/blogs/${blogId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId }],
    }),
    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `/blogs/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    toggleReaction: builder.mutation<any, { blogId: string; type: string }>({
      query: ({ blogId, type }) => ({
        url: `/blogs/${blogId}/reactions`,
        method: 'POST',
        body: { type },
      }),
      invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogBySlugQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useToggleReactionMutation,
} = blogApi;
