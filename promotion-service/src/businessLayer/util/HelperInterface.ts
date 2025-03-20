import { UserPromotion } from "src/dataAccessLayer/entity/UserPromotion";
import { Promotion } from "../../dataAccessLayer/entity/Promotion";
import { User } from "src/dataAccessLayer/entity/User";

export interface ICreatePromotion {
    promotion: Promotion;
    userIds: number[];
}

export type TypeUser = Omit<User, "password">;

export interface IUserPromotions {
    promotions: UserPromotion[];
    user: User;
}

export interface IPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface IPaginatedData<T> {
    data: T,
    pagination: IPagination
}