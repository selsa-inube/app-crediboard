
export const getInitialLabel = (
    initialValue: number,
    initialType: string,
    paymentOptions: {
        label: string;
        value: number
    }[]): string | null => {
    if (!initialValue || initialValue === 0) return null;

    const matchByType = paymentOptions.find(
        (option) => option.label === initialType
    );
    if (matchByType) return matchByType.label;

    const matchByValue = paymentOptions.find(
        (option) => option.value === initialValue
    );
    return matchByValue?.label || null;
};