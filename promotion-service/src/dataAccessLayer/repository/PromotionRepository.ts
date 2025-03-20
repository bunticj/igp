import { DATA_SOURCE, LOGGER } from '../../config/Initialize';
import { Promotion } from '../entity/Promotion';

export class PromotionRepository {
    private repository = DATA_SOURCE.getRepository(Promotion);

    async findById(id: number): Promise<Promotion | null> {
        LOGGER.debug(`Fetching Promotion ${id}`)
        return await this.repository.findOne({
            where: { id },
        });
    }

    async save(promotion: Promotion): Promise<Promotion> {
        LOGGER.debug(`Saving Promotion ${JSON.stringify(promotion)}`)
        return await this.repository.save(promotion);
    }

    async deactivatePromotion(promotionId: number) {
        LOGGER.debug(`Deactivating Promotion ${(promotionId)}`)

        const queryBuilder = this.repository
            .createQueryBuilder()
            .update(Promotion)
            .set({ isActive: false })
            .where("endDate < NOW()")
            .orWhere("promotionId = :promotionId", { promotionId });
        await queryBuilder.execute();
    }
}
