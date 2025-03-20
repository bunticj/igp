
import { RoleType } from "../../../../common/enum/RoleType";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { User } from "../../dataAccessLayer/entity/User";

export class Validator {

    public static validateUserBody(userBody: Partial<User>) {
        if (!userBody.username || typeof userBody.username !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid username", { ...userBody });
        if (!userBody.password || typeof userBody.password !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid password", { ...userBody });
    }

    public static validateUserRole(role: RoleType, userId: number) {
        if (!Number.isInteger(userId)) throw new CustomError(ErrorType.BadRequest, "Invalid User id");
        if (typeof role !== 'string' || !Object.values(RoleType).includes(role)) {
            throw new CustomError(ErrorType.RequestBodyError, "Invalid role", {role});
        }
    }
}

