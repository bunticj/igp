import { DATA_SOURCE } from '../../config/Initialize';
import { User } from '../entity/User';

export class UserRepository {
  private repository = DATA_SOURCE.getRepository(User);

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(id: number) {
     await this.repository.delete(id);
  }
}
