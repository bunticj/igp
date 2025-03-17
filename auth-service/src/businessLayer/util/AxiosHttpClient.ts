import axios, { AxiosResponse } from "axios";
import { ErrorType } from "../../../../common/enum/ErrorType";
import { CustomError } from "../../../../common/model/CustomError";

export class AxiosHttpClient {
    public async sendHttpRequest<T, K>(url: string, body: K, methodCaseInsensitive: string): Promise<AxiosResponse<T>> {
        const method = methodCaseInsensitive.toLowerCase();
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        switch (method) {
            case "get": return axios.get(url, { headers });
            case "post": return axios.post(url, body, { headers });
            default: throw new CustomError(ErrorType.InvalidMethod, "Unsupported method", { method })
        }
    }
}

