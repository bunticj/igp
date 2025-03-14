import { socketManager } from "../App";
import { HelperConstants } from "../config/HelperConstants";
import { MessageType } from "../enum/MessageType";
import { SchedulerType } from "../enum/SchedulerType";
import { IAuthSocket } from "../interface/IAuthSocket";
import { CustomError } from "../model/CustomError";
import { Message } from "../model/Message";
import MessageService from "../services/MessageService";
import SchedulerService from "../services/SchedulerService";
import { errorHandler } from "../utils/ErrorHandler";
import { LOGGER } from "../utils/Logger";


export default class SocketHandler {
    public socket: IAuthSocket;
    constructor(socket: IAuthSocket, oldSocket?: IAuthSocket) {
        this.socket = socket;
        this.initializeSocketHandlers(oldSocket);
    }

    // attach listeners
    private initializeSocketHandlers(oldSocket?: IAuthSocket) {
        this.connectionHandler(oldSocket);
        this.disconnectHandler();
        this.receiveMessageHandler();
    }

    private connectionHandler(oldSocket?: IAuthSocket) {
        // handle multiple logins, disconnect the previous socket
        if (oldSocket) {
            LOGGER.debug("Reconnecting..")
            oldSocket.shouldClearData = false;
            oldSocket.disconnect()
        }
    }

    private disconnectHandler() {
        this.socket.on(HelperConstants.disconnectName, (reason) => {
            const userId = this.socket.userId!;
            LOGGER.debug(`Socket Disconnect called for ${userId}, on socket ${this.socket.id} because ${reason}`);

            // if the connection unexpectedly fails(internet issue, or something, wait for the possible
            // reconnect for 45 seconds. If it doesn't reconnect until then, trigger remove user
            // TTTEMP, should check for reason instead of ping timeout
            if (HelperConstants.skipDisconnectReasonsArray.includes("ping timeout")) SchedulerService.executeScheduler(SchedulerType.DisconnectPlayer, userId);
            else if (this.socket.shouldClearData) socketManager.removeSocket(userId);
        });
    }

    private receiveMessageHandler() {
        this.socket.on(HelperConstants.messageName, async (data) => {
            try {
                const userId = this.socket.userId!;
                LOGGER.debug(`Message received from user ${userId}. data = ${data}`);
                // Temp
                MessageService.sendMessageToUserId(userId, new Message(MessageType.PromotionMessage, { por: "bezze por useru" }))
                MessageService.sendMessageToSocketId(this.socket.id, new Message(MessageType.PromotionMessage, { por: "bezze por socketu" }))
                MessageService.broadcastMessage(new Message(MessageType.PromotionMessage, { por: "bezze por svima" }))

            }
            catch (err) {
                const errorMessage = new Message(MessageType.ErrorMessage, errorHandler(err as CustomError))
                MessageService.sendMessageToSocketId(this.socket.id, errorMessage);
            }
        });
    }

}

