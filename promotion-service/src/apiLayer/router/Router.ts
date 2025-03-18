import express from 'express';
import { publicRouter } from './PublicRouter';
import { adminRouter } from './AdminRouter';
import { isAdmin, isUser } from '../middleware/AuthenticationMiddleware';

export const router = express.Router();
router.use('/admin', isAdmin, adminRouter);
router.use('/', isUser, publicRouter);

/* eslint-enable @typescript-eslint/no-misused-promises */
