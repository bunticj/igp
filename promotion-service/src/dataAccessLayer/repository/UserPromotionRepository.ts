import { IsNull, Not } from 'typeorm';
import { DATA_SOURCE, LOGGER } from '../../config/Initialize';
import { UserPromotion } from '../entity/UserPromotion';
import { IDictionary } from '../../../../common/util/CommonInterfaces';
import { IPaginatedData } from '../../businessLayer/util/HelperInterface';

export class UserPromotionsRepository {
    private repository = DATA_SOURCE.getRepository(UserPromotion);

    async findAllByUserId(userId: number, page: number, limit: number, isClaimed?: boolean): Promise<IPaginatedData<UserPromotion[]>> {
        LOGGER.debug(`Fetching all promotions for user ${userId}, isClaimed = ${isClaimed}, page = ${page}, limit = ${limit}`);
        const whereConditions: IDictionary = { userId };

        if (isClaimed === true) {
            whereConditions.claimedAt = Not(IsNull());
        } else if (isClaimed === false) {
            whereConditions.claimedAt = IsNull();
        }
        const skip = (page - 1) * limit;


        const [data, totalItems] = await this.repository.findAndCount({
            where: whereConditions,
            relations: ['promotion'],
            skip: skip,
            take: limit
        });

        return {
            data,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        };
    }


    async findByUserIdAndPromotionId(userId: number, promotionId: number): Promise<UserPromotion | null> {
        LOGGER.debug(`Fetching  promotion ${promotionId} for user ${userId}`);
        return await this.repository.findOne({
            where: { userId, promotionId }, relations: ['promotion', 'user']
        });
    }

    async save(userPromotion: UserPromotion): Promise<UserPromotion> {
        LOGGER.debug(`Saving user promotion ${JSON.stringify(userPromotion)}`)
        return await this.repository.save(userPromotion);
    }

    async saveMany(userPromotions: UserPromotion[]): Promise<UserPromotion[]> {
        LOGGER.debug(`Saving user promotions ${JSON.stringify(userPromotions)}`)
        return await this.repository.save(userPromotions);
    }

}
