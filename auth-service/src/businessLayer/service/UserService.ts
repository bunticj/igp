import { RoleType } from "../../../../common/enum/RoleType";
import { User } from "../../dataAccessLayer/entity/User";
import { UserRepository } from "../../dataAccessLayer/repository/UserRepository";

class UserService {
    private repository: UserRepository;
    constructor() {
        this.repository = new UserRepository();
    }



    public async getByUserId(userId: number): Promise<User | null> {
        const userData = await this.repository.findById(userId);
        return userData;
    }

    public async getByUsername(username: string): Promise<User | null> {
        const userData = await this.repository.findByUsername(username);
        return userData;
    }

    public async createUser(username: string, hashedPass: string, roleType: RoleType): Promise<Omit<User, "password">> {
        const newUser = new User();
        newUser.username = username;
        newUser.password = hashedPass;
        newUser.role = roleType;
        const userData = await this.repository.save(newUser);
        return userData;
    }

}

export const userService = new UserService();
