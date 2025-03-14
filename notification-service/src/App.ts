
import http from "http";
import https from "https";
import fs from "fs"
import { Server as IoServer } from "socket.io"
import { EnvConfig} from "./config/EnvConfig";
import { SocketManager } from "./socket/SocketManager";
import { LOGGER } from "./utils/Logger";
import { HelperConstants } from "./config/HelperConstants";
import { KConsumer } from "./kafka/KafkaConsumer";
import { errorHandler } from "./utils/ErrorHandler";
import { KProducer } from "./kafka/KafkaProducer";


function initServer() : IoServer {
    let server: http.Server | https.Server;
    if (EnvConfig.HTTP_PROTOCOL_TYPE === 'https') {
        const key = fs.readFileSync(`${EnvConfig.HTTPS_KEY_PATH}`);
        const cert = fs.readFileSync(`${EnvConfig.HTTPS_CERT_PATH}`);
        server = https.createServer({ key, cert });
    }
    else server = http.createServer();
    
    const ioServer = new IoServer(server, { allowEIO3: true, cors: { origin: "*" } });
   
    server.listen(EnvConfig.NOTIFICATION_PORT, () => {
        LOGGER.info(`Server available at ${HelperConstants.serverFullUrlName}`);
    });
    return ioServer;
}

export const socketManager = new SocketManager(initServer())

KConsumer.consumeMessages().catch(err => errorHandler(err))
KProducer.produceMessages().catch(err => errorHandler(err))
