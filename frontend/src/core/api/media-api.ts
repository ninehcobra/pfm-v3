import { baseApi } from './base-api';

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string; publicId: string }, FormData>({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteImage: builder.mutation<void, string>({
      query: (publicId) => ({
        url: `/upload/image/${publicId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useDeleteImageMutation,
} = mediaApi;
