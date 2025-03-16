import { ErrorType } from "../enum/ErrorType";
import { IDictionary } from "../util/CommonInterfaces";

export class CustomError extends Error {
    public errorType: ErrorType;
    public additionalData: IDictionary;
    constructor(errorType: ErrorType, message: string, additionalData: IDictionary = {}) {
        super();
        this.message = message;
        this.errorType = errorType;
        this.additionalData = additionalData;
    }
}