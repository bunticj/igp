import { UserPromotionsRepository } from "../../dataAccessLayer/repository/UserPromotionRepository";
import { PromotionRepository } from "../../dataAccessLayer/repository/PromotionRepository";
import { Promotion } from "../../dataAccessLayer/entity/Promotion";
import { UserPromotion } from "../../dataAccessLayer/entity/UserPromotion";
import { HelperConstants } from "../../config/HelperConstants";
import { IKafkaEvent } from "../../../../common/util/CommonInterfaces";

class PromotionService {
    private promotionRepo: PromotionRepository;
    private userPromotionRepo: UserPromotionsRepository;

    constructor() {
        this.promotionRepo = new PromotionRepository();
        this.userPromotionRepo = new UserPromotionsRepository()
    }


    async addWelcomePromotion(userId: number): Promise<IKafkaEvent<Promotion>> {
        const title = "Welcome Bonus",
            description = `Get ${HelperConstants.welcomePromotionAmount} EUR on your first login!`,
            startDate = new Date(),
            endDate = new Date();

        endDate.setMonth(endDate.getMonth() + 1);
        const promotion = new Promotion(title, description, HelperConstants.welcomePromotionAmount, true, startDate, endDate)
        await this.addPromotionToUsers(promotion, [userId])
        return { recipients: [userId], data: promotion }
    }

    async addPromotionToUsers(promotion: Promotion, userIds: number[]): Promise<UserPromotion[]> {
        const savedPromotion = await this.promotionRepo.save(promotion);
        const userPromotions = userIds.map((userId) => new UserPromotion(userId, savedPromotion.id));
        return await this.userPromotionRepo.saveMany(userPromotions);
    }


    async claimPromotion(userId: number, promotionId: number): Promise<void> {
        const userPromotion = await this.userPromotionRepo.findByUserIdAndPromotionId(userId, promotionId);
        if (userPromotion && !userPromotion.claimedAt) {
            userPromotion.claimedAt = new Date();
            await this.userPromotionRepo.save(userPromotion);
        }
    }

    async claimAll(userId: number): Promise<void> {
        const unclaimedPromotions = await this.userPromotionRepo.findAllByUserId(userId, false);
        unclaimedPromotions.forEach(promotion => {
            promotion.claimedAt = new Date();
        });
        await this.userPromotionRepo.saveMany(unclaimedPromotions);
    }

}

export const promotionService = new PromotionService();
