import { IItemCreate } from '@/types/item.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const REACT_BASE_API_URL = `${window.location.origin}/api`;

export const ItemsApi = createApi({
  reducerPath: 'UsersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_BASE_API_URL + '/users',
  }),
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => `/getAll`,
      providesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    create: builder.mutation({
      query: (items: IItemCreate) => ({
        url: `/create`,
        method: 'POST',
        body: items,
      }),
      invalidatesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    remove: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `/delete`,
        method: 'DELETE',
        body: {
          id,
        },
      }),
      invalidatesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),
    update: builder.mutation({
      query: ({ id, data }: { id: number; data: Partial<IItemCreate> }) => ({
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
