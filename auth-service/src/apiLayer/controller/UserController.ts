import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { ERR_HANDLER } from "../../businessLayer/config/Initialize";
import { User } from "../../dataAccessLayer/entity/User";
import express from "express";
import bcrypt from "bcrypt";
import { userService } from "../../businessLayer/service/UserService";
import { HelperConstants } from "../../businessLayer/config/HelperConstants";
import { RoleType } from "../../../../common/enum/RoleType";
import { UserValidator } from "../validator/UserValidator";


class UserController {
    public async register(req: express.Request, res: express.Response) {
        try {
            const userBody = req.body as User;
            UserValidator.validateUserBody(userBody);
            const { username, password } = userBody;
            const existingUser = await userService.getByUsername(username);
            if (existingUser) throw new CustomError(ErrorType.UserExist, "username already exists", { username });
            const hashedPass = await bcrypt.hash(password!, HelperConstants.bcryptSaltRounds);
            const user = userService.createUser(username, hashedPass, RoleType.User);
            res.status(200).send({ data: user });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { ...req.body });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async getById(req: express.Request, res: express.Response) {
        try {
            const wantedUserId = +req.params.userId;
            if (isNaN(wantedUserId)) throw new CustomError(ErrorType.BadRequest, "Invalid user id");
            const user = await userService.getByUserId(wantedUserId);
            if (!user) throw new CustomError(ErrorType.UserNotFound, "User doesn't exist", { wantedUserId });
            res.status(200).send({ data: user });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }



}

export const userController = new UserController();
