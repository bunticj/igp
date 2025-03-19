import * as dotenv from "dotenv";
dotenv.config();
export const EnvConfig = {
    AUTH_SERVER_PORT: +(process.env.AUTH_SERVER_PORT)! || 3000,
    AUTH_SERVER_HOST: process.env.AUTH_SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    VERBOSE_LOGS: process.env.VERBOSE_LOGS ? true : false,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: +(process.env.DB_PORT)! || 5432,
    JWT_SECRET: process.env.JWT_SECRET!,
    PROMOTION_SERVER_PORT: +(process.env.PROMOTION_SERVER_PORT)! || 4000,
    PROMOTION_SERVER_HOST: process.env.PROMOTION_SERVER_HOST || "localhost",

}