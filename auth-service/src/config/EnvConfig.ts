import * as dotenv from "dotenv";
dotenv.config();
export const EnvConfig =  {
    AUTH_SERVER_PORT: +(process.env.AUTH_SERVER_PORT)! || 3000,
    AUTH_SERVER_HOST: process.env.AUTH_SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    VERBOSE_LOGS: process.env.VERBOSE_LOGS ? true : false,
  
}