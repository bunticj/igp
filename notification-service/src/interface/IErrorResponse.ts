import { ErrorType } from "../enum/ErrorType";

export interface IErrorResponse {
    errorType: ErrorType;
    errorName: string;
} 