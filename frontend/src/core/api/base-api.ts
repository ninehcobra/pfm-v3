import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };
        localStorage.setItem('accessToken', accessToken);
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  // Interceptor for errors -> toast
  if (result.error) {
    const errorData = result.error.data as any;
    const errorMessage = errorData?.message || 'Something went wrong';
    
    // Don't toast 401 as we might be refreshing or redirecting
    if (result.error.status !== 401) {
      toast.error(errorMessage, {
        description: `Status: ${result.error.status}`,
      });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project', 'Blog', 'UIContent', 'Language', 'Experience', 'SystemLog', 'Portfolio', 'Dashboard', 'User'],
  endpoints: () => ({}),
});
