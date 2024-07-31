import { useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { getErrorRTK } from 'shared/helpers/RTK-query';

type RtkResult =
    | { data?: undefined; error: object }
    | { data: unknown; error?: undefined };

export const useErrorHookForm = <T extends FieldValues>(form: UseFormReturn<T>) => {
    const {
        formState: { errors },
    } = form;
    const errorMessage = Object.values(errors).find((err) =>
        err ? err.message : false,
    )?.message;

    const lastTimeout = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (errorMessage) {
            if (lastTimeout.current) {
                clearTimeout(lastTimeout.current);
            }
            lastTimeout.current = setTimeout(() => {
                form.clearErrors();
            }, 15000);
        }
    }, [errorMessage]);

    const setStatus = <T extends RtkResult>(result: T): { success: boolean } => {
        let messageError: string;
        if (result.error) {
            messageError = getErrorRTK(result.error);
        } else {
            return { success: true };
        }
        form.setError('root', {
            message: messageError,
        });

        return { success: false };
    };

    return { errorMessage, setStatus };
};
