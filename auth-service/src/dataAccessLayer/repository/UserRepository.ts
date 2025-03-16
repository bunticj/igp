import { AppDataSource } from '../DbConnection'; 
import { User } from '../entity/User';

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findAll() {
    return await this.repository.find();
  }

  async findById(id: number) {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return await this.repository.findOne({
      where: { username },
    });
  }
  async save(user: User) {
    return await this.repository.save(user);
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }
}
