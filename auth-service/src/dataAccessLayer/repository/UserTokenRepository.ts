import { DATA_SOURCE } from '../../config/Initialize';
import { UserToken } from '../entity/UserToken';

export class UserTokenRepository {
    private repository = DATA_SOURCE.getRepository(UserToken);

    async findByUserId(userId: number): Promise<UserToken | null> {
        return await this.repository.findOne({
            where: { userId }
        });
    }

    async save(user: UserToken): Promise<UserToken> {
        return await this.repository.save(user);
    }

    async deleteByUserId(userId: number) {
        return await this.repository.delete({ userId });
    }

    async clearExpiredTokens() {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .delete()
            .where(`expiresAt < NOW()`); 
        await queryBuilder.execute();
    }
}
