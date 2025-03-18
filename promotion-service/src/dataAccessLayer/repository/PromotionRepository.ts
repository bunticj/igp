import { DATA_SOURCE } from '../../config/Initialize';
import { Promotion } from '../entity/Promotion';

export class PromotionRepository {
    private repository = DATA_SOURCE.getRepository(Promotion);

    async findById(id: number): Promise<Promotion | null> {
        return await this.repository.findOne({
            where: { id },
        });
    }

    async save(promotion: Promotion): Promise<Promotion> {
        return await this.repository.save(promotion);
    }

    async delete(id: number) {
        return await this.repository.delete(id);
    }

    async deactivatePromotion(promotionId: number) {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .update(Promotion)
            .set({ isActive: false })
            .where("endDate < NOW()")
            .orWhere("promotionId = :promotionId", { promotionId });
        await queryBuilder.execute();
    }
}
