import express from 'express';
import { promotionController } from '../controller/PromotionController';

export const publicRouter = express.Router();

publicRouter.post('/promotion/claim', promotionController.claimPromotion);
publicRouter.post('/promotion/claim-all', promotionController.claimAllPromotions);
publicRouter.get('/promotion', promotionController.fetchAllUserPromotions); 
