import { Promotion } from "../../dataAccessLayer/entity/Promotion";
type CreatePromotionType = Omit<Promotion, "id" | "userPromotions">

export interface IPromotion {
    title: string;
    description: string;
    amount: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
}

export interface ICreatePromotionBody {
    promotion: CreatePromotionType;
    userIds: number[];
}
