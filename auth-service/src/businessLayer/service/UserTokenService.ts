import { UserToken } from "../../dataAccessLayer/entity/UserToken";
import { UserTokenRepository } from "../../dataAccessLayer/repository/UserTokenRepository";
import { authenticationService } from "./AutheticationService";
import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { RoleType } from "../../../../common/enum/RoleType";
import { ITokenResponse } from "../../../../common/util/CommonInterfaces";
import { HelperConstants } from "../../config/HelperConstants";

class UserTokenService {
    private repository: UserTokenRepository;
    constructor() {
        this.repository = new UserTokenRepository();
    }

    public async createUserToken(userId: number, refreshToken: string): Promise<UserToken> {
        await this.repository.deleteByUserId(userId);
        const userToken = new UserToken();
        userToken.userId = userId;
        userToken.refreshToken = refreshToken;
        const expDate = new Date();
        const expInHours = HelperConstants.refreshTokenExpirationInSeconds / 3600
        expDate.setHours(expDate.getHours() + expInHours); // Add 8 hours
        console.log(expDate); // OS
        userToken.expiresAt = expDate;
        const data = await this.repository.save(userToken);
        return data;
    }


    public async handleRefreshToken(userId: number, oldRefreshToken: string, role: RoleType): Promise<ITokenResponse> {
        await this.repository.clearExpiredTokens()
        const userTokenData = await this.repository.findByUserId(userId);
        if (!userTokenData || oldRefreshToken !== userTokenData.refreshToken) throw new CustomError(ErrorType.Unauthorized, "Invalid refresh token", { oldRefreshToken, userTokenData });
        const tokens = authenticationService.signAuthTokens(userId, role);
        await this.createUserToken(userId, tokens.refreshToken);
        return tokens;
    }

}

export const userTokenService = new UserTokenService();
