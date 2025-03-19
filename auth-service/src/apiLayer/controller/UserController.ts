import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { ERR_HANDLER, LOGGER } from "../../config/Initialize";
import { User } from "../../dataAccessLayer/entity/User";
import express from "express";
import bcrypt from "bcryptjs";
import { userService } from "../../businessLayer/service/UserService";
import { HelperConstants } from "../../config/HelperConstants";
import { RoleType } from "../../../../common/enum/RoleType";
import { authenticationService } from "../../businessLayer/service/AutheticationService";
import { userTokenService } from "../../businessLayer/service/UserTokenService";
import { Validator } from "../validator/Validator";


class UserController {
    public async register(req: express.Request, res: express.Response) {
        try {
            const userBody = req.body as User;
            Validator.validateUserBody(userBody);
            const { username, password } = userBody;
            const existingUser = await userService.getByUsername(username);
            if (existingUser) throw new CustomError(ErrorType.UserExist, "username already exists", { username });

            const salt = await bcrypt.genSalt(HelperConstants.bcryptSaltRounds);
            const hashedPass = await bcrypt.hash(password!, salt);
            const user = await userService.createUser(username, hashedPass, RoleType.User);

            const tokens = authenticationService.signAuthTokens(user.id, RoleType.User);
            await userService.triggerNewUserPromotion(user.id)
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
            Validator.validateUserBody(userBody);
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

    public async updateRole(req: express.Request, res: express.Response) {
        try {
            const userId = Number(req.params.userId)
            const role = req.body.role as RoleType;
            Validator.validateUserRole(req.body.role, userId)
            const user = await userService.getByUserId(userId);
            if (!user) throw new CustomError(ErrorType.UserNotFound, "User doesn't exist", { userId });
            if (role === user.role) throw new CustomError(ErrorType.BadRequest, `Role is already ${role}`, { role })
            user.role = role
            await userService.updateUser(user)
            res.status(200).send({ data: user });
        }
        catch (err) {
            const error = ERR_HANDLER.catchError(err as Error, { url: req.originalUrl });
            res.status(error.status).send({ error: error.data });
        }
    }

}

export const userController = new UserController();
