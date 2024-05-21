import { ICreateView, IView, IViewUnion } from '@/types/view.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const REACT_BASE_API_URL = `${window.location.origin}/api`;

export const ViewApi = createApi({
  reducerPath: 'ViewApi',
  tagTypes: ['View'],
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_BASE_API_URL + '/view',
  }),
  endpoints: (builder) => ({
    getAll: builder.query<Readonly<IViewUnion[]>, void>({
      query: () => ({
        url: '/getAll',
      }),
      providesTags: () => [{ type: 'View', id: 'LIST' }],
    }),
    set: builder.mutation<IView, ICreateView>({
      query: (data) => ({
        url: '/setView',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: () => [{ type: 'View', id: 'LIST' }],
    }),
  }),
});
