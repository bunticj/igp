import { DATA_SOURCE } from '../../config/Initialize';
import { User } from '../entity/User';

export class UserRepository {
  private repository = DATA_SOURCE.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }
  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(id: number) {
     await this.repository.delete(id);
  }
}
