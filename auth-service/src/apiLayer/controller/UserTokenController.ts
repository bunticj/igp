
import { TokenType } from "../../../../common/enum/TokenType";
import express from "express";
import { authenticationService } from "../../businessLayer/service/AutheticationService";
import { userTokenService } from "../../businessLayer/service/UserTokenService";
import { ERR_HANDLER } from "../../config/Initialize";
import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";

class UserTokenController {
    public async refreshToken(req: express.Request, res: express.Response) {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken || typeof refreshToken !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid refreshToken", { refreshToken });
            const { sub, role } = authenticationService.verifyJwt(refreshToken, TokenType.Refresh);
            const tokens = await userTokenService.handleRefreshToken(sub, refreshToken, role);
            res.status(200).send({ data: tokens });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }


}

export const userTokenController = new UserTokenController();
