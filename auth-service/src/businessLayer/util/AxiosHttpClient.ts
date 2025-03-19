import axios, { AxiosResponse } from "axios";
import { IDictionary } from "../../../../common/util/CommonInterfaces";


export class AxiosHttpClient {
    public static async sendRequest<T, K>(url: string, token: string, body: IDictionary<K>): Promise<AxiosResponse<T>> {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        };
        if (Object.keys(body).length) return await axios.post(url, body, { headers });
        else return await axios.get(url, { headers });
    }
}

