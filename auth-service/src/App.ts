
import http from "http";
import https from "https";
import cors from "cors";
import express from "express";
import fs from "fs"
import { router } from "./apiLayer/router/UserRouter";
import { EnvConfig } from "./businessLayer/config/EnvConfig";
import { HelperConstants } from "./businessLayer/config/HelperConstants";
import { LOGGER } from "./businessLayer/config/Initialize";
import { errorInterceptor } from "./apiLayer/middleware/ErrorMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./docs/swagger.json";

const expressApp: express.Application = express();

// Set middlewares
expressApp.use(cors({ origin: "*" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.use(LOGGER.winstonLogger);
expressApp.use('*', errorInterceptor);
expressApp.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
expressApp.use('/api/v1', router)

let server: http.Server | https.Server;

if (EnvConfig.HTTP_PROTOCOL_TYPE === 'https') {
    const key = fs.readFileSync(`${EnvConfig.HTTPS_KEY_PATH}`);
    const cert = fs.readFileSync(`${EnvConfig.HTTPS_CERT_PATH}`);
    server = https.createServer({ key, cert }, expressApp);
}
else server = http.createServer(expressApp);

server.listen(EnvConfig.AUTH_SERVER_PORT, () => {
    LOGGER.info(`Auth service available at ${HelperConstants.serverFullUrlName}`);
});