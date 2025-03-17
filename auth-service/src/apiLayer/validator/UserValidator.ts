
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";
import { User } from "../../dataAccessLayer/entity/User";

export class UserValidator {

    public static validateUserBody(userBody: Partial<User>) {
        if (!userBody.username || typeof userBody.username !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid username", { ...userBody });
        if (!userBody.password || typeof userBody.username !== 'string') throw new CustomError(ErrorType.RequestBodyError, "Invalid password", { ...userBody });
    }


}

