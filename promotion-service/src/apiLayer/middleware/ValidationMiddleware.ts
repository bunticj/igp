import { z } from 'zod';
import express from "express";
import { CustomError } from '../../../../common/model/CustomError';
import { ErrorType } from '../../../../common/enum/ErrorType';
import { ERR_HANDLER } from '../../config/Initialize';


export const validateBody = (schema: z.ZodType<any, any>) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            const err = error as CustomError;
            if (!err.errorType) err.errorType = ErrorType.RequestBodyError;
            const errorResponse = ERR_HANDLER.catchError(error as CustomError, { url: req.originalUrl, method: req.method, ...req.body });
            res.status(errorResponse.status).send(errorResponse);
        }
    }
}