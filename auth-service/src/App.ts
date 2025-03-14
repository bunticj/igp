
import http from "http";
import https from "https";
import cors from "cors";
import express from "express";
import fs from "fs"
import { LOGGER } from "./utils/Logger";
import { EnvConfig } from "./config/EnvConfig";
import { HelperConstants } from "./config/HelperConstants";

const expressApp: express.Application = express();

// Set middlewares
expressApp.use(cors({ origin: "*" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.use(LOGGER.winstonLogger);
expressApp.use('/v1/api', express.Router());

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