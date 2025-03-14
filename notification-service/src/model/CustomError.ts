import { ErrorType } from "../enum/ErrorType";

export class CustomError<T = unknown> extends Error {
    public errorType: ErrorType;
    public additionalData: T;
    constructor(errorType: ErrorType, message: string = "", additionalData: T) {
        super();
        this.message = message;
        this.errorType = errorType;
        this.additionalData = additionalData;
    }
}