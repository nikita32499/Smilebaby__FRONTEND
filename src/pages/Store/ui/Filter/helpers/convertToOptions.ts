interface IConvertToOption {
    isActive: (value: string) => boolean;
    func: (value: string) => void;
    data: Record<string, number>;
}

export const convertToOptions = ({ isActive, func, data }: IConvertToOption) => {
    return Object.entries(data).map(([value, amount]) => ({
        text: value,
        amount,
        func: () => func(value),
        isActive: () => isActive(value),
    }));
};
