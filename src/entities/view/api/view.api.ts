import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REACT_BASE_API_URL } from 'shared/config/constants';
import { ZodValidator } from 'shared/helpers/RTK-query';
import {
    SchemaViewUnion,
    SchemaViewUnionArray,
} from 'shared_SmileBaby/dist/contract/view.contract';
import { ICreateView } from 'shared_SmileBaby/dist/types/view.types';
import { z } from 'zod';

export const ViewApi = createApi({
    reducerPath: 'ViewApi',
    tagTypes: ['View'],
    baseQuery: fetchBaseQuery({
        baseUrl: REACT_BASE_API_URL + '/view',
    }),
    endpoints: (builder) => ({
        getAll: builder.query<z.infer<typeof SchemaViewUnionArray>, void>({
            query: () => ({
                url: '/getAll',
            }),
            providesTags: () => [{ type: 'View', id: 'LIST' }],
            transformResponse: (data) => ZodValidator(SchemaViewUnionArray, data),
        }),
        setView: builder.mutation<z.infer<typeof SchemaViewUnion>, ICreateView>({
            query: (data) => ({
                url: '/setView',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: () => [{ type: 'View', id: 'LIST' }],
            transformResponse: (data) => ZodValidator(SchemaViewUnion, data),
        }),
    }),
});
