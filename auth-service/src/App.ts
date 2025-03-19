
import http from "http";
import https from "https";
import cors from "cors";
import express from "express";
import fs from "fs"
import { router } from "./apiLayer/router/Router";
import { EnvConfig } from "./config/EnvConfig";
import { HelperConstants } from "./config/HelperConstants";
import { ERR_HANDLER, LOGGER } from "./config/Initialize";
import { errorInterceptor } from "./apiLayer/middleware/ErrorMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./docs/swagger.json";



function initServer() {
    const expressApp: express.Application = express();

    expressApp.get('/health', (req: express.Request, res: express.Response) => {
        res.status(200).json({ status: 'healthy' });
    });
    
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

}
initServer();

process.on('uncaughtException', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'uncaughtException' });
});
process.on('unhandledRejection', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'unhandledRejection' });
});