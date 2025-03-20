
import express from "express";
import { ERR_HANDLER } from "../../config/Initialize";
import { EnvConfig } from "../../config/EnvConfig";
import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { promotionService } from "../../businessLayer/service/PromotionService";
import { KProducer } from "../../kafkaLayer/KafkaProducer";
import { ITokenPayload } from "../../../../common/util/CommonInterfaces";
import { userService } from "../../businessLayer/service/UserService";
import { ICreatePromotion } from "../../businessLayer/util/HelperInterface";

class PromotionController {

    public async assignWelcomePromotion(req: express.Request, res: express.Response) {
        try {
            const userId = req.body.userId
            if (!userId || typeof userId !== 'number') throw new CustomError(ErrorType.RequestBodyError, "Invalid userId", { userId });
            const data = await promotionService.addWelcomePromotion(userId);
            await KProducer.produceMessages(EnvConfig.KAFKA_TOPIC_NAME!, data)
            res.status(200).send({ data: 'OK' });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async createPromotion(req: express.Request, res: express.Response) {
        try {
            const body = req.body as ICreatePromotion;
            const data = await promotionService.insertNewPromotion(body.promotion, body.userIds);
            await KProducer.produceMessages(EnvConfig.KAFKA_TOPIC_NAME!, data)
            res.status(200).send({ data });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async claimPromotion(req: express.Request, res: express.Response) {
        try {
            const promotionId = Number(req.body.promotionId)
            if (!Number.isInteger(promotionId)) throw new CustomError(ErrorType.BadRequest, "Invalid promotion id");
            const payload: ITokenPayload = res.locals.jwtPayload;
            const data = await userService.claimPromotion(payload.sub, promotionId)
            res.status(200).send({ data });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async claimAllPromotions(req: express.Request, res: express.Response) {
        try {
            const payload: ITokenPayload = res.locals.jwtPayload;
            const data = await userService.claimAll(payload.sub)
            res.status(200).send({ data });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async fetchAllUserPromotions(req: express.Request, res: express.Response) {
        try {
            const payload: ITokenPayload = res.locals.jwtPayload;
            const { isClaimed, page, limit } = PromotionController.handleQueryParams(req.query.isClaimed as string, req.query.page as string, req.query.limit as string);
            const data = await promotionService.fetchAllByUserId(payload.sub, page, limit, isClaimed);
            res.status(200).send({ data });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    private static handleQueryParams(isClaimed?: string, page?: string, limit?: string) {
        let isClaimedBool: boolean | undefined;
        if (isClaimed === 'true') isClaimedBool = true;
        else if (isClaimed === 'false') isClaimedBool = false;

        const pageNum = (page && Number.isInteger(+page)) ? +page : 1;
        const limitNum = (limit && Number.isInteger(+limit)) ? +limit : 10;

        return { isClaimed: isClaimedBool, page: pageNum, limit: limitNum }
    }
}

export const promotionController = new PromotionController();
