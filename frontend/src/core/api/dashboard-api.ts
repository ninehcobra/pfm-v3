import { baseApi } from './base-api';

export interface DashboardStats {
  overview: {
    totalBlogs: number;
    totalProjects: number;
    totalExperiences: number;
    totalContacts: number;
    totalSubscribers: number;
    visits24h: number;
    errors24h: number;
    totalBlogViews: number;
  };
  recentActivity: {
    id: string;
    action: string;
    message: string;
    level: string;
    createdAt: string;
  }[];
  topBlogs: {
    id: string;
    title: string;
    views: number;
    slug: string;
  }[];
  recentComments: {
    id: string;
    content: string;
    author: string;
    blogTitle: string;
    createdAt: string;
  }[];
  systemHealth: {
    name: string;
    status: string;
    latency: string;
  }[];
}

interface MaintenanceResponse {
  message: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard' as any],
    }),
    clearLogs: builder.mutation<MaintenanceResponse, void>({
      query: () => ({
        url: '/maintenance/clear-logs',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard' as any],
    }),
    seedDatabase: builder.mutation<MaintenanceResponse, void>({
      query: () => ({
        url: '/maintenance/seed',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard' as any, 'UIContent' as any, 'Language' as any],
    }),
    resetSystem: builder.mutation<MaintenanceResponse, void>({
      query: () => ({
        url: '/maintenance/reset-all',
        method: 'POST',
      }),
      invalidatesTags: [
        'Dashboard' as any, 
        'UIContent' as any, 
        'Language' as any,
        'Project' as any,
        'Experience' as any,
        'Blog' as any
      ],
    }),
  }),
});

export const { 
  useGetDashboardStatsQuery,
  useClearLogsMutation,
  useSeedDatabaseMutation,
  useResetSystemMutation,
} = dashboardApi;
