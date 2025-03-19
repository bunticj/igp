import express from 'express';
import { userController } from '../controller/UserController';
import { userTokenController } from '../controller/UserTokenController';
import { isAdmin, isUser } from '../middleware/AuthenticationMiddleware';


export const router = express.Router();

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.post('/token/refresh', isUser, userTokenController.refreshToken);

router.post('/user/:userId', isAdmin, userController.updateRole);
