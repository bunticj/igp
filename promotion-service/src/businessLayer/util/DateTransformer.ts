export const dateTransformer = (value: unknown): Date | undefined => {
    if (typeof value === 'string') {
        const parsedDate = new Date(value);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
}