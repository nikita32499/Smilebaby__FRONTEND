export const deepCopy = <T extends object | Array<unknown>>(data: T): Mutable<T> => {
    return JSON.parse(JSON.stringify(data));
};

export const mergeAndRemoveDuplicates = (
    array1: string[],
    array2: string[],
): string[] => {
    const combinedArray = [...array1, ...array2];

    const elementCounts: { [key: string]: number } = {};
    for (const item of combinedArray) {
        elementCounts[item] = (elementCounts[item] || 0) + 1;
    }

    const uniqueArray = combinedArray.filter((item) => elementCounts[item] === 1);

    return uniqueArray;
};
