import { DATA_SOURCE, LOGGER } from '../../config/Initialize';
import { User } from '../entity/User';

export class UserRepository {
  private repository = DATA_SOURCE.getRepository(User);

  async findById(id: number): Promise<User | null> {
    LOGGER.debug(`Fetching user with id ${id}`);
    return await this.repository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    LOGGER.debug(`Fetching user ${username}`);
    return await this.repository.findOne({ where: { username } });
  }

  async save(user: User): Promise<User> {
    LOGGER.debug(`Saving user ${JSON.stringify(user)}`);
    return await this.repository.save(user);
  }

}
