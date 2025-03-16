import express from 'express';
import { userController } from '../controller/UserController';


export const router = express.Router();

router.post('/register', userController.register);
router.get('/user/:userId', userController.getById);


