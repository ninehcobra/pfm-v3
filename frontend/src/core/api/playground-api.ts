import { baseApi } from './base-api';

export interface GameScore {
  id: string;
  gameKey: string;
  score: number;
  userId?: string;
  playerName?: string;
  createdAt: string;
  user?: {
    fullName: string;
    avatar?: string;
  };
}

export const playgroundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveScore: builder.mutation<GameScore, { gameKey: string; score: number; playerName?: string }>({
      query: (body) => ({
        url: '/playground/score',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Playground'],
    }),
    getLeaderboard: builder.query<GameScore[], { gameKey: string; limit?: number }>({
      query: ({ gameKey, limit }) => ({
        url: '/playground/leaderboard',
        params: { gameKey, limit },
      }),
      providesTags: ['Playground'],
    }),
    getUserHistory: builder.query<GameScore[], { gameKey: string; limit?: number }>({
      query: ({ gameKey, limit }) => ({
        url: '/playground/history',
        params: { gameKey, limit },
      }),
      providesTags: ['Playground'],
    }),
    getUserBest: builder.query<GameScore, { gameKey: string }>({
      query: ({ gameKey }) => ({
        url: '/playground/personal-best',
        params: { gameKey },
      }),
      providesTags: ['Playground'],
    }),
  }),
});

export const {
  useSaveScoreMutation,
  useGetLeaderboardQuery,
  useGetUserHistoryQuery,
  useGetUserBestQuery,
} = playgroundApi;
