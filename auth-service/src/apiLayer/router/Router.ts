import express from 'express';
import { userController } from '../controller/UserController';
import { userTokenController } from '../controller/UserTokenController';


export const router = express.Router();

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/:userId', userController.getById);

router.post('/token/refresh', userTokenController.refreshToken);
