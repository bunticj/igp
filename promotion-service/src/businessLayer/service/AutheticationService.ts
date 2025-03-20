import { TokenType } from "../../../../common/enum/TokenType";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { verify } from "jsonwebtoken";
import { ITokenPayload } from "../../../../common/util/CommonInterfaces";
import { EnvConfig } from "../../config/EnvConfig";
import { CustomError } from "../../../../common/model/CustomError";


 class AuthenticationService {
    public verifyJwt = (token: string, tokenType: TokenType): ITokenPayload => {
        if (!token) throw new CustomError(ErrorType.Unauthorized, ErrorType[ErrorType.Unauthorized]);
        const jwtPayload: ITokenPayload = (verify(token, EnvConfig.JWT_SECRET)) as any;
        if (!jwtPayload || !jwtPayload.sub || jwtPayload.tokenType !== tokenType ) throw new CustomError(ErrorType.Unauthorized, "Invalid token verification", { tokenType, token });
        return jwtPayload;
    };
}
export const authenticationService = new AuthenticationService();
