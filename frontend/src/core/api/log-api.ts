import { baseApi } from './base-api';

export interface LogFilter {
  page?: number;
  limit?: number;
  level?: string;
  source?: string;
  action?: string;
  status?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  statusCode?: number;
}

export const logApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<{ items: any[]; meta: any }, LogFilter>({
      query: (params) => ({
        url: '/logs',
        params,
      }),
      providesTags: ['SystemLog' as any],
    }),
    getLogStats: builder.query<{ total: number; errors: number; last24h: number }, void>({
      query: () => '/logs/stats',
      providesTags: ['SystemLog' as any],
    }),
    getLogById: builder.query<any, string>({
      query: (id) => `/logs/${id}`,
    }),
    clearLogs: builder.mutation<any, number | undefined>({
      query: (days) => ({
        url: '/logs/clear',
        method: 'DELETE',
        params: { days },
      }),
      invalidatesTags: ['SystemLog' as any],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogStatsQuery,
  useGetLogByIdQuery,
  useClearLogsMutation,
} = logApi;
