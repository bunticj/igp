import { ErrorType } from "../enum/ErrorType";
import { CustomError } from "../model/CustomError";
import { ErrorResponse } from "../model/ErrorResponse";
import { IDictionary } from "./CommonInterfaces";
import { Logger } from "./Logger";

export class ErrorHandler {
    private logger: Logger
    constructor(logger: Logger) {
        this.logger = logger
    }
    private handleErrorStatus(errorType: ErrorType): number {
        switch (errorType) {
            case ErrorType.Unauthorized: return 401;
            case ErrorType.Forbidden: return 403;
            case ErrorType.NotFound:
            case ErrorType.UserNotFound:
                return 404;
            case ErrorType.UnknownError:
                return 500;
            default: return 400;
        }
    }

    /**
     * Handles errors by creating an ErrorResponse object.
     * If the error is not a CustomError, it constructs a CustomError object with the type ErrorType.UnknownError.
     * Logs critical errors and verbose information about thrown errors.
     * @param {Error} error - The error object.
     * @param {IDictionary<any>} additionalData - Additional data to include in the error response. Default is an empty object.
     * @returns {ErrorResponse} The ErrorResponse object representing the error.
     */
    public catchError(error: Error, additionalData: IDictionary = {}): ErrorResponse {
        let customError = error as CustomError;
        if (additionalData.password) additionalData.password = "*";
        if (!customError.errorType) {
            customError = new CustomError(ErrorType.UnknownError, error.message, { stack: error.stack, name: error.name });
            this.logger.critical(`unthrownError: ${JSON.stringify(customError)} \n additionalData = ${JSON.stringify(additionalData)}`);
        }
        else this.logger.error(`thrownError: ${JSON.stringify(customError)} \n additionalData = ${JSON.stringify(additionalData)}`);
        const status = this.handleErrorStatus(customError.errorType);
        return new ErrorResponse({ errorType: customError.errorType, message: error.message }, status);
    }


}
