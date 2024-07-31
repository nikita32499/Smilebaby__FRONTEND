import { z } from 'zod';

export type TResponseSuccess = {
    success: boolean;
};

export interface ResponseSuccess {
    success: boolean;
}

export const SchemaResponseSuccess = z.object({
    success: z.boolean(),
});
