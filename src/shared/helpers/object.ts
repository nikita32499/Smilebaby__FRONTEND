export const deepCopy = <T extends object | Array<unknown>>(data: T): Mutable<T> => {
    return JSON.parse(JSON.stringify(data));
};
