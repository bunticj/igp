import { TokenType } from "../../../../common/enum/TokenType";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { RoleType } from "../../../../common/enum/RoleType";
import { verify, sign } from "jsonwebtoken";
import { ITokenPayload, ITokenResponse } from "../../../../common/util/CommonInterfaces";
import { HelperConstants } from "../../config/HelperConstants";
import { EnvConfig } from "../../config/EnvConfig";
import { CustomError } from "../../../../common/model/CustomError";


 class AuthenticationService {
    public signAuthTokens(userId: number, role: RoleType): ITokenResponse {
        const accessToken = this.signToken(userId, role, TokenType.Access);
        const refreshToken = this.signToken(userId, role, TokenType.Refresh);
        return { accessToken, refreshToken };
    }

    private signToken(userId: number, role: RoleType, tokenType: TokenType): string {
        const expiresIn = tokenType === TokenType.Access ? HelperConstants.accessTokenExpirationInSeconds : HelperConstants.refreshTokenExpirationInSeconds;
        const payload: ITokenPayload = { sub: userId, role, tokenType, iss: HelperConstants.serverUrlName };
        const token = sign(payload, EnvConfig.JWT_SECRET, { expiresIn });
        return token;
    }

    public verifyJwt = (token: string, tokenType: TokenType): ITokenPayload => {
        if (!token) throw new CustomError(ErrorType.Unauthorized, ErrorType[ErrorType.Unauthorized]);
        const jwtPayload: ITokenPayload = (verify(token, EnvConfig.JWT_SECRET)) as any;
        if (!jwtPayload || !jwtPayload.sub || jwtPayload.tokenType !== tokenType || jwtPayload.iss !== HelperConstants.serverUrlName) throw new CustomError(ErrorType.Unauthorized, "Invalid token verification", { tokenType, token });
        return jwtPayload;
    };
}
export const authenticationService = new AuthenticationService();
