import { ERR_HANDLER} from "../../config/Initialize";
import { RoleType } from "../../../../common/enum/RoleType";
import { User } from "../../dataAccessLayer/entity/User";
import { UserRepository } from "../../dataAccessLayer/repository/UserRepository";
import { HelperConstants } from "../../config/HelperConstants";
import { authenticationService } from "./AutheticationService";
import { AxiosHttpClient } from "../util/AxiosHttpClient";

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

    public async createUser(username: string, hashedPass: string, roleType: RoleType): Promise<User> {
        const newUser = new User();
        newUser.username = username;
        newUser.password = hashedPass;
        newUser.role = roleType;
        const userData = await this.repository.save(newUser);
        return userData;
    }

    public async updateUser(user: User): Promise<User> {
        return await this.repository.save(user)
    }

    public async triggerNewUserPromotion(userId: number): Promise<void> {
        try {
            const fullPath = `${HelperConstants.promotionServerFullUrlName}/api/v1/admin/promotion/trigger`;
            const sysToken = authenticationService.getSysUserAccessToken();
            await AxiosHttpClient.sendRequest(fullPath, sysToken, { userId })
        } catch (err) {
            ERR_HANDLER.catchError(err as Error)
        }
    }

}

export const userService = new UserService();
