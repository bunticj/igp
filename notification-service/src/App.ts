
import http from "http";
import https from "https";
import fs from "fs"
import { Server as IoServer } from "socket.io"
import { LOGGER } from "./businnesLayer/utils/Logger";
import { EnvConfig } from "./config/EnvConfig";
import { HelperConstants } from "./config/HelperConstants";
import { SocketManager } from "./socketLayer/SocketManager";
import { ERR_HANDLER } from "./config/Initialize";
import { KConsumer } from "./kafkaLayer/KafkaConsumer";



function initServer(): IoServer {
    let server: http.Server | https.Server;
    if (EnvConfig.HTTP_PROTOCOL_TYPE === 'https' && EnvConfig.HTTPS_KEY_PATH && EnvConfig.HTTPS_CERT_PATH) {
        const key = fs.readFileSync(`${EnvConfig.HTTPS_KEY_PATH}`);
        const cert = fs.readFileSync(`${EnvConfig.HTTPS_CERT_PATH}`);
        server = https.createServer({ key, cert });
    }
    else server = http.createServer();

    server.on('request', (req, res) => {
        if (req.method === 'GET' && req.url === '/health') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'healthy' }));
        }
    });

    const ioServer = new IoServer(server, { allowEIO3: true, cors: { origin: "*" } });

    server.listen(EnvConfig.NOTIFICATION_PORT, () => {
        LOGGER.info(`Notification service available at ${HelperConstants.serverFullUrlName}`);
    });

    return ioServer;
}

export const socketManager = new SocketManager(initServer())
process.on('uncaughtException', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'uncaughtException' });
});
process.on('unhandledRejection', (error: Error) => {
    ERR_HANDLER.catchError(error, { event: 'unhandledRejection' });
});
process.on('SIGTERM', async () => {
    LOGGER.info('Received SIGTERM, shutting down...');
    await KConsumer.shutDown();
});
process.on('SIGINT', async () => {
    LOGGER.info('Received SIGINT, shutting down...');
    await KConsumer.shutDown();
});