import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { ERR_HANDLER } from "../../config/Initialize";
import { User } from "../../dataAccessLayer/entity/User";
import express from "express";
import bcrypt from "bcrypt";
import { userService } from "../../businessLayer/service/UserService";
import { HelperConstants } from "../../config/HelperConstants";
import { RoleType } from "../../../../common/enum/RoleType";
import { UserValidator } from "../validator/UserValidator";
import { authenticationService } from "../../businessLayer/service/AutheticationService";
import { userTokenService } from "../../businessLayer/service/UserTokenService";


class UserController {
    public async register(req: express.Request, res: express.Response) {
        try {
            const userBody = req.body as User;
            UserValidator.validateUserBody(userBody);
            const { username, password } = userBody;
            const existingUser = await userService.getByUsername(username);
            if (existingUser) throw new CustomError(ErrorType.UserExist, "username already exists", { username });
            const hashedPass = await bcrypt.hash(password!, HelperConstants.bcryptSaltRounds);
            const user = await userService.createUser(username, hashedPass, RoleType.User);

            const tokens = authenticationService.signAuthTokens(user.id, RoleType.User);
            await userTokenService.createUserToken(user.id!, tokens.refreshToken);

            // TODO trigger promotion service api
            res.status(200).send({ data: { user, tokens } });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { ...req.body });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async login(req: express.Request, res: express.Response) {
        try {
            const userBody = req.body as User;
            UserValidator.validateUserBody(userBody);
            const { username, password } = userBody;
            const existingUser = await userService.getByUsername(username);
            if (!existingUser) throw new CustomError(ErrorType.UserNotFound, "User doesn't exist", { username });
            const isMatch = await bcrypt.compare(password, existingUser.password!);
            if (!isMatch) throw new CustomError(ErrorType.Unauthorized, "Unauthorized");
            const tokens = authenticationService.signAuthTokens(existingUser.id, existingUser.role);
        
            await userTokenService.createUserToken(existingUser.id!, tokens.refreshToken);
            res.status(200).send({ data: { user: existingUser, tokens } });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { ...req.body });
            res.status(error.status).send({ error: error.data });
        }
    }

    public async getById(req: express.Request, res: express.Response) {
        try {
            const userId = Number(req.params.userId);
            if (!Number.isInteger(userId)) {
                throw new CustomError(ErrorType.BadRequest, "Invalid user id");
              }
            const user = await userService.getByUserId(userId);
            if (!user) throw new CustomError(ErrorType.UserNotFound, "User doesn't exist", { userId });
            res.status(200).send({ data: user });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }



}

export const userController = new UserController();
