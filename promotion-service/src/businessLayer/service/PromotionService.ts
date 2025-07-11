import { PromotionRepository } from "../../dataAccessLayer/repository/PromotionRepository";
import { Promotion } from "../../dataAccessLayer/entity/Promotion";
import { HelperConstants } from "../../config/HelperConstants";
import { IKafkaEvent } from "../../../../common/util/CommonInterfaces";
import { UserPromotionsRepository } from "../../dataAccessLayer/repository/UserPromotionRepository";
import { UserPromotion } from "../../dataAccessLayer/entity/UserPromotion";
import { userService } from "./UserService";
import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { IPaginatedData, IUserPromotions } from "../util/HelperInterface";

class PromotionService {
    private promotionRepo: PromotionRepository;
    private userPromotionRepo: UserPromotionsRepository;

    constructor() {
        this.promotionRepo = new PromotionRepository();
        this.userPromotionRepo = new UserPromotionsRepository();
    }

    async insertUserPromotions(userIds: number[], promotionId: number): Promise<UserPromotion[]> {
        const userPromotions = userIds.map((userId) => {
            const newProm = new UserPromotion()
            newProm.userId = userId;
            newProm.promotionId = promotionId;
            return newProm;
        });
        return await this.saveUserPromotions(userPromotions);
    }

    async addWelcomePromotion(userId: number): Promise<IKafkaEvent<Promotion>> {
        const title = "Welcome Bonus",
            description = `Get ${HelperConstants.welcomePromotionAmount} EUR on your first login!`,
            startDate = new Date(),
            endDate = new Date(),
            isActive = true,
            amount = HelperConstants.welcomePromotionAmount;
        endDate.setMonth(endDate.getMonth() + 1);
        const promotion = this.generatePromotion(title, description, amount, isActive, startDate, endDate);
        return await this.insertNewPromotion(promotion, [userId]);
    }

    async insertNewPromotion(promotion: Promotion, userIds: number[]): Promise<IKafkaEvent<Promotion>> {
        const savedProm = await this.promotionRepo.save(promotion);
        const userPromotions = await this.insertUserPromotions(userIds, savedProm.id)
        return { recipients: userPromotions.map(up => up.userId), data: promotion }
    }

    async fetchByUserAndPromotion(userId: number, promotionId: number): Promise<UserPromotion | null> {
        return await this.userPromotionRepo.findByUserIdAndPromotionId(userId, promotionId);
    }

    async fetchAllByUserId(userId: number, page: number = 1, limit: number = 10, isClaimed?: boolean): Promise<IPaginatedData<IUserPromotions>> {
        const user = await userService.fetchById(userId);
        if (!user) throw new CustomError(ErrorType.BadRequest, "Invalid user id", { userId })
        const pagData = await this.userPromotionRepo.findAllByUserId(userId, page, limit, isClaimed);
        return { pagination: pagData.pagination, data: { promotions: pagData.data, user } }
    }

    async saveUserPromotions(userPromotions: UserPromotion[]) {
        return await this.userPromotionRepo.saveMany(userPromotions);
    }

    generatePromotion(title: string, description: string, amount: number, isActive: boolean, startDate: Date, endDate: Date) {
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
