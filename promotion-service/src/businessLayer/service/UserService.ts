import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { UserRepository } from "../../dataAccessLayer/repository/UserRepository";
import { promotionService } from "./PromotionService";

class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository()
    }

    async claimPromotion(userId: number, promotionId: number): Promise<void> {
        const userPromotion = await promotionService.fetchByUserAndPromotion(userId, promotionId);
        if (!userPromotion) throw new CustomError(ErrorType.NotFound, "User Promotion not found", { userPromotion, userId, promotionId });
        if (userPromotion.user && userPromotion.promotion && !userPromotion.claimedAt) {
            userPromotion.claimedAt = new Date();
            userPromotion.user.balance += userPromotion.promotion.amount;
            await promotionService.saveUserPromotions([userPromotion]);
        } else throw new CustomError(ErrorType.NotFound, "User and promotion not found", { userPromotion, userId, promotionId })
   
        // TODO check do we need user repo here
        // todo create route and controller for this, and for fetching 
        // todo pagination
    }



    async claimAll(userId: number): Promise<void> {
        const unclaimedPromotions = await promotionService.fetchAllByUserId(userId, false);
        if (!unclaimedPromotions.length) throw new CustomError(ErrorType.NotFound, "No unclaimed promotions", { userId })
        const user = unclaimedPromotions[0].user;
        if (!user) throw new CustomError(ErrorType.BadRequest, "temp err, check this")

      unclaimedPromotions.forEach(userPromotion => {
            if ( userPromotion.promotion && !userPromotion.claimedAt && userPromotion.promotion.isActive) {
                userPromotion.claimedAt = new Date();
                user.balance += userPromotion.promotion.amount;

            }else throw new CustomError(ErrorType.BadRequest, "temp err, check this2")


        });
        await promotionService.saveUserPromotions(unclaimedPromotions);

    }


}

export const userService = new UserService();
