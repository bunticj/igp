
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
import { KProducer } from "./kafkaLayer/KafkaProducer";

function initServer() {
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

    server.listen(EnvConfig.PROMOTION_SERVER_PORT, () => {
        LOGGER.info(`Promotion service available at ${HelperConstants.serverFullUrlName}`);
    });

}
initServer();

process.on('uncaughtException', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'uncaughtException' });
});

process.on('unhandledRejection', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'unhandledRejection' });
});

process.on('SIGTERM', async () => {
    LOGGER.info('Received SIGTERM, shutting down gracefully...');
    await KProducer.shutDown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    LOGGER.info('Received SIGINT, shutting down gracefully...');
    await KProducer.shutDown();
    process.exit(0);

});