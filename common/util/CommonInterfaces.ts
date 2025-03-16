import { ErrorType } from "../enum/ErrorType";
import { RoleType } from "../enum/RoleType";
import { TokenType } from "../enum/TokenType";

export interface IErrorResponse {
    errorType: ErrorType;
    message: string;
}

export interface IDictionary<T = any> {
    [index: string | number]: T;
}

export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
}


export interface ITokenPayload {
    sub: number;
    role: RoleType;
    tokenType: TokenType;
    iss: string;
}
