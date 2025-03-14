import * as dotenv from "dotenv";
dotenv.config();
export default {
    NOTIFICATION_PORT: +(process.env.NOTIFICATION_PORT)! || 5000,
    NOTIFICATION_HOST: process.env.NOTIFICATION_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    VERBOSE_LOGS: process.env.VERBOSE_LOGS ? true : false
}