
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import express from "express";
import { ERR_HANDLER } from "../../config/Initialize";

// handle express errors
export const errorInterceptor = (error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
        if (error instanceof Error) {
            (error as CustomError)["errorType"] = ErrorType.BadRequest;
            const errorResponse = ERR_HANDLER.catchError(error, { url: req.originalUrl, method: req.method, ...req.body });
            res.status(400).send(errorResponse);
        }
        else next();
    } catch (err) {
        const errorResponse = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl, method: req.method, ...req.body });
        res.status(400).send(errorResponse);
    }
};





