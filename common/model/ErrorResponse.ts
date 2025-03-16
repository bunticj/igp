import { IErrorResponse } from "../util/CommonInterfaces";
export class ErrorResponse {
    data: IErrorResponse;
    status: number;
    constructor(data: IErrorResponse, status: number) {
        this.data = data;
        this.status = status || 500;
    }
}