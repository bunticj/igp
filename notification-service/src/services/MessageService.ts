import { socketManager } from "../App";
import { HelperConstants } from "../config/HelperConstants";
import { MessageType } from "../enum/MessageType";
import { KProducer } from "../kafka/KafkaProducer";
import { Message } from "../model/Message";
import { LOGGER } from "../utils/Logger";


export default class MessageService {

    public static sendMessageToSocketId<T>(socketId: string, message: Message<T>): void {
        LOGGER.debug(`Sending message ${MessageType[message.messageType]} to socket ${socketId}`)
        socketManager.io.to(socketId).emit(HelperConstants.messageName, message);
        KProducer.produceMessages()

    }

    public static sendMessageToUserId<T>(userId: number, message: Message<T>): void {
        LOGGER.debug(`Sending message ${MessageType[message.messageType]} to User ${userId}`)
        const socketId = socketManager.getSocketId(userId)
        if (socketId) socketManager.io.to(socketId).emit(HelperConstants.messageName, message);
    }

    public static broadcastMessage<T>(message: Message<T>): void {
        LOGGER.debug(`Sending message ${MessageType[message.messageType]} to all connected users`)
        socketManager.io.emit(HelperConstants.messageName, message);
    }
}

