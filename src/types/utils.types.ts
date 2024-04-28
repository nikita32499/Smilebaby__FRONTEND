export interface INestError {
    message: string;
    error: string;
    statusCode: number;
}

export function isNestError(error: object): error is INestError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'error' in error &&
        'statusCode' in error
    );
}
