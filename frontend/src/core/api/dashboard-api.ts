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

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard' as any],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
