'use client';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ZodSchema, z } from 'zod';

export const getErrorRTK = (
    error: object | undefined,
    defaultMessage: string = 'Что-то пошло не так',
): string => {
    return (
        (error &&
        'data' in error &&
        error.data instanceof Object &&
        'message' in error.data
            ? (error.data.message as string)
            : undefined) ?? defaultMessage
    );
};

export const parseError = (error: FetchBaseQueryError) => {
    return error;
};

export const ZodValidator = <T extends ZodSchema>(
    schema: T,
    data: unknown,
): z.infer<T> => {
    return schema.parse(data);
};
