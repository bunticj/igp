import { DATA_SOURCE, LOGGER } from '../../config/Initialize';
import { UserToken } from '../entity/UserToken';

export class UserTokenRepository {
    private repository = DATA_SOURCE.getRepository(UserToken);

    async findByUserId(userId: number): Promise<UserToken | null> {
        LOGGER.debug(`Fetching user token by user id ${userId}`);
        return await this.repository.findOne({ where: { userId } });
    }

    async save(userToken: UserToken): Promise<UserToken> {
        LOGGER.debug(`Saving user token${JSON.stringify(userToken)}`);
        return await this.repository.save(userToken);
    }

    async deleteByUserId(userId: number) {
        LOGGER.debug(`Deleting user token by user id ${userId}`);
        return await this.repository.delete({ userId });
    }

    async clearExpiredTokens() {
        LOGGER.debug(`Clear expired refresh tokens`);
        const queryBuilder = this.repository
            .createQueryBuilder()
            .delete()
            .where(`expiresAt < NOW()`);
        await queryBuilder.execute();
    }
}
