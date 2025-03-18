import { IsNull, Not } from 'typeorm';
import { DATA_SOURCE } from '../../config/Initialize';
import { UserPromotion } from '../entity/UserPromotion';
import { IDictionary } from 'common/util/CommonInterfaces';

export class UserPromotionsRepository {
    private repository = DATA_SOURCE.getRepository(UserPromotion);

    async findAllByUserId(userId: number, isClaimed?: boolean): Promise<UserPromotion[]> {
        const whereConditions: IDictionary = { userId };

        if (isClaimed === true) {
            whereConditions.claimedAt = Not(IsNull());
        } else if (isClaimed === false) {
            whereConditions.claimedAt = IsNull();
        }
        return await this.repository.find({ where: whereConditions });
        // TODO pagination
    }

    async findByUserIdAndPromotionId(userId: number, promotionId: number): Promise<UserPromotion | null> {
        return await this.repository.findOne({
            where: { userId, promotionId },
        });
    }

    async save(userPromotion: UserPromotion): Promise<UserPromotion> {
        return await this.repository.save(userPromotion);
    }

    async saveMany(userPromotions: UserPromotion[]): Promise<UserPromotion[]> {
        return await this.repository.save(userPromotions);
    }

 
    async delete(userPromotionId: number): Promise<void> {
        await this.repository.delete(userPromotionId);
    }
}
