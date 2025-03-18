import { DATA_SOURCE } from '../../config/Initialize';
import { UserToken } from '../entity/UserToken';

export class UserTokenRepository {
    private repository = DATA_SOURCE.getRepository(UserToken);

    async findById(id: number): Promise<UserToken | null> {
        return await this.repository.findOne({
            where: { id },
        });
    }

    async save(user: UserToken): Promise<UserToken> {
        return await this.repository.save(user);
    }

    async delete(id: number) {
        return await this.repository.delete(id);
    }

    async clearExpiredTokens(durationInSeconds: number) {
        const hours = durationInSeconds / 3600;
        const queryBuilder = this.repository
            .createQueryBuilder()
            .delete()
            .from(UserToken)
            .where(`createdAt < DATE_SUB(NOW(), INTERVAL ${hours} HOUR)`);

        await queryBuilder.execute();
    }
}
