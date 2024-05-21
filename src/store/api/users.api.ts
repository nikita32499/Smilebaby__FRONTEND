import { IJwtUserData, IUser, IUserCreate } from '@/types/user.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const REACT_BASE_API_URL = `${window.location.origin}/api`;

export const UserApi = createApi({
  reducerPath: 'UsersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_BASE_API_URL + '/users',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IJwtUserData, { login: string; password: string }>({
      query: (data) => ({
        url: `/login`,
        method: 'POST',
        body: data,
      }),
    }),

    getAll: builder.query<Readonly<IUser[]>, void>({
      query: () => `/getAll`,
      providesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    create: builder.mutation<IUser, IUserCreate>({
      query: (user) => ({
        url: `/create`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    delete: builder.mutation<IUser | null, number>({
      query: (id) => ({
        url: `/delete`,
        method: 'DELETE',
        body: {
          id,
        },
      }),
      invalidatesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    update: builder.mutation<IUser | null, { id: number; data: Partial<IUserCreate> }>({
      query: ({ id, data }) => ({
        url: '/update',
        method: 'POST',
        body: {
          id,
          data,
        },
      }),
      invalidatesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});
