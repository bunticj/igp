
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import express from "express";
import { ERR_HANDLER, LOGGER } from "../../config/Initialize";
import { authenticationService } from "../../businessLayer/service/AutheticationService";
import { TokenType } from "../../../../common/enum/TokenType";
import { RoleType } from "../../../../common/enum/RoleType";

export const isUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) throw new CustomError(ErrorType.Unauthorized, "Mising authorization header");
        const token = authorization.split("Bearer ")[1];
        LOGGER.debug("PRIJE VERIFIKACIJE")
        const jwtPayload = authenticationService.verifyJwt(token, TokenType.Access);
        LOGGER.debug("PoslijeRIJE VERIFIKACIJE")
        res.locals.jwtPayload = jwtPayload;
        return next();
    } catch (error) {
        const errorResponse = ERR_HANDLER.catchError(error as Error, { url: req.originalUrl, method: req.method, ...req.body });
        res.status(400).send(errorResponse);
    }
};

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) throw new CustomError(ErrorType.Unauthorized, "Mising authorization header");
        const token = authorization.split("Bearer ")[1];
        console.log(" prije verifikacije")

        const jwtPayload = authenticationService.verifyJwt(token, TokenType.Access);
        console.log(" poslije verifgikacijea")

        if (jwtPayload.role !== RoleType.Admin) throw new CustomError(ErrorType.Forbidden, "Forbidden");
        res.locals.jwtPayload = jwtPayload;
        console.log(" na kraju is admin auth-a")

        return next();
    } catch (error) {
        const errorResponse = ERR_HANDLER.catchError(error as Error, { url: req.originalUrl, method: req.method, ...req.body });
        res.status(400).send(errorResponse);
    }
};

