export interface IPromotionEvent {
    id: number;
    title: string;
    description: string;
    amount: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
}
