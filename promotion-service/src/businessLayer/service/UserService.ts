import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { UserRepository } from "../../dataAccessLayer/repository/UserRepository";
import { promotionService } from "./PromotionService";
import { User } from "../../dataAccessLayer/entity/User";
import { UserPromotion } from "src/dataAccessLayer/entity/UserPromotion";
import { Promotion } from "src/dataAccessLayer/entity/Promotion";

class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository()
    }

    async claimPromotion(userId: number, promotionId: number): Promise<User> {
        const userPromotion = await promotionService.fetchByUserAndPromotion(userId, promotionId);
        if (!userPromotion) throw new CustomError(ErrorType.NotFound, "User Promotion not found", { userPromotion, userId, promotionId });
        if (!userPromotion.user || !userPromotion.promotion) throw new CustomError(ErrorType.BadRequest, "User Promotion relations missing", { userPromotion, userId, promotionId });
        if (userPromotion.claimedAt) throw new CustomError(ErrorType.BadRequest, "Promotion already claimed", { userPromotion });
        userPromotion.claimedAt = new Date();
        let balance = +(userPromotion.user.balance);
        let amount = +(userPromotion.promotion.amount);
        balance += amount;
        userPromotion.user.balance = balance;
        const [user] = await Promise.all([this.userRepo.save(userPromotion.user), promotionService.saveUserPromotions([userPromotion])]);
        return user;
    }

    async claimAll(userId: number): Promise<{ user: User, userProms: UserPromotion[] }> {
        const result = await promotionService.fetchAllByUserId(userId, 1, 50, false);
        if (!result.pagination.totalItems) throw new CustomError(ErrorType.BadRequest, "No unclaimed promotions", { userId })
        result.data.promotions.forEach(userPromotion => {
            if (userPromotion.promotion && !userPromotion.claimedAt && userPromotion.promotion.isActive) {
                userPromotion.claimedAt = new Date();
                this.increaseBalance(result.data.user as User, userPromotion.promotion)
            }

        });
        const updatedUser = await this.userRepo.save(result.data.user);
        const userProms = await promotionService.saveUserPromotions(result.data.promotions)
        return { user: updatedUser, userProms }

    }

    async fetchById(id: number): Promise<User | null> {
        return await this.userRepo.findById(id);
    }

    private increaseBalance(user: User, prom: Promotion): User {
        let balance = +(user.balance);
        let amount = +(prom.amount);
        balance += amount;
        user.balance = balance;
        return user;
    }
}

export const userService = new UserService();
