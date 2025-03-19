import express from 'express';
import { promotionController } from '../controller/PromotionController';

export const adminRouter = express.Router();

adminRouter.post('/promotion/trigger', promotionController.assignWelcomePromotion);
adminRouter.get('/test', promotionController.assignWelcomePromotion);

