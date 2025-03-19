
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import express from "express";
import { ERR_HANDLER } from "../../config/Initialize";
import { authenticationService } from "../../businessLayer/service/AutheticationService";
import { TokenType } from "../../../../common/enum/TokenType";
import { RoleType } from "../../../../common/enum/RoleType";

export const isUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) throw new CustomError(ErrorType.Unauthorized, "Mising authorization header");
        const token = authorization.split("Bearer ")[1];
        const jwtPayload = authenticationService.verifyJwt(token, TokenType.Access);
        res.locals.jwtPayload = jwtPayload;
        return next();
    } catch (error) {
        const err = error as CustomError;
        if (!err.errorType) err.errorType = ErrorType.Unauthorized;
        const errorResponse = ERR_HANDLER.catchError(error as Error, { url: req.originalUrl, method: req.method, ...req.body });
        res.status(errorResponse.status).send(errorResponse);
    }
};

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) throw new CustomError(ErrorType.Unauthorized, "Mising authorization header");
        const token = authorization.split("Bearer ")[1];
        const jwtPayload = authenticationService.verifyJwt(token, TokenType.Access);
        if (jwtPayload.role !== RoleType.Admin) throw new CustomError(ErrorType.Forbidden, "Forbidden");
        res.locals.jwtPayload = jwtPayload;
        return next();
    } catch (error) {
        const err = error as CustomError;
        if (!err.errorType) err.errorType = ErrorType.Unauthorized;
        const errorResponse = ERR_HANDLER.catchError(error as CustomError, { url: req.originalUrl, method: req.method, ...req.body });
        res.status(errorResponse.status).send(errorResponse);
    }
};

