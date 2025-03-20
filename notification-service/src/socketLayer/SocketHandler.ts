import {  socketManager } from "../App";
import { HelperConstants } from "../config/HelperConstants";
import { IAuthSocket } from "../businnesLayer/interface/IAuthSocket";
import { LOGGER } from "../config/Initialize";


export class SocketHandler {
    public socket: IAuthSocket;
    constructor(socket: IAuthSocket, oldSocket?: IAuthSocket) {
        this.socket = socket;
        this.initializeSocketHandlers(oldSocket);
    }

    // attach listeners
    private initializeSocketHandlers(oldSocket?: IAuthSocket) {
        this.connectionHandler(oldSocket);
        this.disconnectHandler();
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
            if (this.socket.shouldClearData) socketManager.removeSocket(userId);
        });
    }

}

