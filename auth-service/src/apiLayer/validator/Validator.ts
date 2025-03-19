
import { RoleType } from "../../../../common/enum/RoleType";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { User } from "../../dataAccessLayer/entity/User";

export class Validator {

    public static validateUserBody(userBody: Partial<User>) {
        if (!userBody.username || typeof userBody.username !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid username", { ...userBody });
        if (!userBody.password || typeof userBody.username !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid password", { ...userBody });
    }

    public static validateUserRole(body: Partial<User>, userId: number) {
        if (!Number.isInteger(userId)) throw new CustomError(ErrorType.BadRequest, "Invalid user id");
        if (typeof body.role !== 'string' || !Object.values(RoleType).includes(body.role as RoleType)) {
            throw new CustomError(ErrorType.RequestBodyError, "Invalid role", { ...body });
        }
    }
}

