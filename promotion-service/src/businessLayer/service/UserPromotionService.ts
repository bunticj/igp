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
            endDate = new Date(),
            isActive = true,
            amount = HelperConstants.welcomePromotionAmount;
        endDate.setMonth(endDate.getMonth() + 1);
        const promotion = this.createPromotion(title, description, amount, isActive, startDate, endDate);
        return await this.savePromotion(promotion, [userId]);
    }

    async savePromotion(promotion: Promotion, userIds: number[]): Promise<IKafkaEvent<Promotion>> {
        const savedPromotion = await this.promotionRepo.save(promotion);
        const userPromotions = userIds.map((userId) => {
            const newProm = new UserPromotion()
            newProm.promotion = savedPromotion;
            newProm.userId = userId;
            newProm.promotionId = savedPromotion.id;
            return newProm;
        });
        await this.userPromotionRepo.saveMany(userPromotions);
        return { recipients: userIds, data: savedPromotion }
    }

    async saveUserPromotions(userIds: number[], promotionId: number): Promise<UserPromotion[]>{
        const userPromotions = userIds.map((userId) => {
            const newProm = new UserPromotion()
            newProm.userId = userId;
            newProm.promotionId = promotionId;
            return newProm;
        });
        await this.userPromotionRepo.saveMany(userPromotions);
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

    createPromotion(title: string, description: string, amount: number, isActive: boolean, startDate: Date, endDate: Date) {

        const promotion = new Promotion();
        promotion.title = title;
        promotion.description = description;
        promotion.amount = amount;
        promotion.isActive = isActive;
        promotion.startDate = startDate;
        promotion.endDate = endDate;
        return promotion;
    }
}

export const promotionService = new PromotionService();
