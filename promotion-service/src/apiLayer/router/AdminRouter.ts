import express from 'express';
import { promotionController } from '../controller/PromotionController';
import { validateBody } from '../middleware/ValidationMiddleware';
import { PromotionValidator } from '../validator/PromotionValidator';

export const adminRouter = express.Router();

adminRouter.post('/promotion',validateBody(PromotionValidator.createPromotionBodySchema()), promotionController.createPromotion);
adminRouter.post('/promotion/trigger', promotionController.assignWelcomePromotion);

adminRouter.get('/test', promotionController.assignWelcomePromotion);

