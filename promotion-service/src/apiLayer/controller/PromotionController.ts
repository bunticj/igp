
import express from "express";
import { ERR_HANDLER } from "../../config/Initialize";
import { EnvConfig } from "../../config/EnvConfig";
import { CustomError } from "../../../../common/model/CustomError";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { promotionService } from "../../businessLayer/service/PromotionService";
import { KProducer } from "../../kafkaLayer/KafkaProducer";
import { Promotion } from "src/dataAccessLayer/entity/Promotion";
import { ICreatePromotion } from "common/util/CommonInterfaces";

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
            const data = await promotionService.insertNewPromotion(body.promotion as Promotion, body.userIds);
            await KProducer.produceMessages(EnvConfig.KAFKA_TOPIC_NAME!, data)
            res.status(200).send({ data: 'OK' });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async test(req: express.Request, res: express.Response) {

        res.status(200).send({ data: 'OK' });


    }
}

export const promotionController = new PromotionController();
